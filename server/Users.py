import sqlite3
import database
import hashlib
import os
from datetime import datetime


def encode_password(pw: str, salt: bytes = None):
    if salt is None:
        salt = os.urandom(16)
    return hashlib.pbkdf2_hmac("sha256", pw.encode("utf-8"), salt, 100000)


class Users:
    db = None

    @classmethod
    def connect_to_db(cls):
        cls.db = database.get_db()

    @classmethod
    def add_usr(cls, name: str, password: str):
        try:
            if (
                cls.db.filter(table="users", params=("id",), filters={"name": name})
                != []
            ):
                return "Username taken", False
            salt = os.urandom(16)
            hashed = encode_password(password, salt)
            date_created = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            cls.db.add_to_table(
                table="users",
                params=("name", "hashed_pw", "salt", "date_created"),
                args=(name, hashed.hex(), salt.hex(), date_created),
            )
            return "User created", True
        except sqlite3.Error as e:
            print(e)

    @classmethod
    def validate_usr(cls, name: str, password: str):
        if (
            response := cls.db.filter(
                "users",
                (
                    "hashed",
                    "salt",
                ),
                {"name": name},
            )
        ) == []:
            return "User does not exist", False
        orig_hsh, salt = response[0]
        hashed = encode_password(password, bytes.fromhex(salt)).hex()
        if hashed == orig_hsh:
            return "Validated", True
        return "Invalid password", False
