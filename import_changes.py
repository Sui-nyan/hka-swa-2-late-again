import psycopg2
import requests
import os
import dotenv
from dotenv import dotenv_values

import datetime
from bs4 import BeautifulSoup

dotenv.load_dotenv('.env')

# DATABASE_URL = os.getenv("DATABASE_URL")
DATABASE_URL = os.getenv("DATABASE_URL").replace("db", "localhost")

print(f"{DATABASE_URL=}")

if DATABASE_URL is None:
    raise ValueError("no db url")

config = dotenv_values(".env")
CLIENT_ID = config.get("CLIENT_ID")
API_KEY = config.get("API_KEY")
base_url = "https://apis.deutschebahn.com/db-api-marketplace/apis/timetables/v1/"

headers = {
    "DB-Client-Id": CLIENT_ID,
    "DB-Api-Key": API_KEY,
    "accept": "application/xml"
}

def get_stations(pattern: str):
    url = base_url + f"station/{pattern}"
    response = requests.get(url, headers=headers)
    return response.text

def yymmddhhmm_to_date(s: str) -> datetime.date:
    return datetime.datetime(
        year=int(f'20{s[0:2]}'),
        month=int(s[2:4]),
        day=int(s[4:6]),
        hour=int(s[6:8]),
        minute=int(s[8:10]))
    
# Formatting stuff
def wrap_list_curly(arr: list):
    return '{' + ','.join(arr) + '}'
# Formatting Stuff2
def listify_vbar(s: str) -> list:
    return [p.strip() for p in s.split("|")]

def parse_change_soup(soup):
    # print(soup.prettify())

    def parse_stop_change(s):
        date_or_none = lambda d: yymmddhhmm_to_date(d) if d else None
    
        # ct  DateTime? // Changed time
        # clt DateTime? // Cancellation time
        # cs  String? // Change Status
        def parse_ar(ar: BeautifulSoup):
            return {
                "ct": date_or_none(ar.get("ct")), # changed time
                "clt": date_or_none(ar.get("clt")), # Cancelled Time
                "cs": ar.get("cs"),
            }

        def parse_dp(dp: BeautifulSoup):
            return parse_ar(dp)
        
        ar = parse_ar(s.ar) if s.ar else None # arrivalChange
        dp = parse_dp(s.dp) if s.dp else None # departureChanges
        return {
            "id": s.get("id"),
            "ar": ar,
            "dp": dp,
        }
        
    stopChanges = [parse_stop_change(s) for s in soup.find_all("s")]
    
    def isChangeRelevant(s) -> bool:
        def isNotEmpty(obj):
            if obj is None:
                return False
            return bool(obj.get('ct') or obj.get('clt') or obj.get('cs'))
        return isNotEmpty(s.get('ar')) or isNotEmpty(s.get('dp'))
    
    stopChanges = [s for s in stopChanges if isChangeRelevant(s)]
    return {
        "s": stopChanges
    }

def get_full_changes(evaNo: str):
    """Returns the stops changesfor the given station EVA number"""
    url = base_url + f"fchg/{evaNo}"
    res = requests.get(url, headers=headers)
    res.raise_for_status()
    
    def soupify_xml(data: str):
        return BeautifulSoup(data, "xml")
    
    soup = soupify_xml(res.text)
    return parse_change_soup(soup)

def get_recent_changes(evaNo: str):
    """Returns the RECENT stops for the given station EVA number"""
    url = base_url + f"rchg/{evaNo}"
    res = requests.get(url, headers=headers)
    res.raise_for_status()
    
    def soupify_xml(data: str):
        return BeautifulSoup(data, "xml")
    
    soup = soupify_xml(res.text)
    return parse_change_soup(soup)

def is_time_different_or_cancelled(cur, stopChange):
    
    def isClearlyChanged(o):
        if o is None:
            return False
        return o['clt'] or o['cs']
    
    if isClearlyChanged(stopChange['ar']) or isClearlyChanged(stopChange['dp']):    
        return True
    
    def time_dt(ardp_type: str, ardp_obj: dict):
        if ardp_obj is None:
            return 0
        
        cur.execute(
            f"""
            SELECT *
                FROM "{ardp_type}" d
                JOIN "Stop" st
                ON st.id = d."stopId"
                JOIN "Plan" p
                ON st."planId" = p."id"
                JOIN "Station" s
                ON p."eva" = s."eva"
                WHERE st.id = %s;
            """,
            (stopChange['id'], ))
        result = cur.fetchone()
        if not result:
            return 1 # dunno where this is from
        planned_time = result[0]
        actual_time = ardp_obj['ct']
        delay_seconds = (actual_time - planned_time).total_seconds()
        # if (delay_seconds != 0):
        #     print('  ', ardp_type)
        #     print('\t', "Planned", planned_time)
        #     print('\t', "Actual", actual_time)
        return delay_seconds
        
    if stopChange['ar'] and time_dt("Arrival", stopChange['ar']) != 0:
        return True

    if stopChange['dp'] and time_dt("Departure", stopChange['dp']) != 0:
        return True
    return False
    

def insert_stop_change(cur, stopChange, referenceStopId):
    # 2b. Insert StopChange
    cur.execute(
        """
        INSERT INTO "StopChange" ("referenceId")
        VALUES (%s)
        RETURNING id
        """,
        (referenceStopId, )
    )
    stopChangeId = cur.fetchone()[0]

    # 2c. Insert Arrival (optional)
    if stopChange.get("ar"):
        insert_arrival(cur, stopChange["ar"], stopChangeId)

    # 2d. Insert Departure (optional)
    if stopChange.get("dp"):
        insert_departure(cur, stopChange["dp"], stopChangeId)

    return stopChangeId

def insert_arrival(cur, ar, stop_id):
    cur.execute(
        """
        INSERT INTO "ArrivalChange" (ct, clt, cs, "stopChangeId")
        VALUES (%s, %s, %s, %s)
        """,
        (ar["ct"], ar["clt"], ar["cs"], stop_id)
    )
    
def insert_departure(cur, dp, stop_id):
    cur.execute(
        """
        INSERT INTO "DepartureChange" (ct, clt, cs, "stopChangeId")
        VALUES (%s, %s, %s, %s)
        """,
        (dp["ct"], dp["clt"], dp["cs"], stop_id)
    )
    
def import_full_changes(evaNo: str):
    """Parse XML response and insert into database"""
    plan: dict = get_full_changes(evaNo)
    stopChanges = plan['s']
    
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    stopChanges = [s for s in stopChanges if is_time_different_or_cancelled(cursor, s)]
    
    for stop in stopChanges:
        # print(stop)
        insert_stop_change(cursor, stop, stop["id"])
    
    conn.commit()
    cursor.close()
    conn.close()
    print(f"Imported {len(stopChanges)} stops")
    
def import_recent_changes(evaNo: str):
    """Parse XML response and insert into database"""
    plan: dict = get_recent_changes(evaNo)
    stopChanges = plan['s']
    
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    stopChanges = [s for s in stopChanges if is_time_different_or_cancelled(cursor, s)]
    
    for stop in stopChanges:
        # print(stop)
        insert_stop_change(cursor, stop, stop["id"])
    
    conn.commit()
    cursor.close()
    conn.close()
    print(f"Imported {len(stopChanges)} stops [{evaNo}]")

if __name__ == "__main__":
    import time
    
    EVA_KARLSRUHE = '8000191'
    EVA_NEUBURG = "8004254"
    evas = [
        EVA_KARLSRUHE,
        EVA_NEUBURG,
        "8004333", # Stuttgart
        "8000002", # Aalen
        "8000170", # Ulm
    ]
    
    print("Pulling full changes")
    for eva in evas:
        import_full_changes(eva)

    last_time = datetime.datetime.now()
    while True:
        now = datetime.datetime.now()
        if (now - last_time).total_seconds() > 30:
            print("Pulling recent changes:", now)
            for eva in evas:
                import_recent_changes(eva)
            last_time = now
            
        time.sleep(1) # wait 30s
