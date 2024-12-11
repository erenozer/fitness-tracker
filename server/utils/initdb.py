import sqlite3
import sys

path = sys.argv[1]

import os

if os.path.exists(path):
    os.remove(path)

with open("schema.sql", "r") as schema_file:
    schema = schema_file.read()

conn = sqlite3.connect(path)
cursor = conn.cursor()
cursor.executescript(schema)
conn.commit()
conn.close()
