import xml.etree.ElementTree as ET
import psycopg2
import requests
import os
import dotenv
from dotenv import dotenv_values

import datetime
from bs4 import BeautifulSoup

dotenv.load_dotenv('.env')

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

def better_get_plan(evaNo: str, dateYYMMDD: str, hourHH: str):
    """Returns the stops for the given station EVA number, date (YYMMDD) and hour (HH)."""
    url = base_url + f"plan/{evaNo}/{dateYYMMDD}/{hourHH}"
    res = requests.get(url, headers=headers)
    res.raise_for_status()
    
    def soupify_xml(data: str):
        return BeautifulSoup(data, "xml")
    
    soup = soupify_xml(res.text)

    date_or_none = lambda d: yymmddhhmm_to_date(d) if d else None
        
    # pt   DateTime // planned time
    # cs   String // Event status
    # ct   DateTime? // changed time
    # clt  DateTime? // cancelled time
    # ppth String[] // planned path
    def parse_ar(ar: BeautifulSoup):
        return {
            "pt": date_or_none(ar.get("pt")), # planned time
            "ppth": wrap_list_curly(listify_vbar(ar.get("ppth"))),
        }

    def parse_dp(dp: BeautifulSoup):
        return parse_ar(dp)

    def parse_tl(tl: BeautifulSoup):
        return {
            "c": tl.get("c"), # e.g. ICE, RE
            "n": tl.get("n"), # train number
            "f": tl.get("f"), # filter flag
            "o": tl.get("o"), # owner
            "t": tl.get("t"), # trip type {p,e,z,s,h,n}
        }

    def parse_stop(s):
        ar = parse_ar(s.ar) if s.ar else None # arrival
        dp = parse_dp(s.dp) if s.dp else None # departure
        tl = parse_tl(s.tl) if s.tl else None # track/ platform
        return {
            "id": s.get("id"),
            "ar": ar,
            "dp": dp,
            "tl": tl
        }
        
    stops = soup.find_all("s")
    return {
        "eva": None,
        "s": [parse_stop(s) for s in stops]
    }

def insert_stop(cur, stop, plan_id):
    # 2a. Insert TrainInfo (requires Category)
    train_info_id = insert_train_info(cur, stop["tl"])

    # 2b. Insert Stop
    cur.execute(
        """
        INSERT INTO "Stop" (id, "trainInfoId", "planId")
        VALUES (%s, %s, %s)
        RETURNING id
        """,
        (stop["id"], train_info_id, plan_id)
    )
    stop_id = cur.fetchone()[0]

    # 2c. Insert Arrival (optional)
    if stop.get("ar"):
        insert_arrival(cur, stop["ar"], stop_id)

    # 2d. Insert Departure (optional)
    if stop.get("dp"):
        insert_departure(cur, stop["dp"], stop_id)

    return stop_id

def insert_train_info(cur, tl):
    # Insert TrainInfo
    cur.execute(
        """
        INSERT INTO "TrainInfo" (c, n, f, o, t)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id
        """,
        (tl["c"], tl["n"], tl["f"], tl["o"], tl["t"])
    )
    return cur.fetchone()[0]

def insert_arrival(cur, ar, stop_id):
    cur.execute(
        """
        INSERT INTO "Arrival" (pt, ppth, "stopId")
        VALUES (%s, %s, %s)
        """,
        (ar["pt"], ar["ppth"], stop_id)
    )
    
def insert_departure(cur, dp, stop_id):
    cur.execute(
        """
        INSERT INTO "Departure" (pt, ppth, "stopId")
        VALUES (%s, %s, %s)
        """,
        (dp["pt"], dp["ppth"], stop_id)
    )
    
def import_plan(evaNo: str, dateYYMMDD: str, hourHH: str):
    """Parse XML response and insert into database"""
    plan: dict = better_get_plan(evaNo, dateYYMMDD, hourHH) # eva is broken somehow
    stops = plan['s']
    
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    
    # 1. Insert Plan
    cursor.execute(
        "INSERT INTO \"Plan\" (eva, \"targetDatetime\") VALUES (%s, %s) RETURNING id",
        (evaNo, dateYYMMDD+hourHH)
    )
    plan_id = cursor.fetchone()[0]

    for stop in stops:
        insert_stop(cursor, stop, plan_id)
    
    conn.commit()
    cursor.close()
    conn.close()
    print(f"Imported {len(stops)} stops")


def get_timeslots(yymmdd: int, hh:int, dtBefore:int, dtAfter:int) -> tuple[str, str]:
    results = []
    # before
    for dt in range(-dtBefore, 0, 1):
        vdate = yymmdd
        vhour = hh + dt
        while vhour < 0:
            vhour += 24
            vdate -= 1
        results.append((vdate, vhour))
    
    # now & later
    for dt in range(0, dtAfter + 1):
        vdate = yymmdd
        vhour = hh + dt
        while vhour > 23:
            vdate += 1
            vhour -= 24
        results.append((vdate, vhour))

    return results
        
if __name__ == "__main__":
    EVA_KARLSRUHE = '8000191'
    EVA_NEUBURG = "8004254"
    
    # EVA_NEUBURG_IDK_INVALID = '788711'
    
    for (yymmdd, hh) in get_timeslots(260121, 18, dtBefore=8, dtAfter=24):
        for eva in [EVA_KARLSRUHE, EVA_NEUBURG]:
            try:                
                print(f"Fetching {eva} ({yymmdd} @ {hh}:00)")
                import_plan(eva, yymmdd, hh)
            except Exception as e:
                print(f'Failed: {e}')
