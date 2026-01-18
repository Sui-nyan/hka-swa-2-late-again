import xml.etree.ElementTree as ET
import psycopg2
import requests
import os
import dotenv

from dotenv import dotenv_values

dotenv.load_dotenv('.env')

DATABASE_URL = os.getenv("DATABASE_URL")

print(f"{DATABASE_URL=}")

if DATABASE_URL is None:
    raise ValueError("no db url")

config = dotenv_values(".env.local")
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

def import_stations(xml_response, skipconfirm=False):
    """Parse XML response and insert into database"""
    root = ET.fromstring(xml_response)
    
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    
    # Formatting stuff
    def wrap_list_curly(arr: list):
        return '{' + ','.join(arr) + '}'
    # Formatting Stuff2
    def listify_vbar(s: str) -> list:
        return [p.strip() for p in s.split("|")]

    num_stations = len(root.findall("station"))
    print(f"Found ({num_stations}) stations")
    if not skipconfirm:
        for station in root.findall("station"):
            print(station.get('name'), station.get('eva'))
    
    if not skipconfirm and (num_stations == 0 or input("Proceed? (y/N)") != 'y'):
        print("Cancelled")
        return
    
    for station in root.findall("station"):
        try:
            cursor.execute(
                """INSERT INTO "Station" (ds100, eva, name, meta, p, "isDb") 
                    VALUES (%s, %s, %s, %s, %s, %s)
                    ON CONFLICT (ds100) DO UPDATE SET eva=EXCLUDED.eva, name=EXCLUDED.name""",
                    (
                        station.get("ds100"),
                        int(station.get("eva")),
                        station.get("name"),
                        wrap_list_curly(listify_vbar(station.get("meta") or "")),
                        wrap_list_curly(listify_vbar(station.get("p") or "")),
                        station.get('db'),
                    )
                )
        except Exception as e:
            print(f"Error inserting {station.get('name')}: {e}")
    
    conn.commit()
    cursor.close()
    conn.close()
    print(f"Imported stations")

def get_and_insert_stations(searchpattern: str):
    import_stations(get_stations(searchpattern), skipconfirm=True)
    
if __name__ == "__main__":
    import_stations(get_stations("*"), True)