import sqlite3
from typing import List, Dict

SQLITE3_SINGLETHREAD = True


class __DataBase:
    def __init__(self, path: str):
        self.conn = None
        self.cursor = None
        self.conn_established = False
        self.path = path

    def start_conn(self):
        if self.conn_established:
            raise Exception("[SQL] Connection already established.")
        self.conn = sqlite3.connect(self.path)
        self.cursor = self.conn.cursor()
        self.conn.row_factory = sqlite3.Row
        self.conn_established = True
        print("[SQL] START CONN")

    def end_conn(self):
        if not self.conn_established:
            raise Exception("[SQL] No connection to close.")
        self.cursor.close()
        self.conn.close()
        self.conn_established = False
        print("[SQL] END CONN")

    def add_to_table(
        self,
        table: str,
        columns: List[str],
        args: List,
        singlethread=SQLITE3_SINGLETHREAD,
    ):
        if singlethread:
            if self.conn_established:
                self.end_conn()
            self.start_conn()
        try:
            sql = f"INSERT INTO {table} {columns} VALUES ({', '.join('?' * len(args))})"
            print(f"[SQL] {sql}")
            self.cursor.execute(sql, args)
            self.conn.commit()
            if singlethread:
                self.end_conn()
            print("[SQL] SUCCESS")
        except sqlite3.Error as e:
            print("[SQL] ERROR")
            print(e)

    def filter(
        self,
        table: str,
        columns: List,
        filters: Dict,
        singlethread=SQLITE3_SINGLETHREAD,
    ) -> List:
        if singlethread:
            if self.conn_established:
                self.end_conn()
            self.start_conn()
        try:
            sql = f"SELECT {', '.join(columns)} from {table} "
            for k, v in filters.items():
                sql += f"WHERE {k} = '{v}'"
            print(f"[SQL] {sql}")
            cursor = self.cursor.execute(sql)
            data = cursor.fetchall()
            print(f"[SQL] {data}")
            if singlethread:
                self.end_conn()
            return data
        except sqlite3.Error as e:
            print(e)
            return []

    def retrieve_all(
        self,
        table: str,
        columns: List,
        turn_to_dict: bool = True,
        singlethread=SQLITE3_SINGLETHREAD,
    ):
        if singlethread:
            if self.conn_established:
                self.end_conn()
            self.start_conn()
        try:
            sql = f"SELECT {', '.join(columns)} from {table}"
            print(f"[SQL] {sql}")
            cursor = self.cursor.execute(sql)
            data = cursor.fetchall()
            if turn_to_dict:
                temp = data.copy()
                data = []
                for entry in temp:
                    data.append({})
                    i = 0
                    for colname in columns:
                        data[-1][colname] = entry[i]
                        i += 1
            print(f"[SQL] {data}")
            if singlethread:
                self.end_conn()
            return data
        except sqlite3.Error as e:
            print(e)
            return []

    def close(self):
        self.conn.close()


__db = None


def init(path: str):
    global __db
    __db = __DataBase(path)


def close():
    global __db
    __db.close()
    del __db


def get_db():
    global __db
    return __db
