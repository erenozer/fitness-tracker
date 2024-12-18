import sqlite3
import database
from PasswordManager import PasswordManager
from datetime import datetime


class Users:
    db = None
    tbl = "users"

    @classmethod
    def connect_to_db(cls):
        cls.db = database.get_db()

    @classmethod
    def add_usr(cls, name: str, password: str):
        try:
            if (
                cls.db.filter(table=cls.tbl, columns=("id",), filters={"name": name})
                != []
            ):
                return "Username taken", False
            salt = PasswordManager.generate_salt()
            hashed = PasswordManager.encode_password(password, salt)
            date_created = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            cls.db.add_to_table(
                table=cls.tbl,
                columns=("name", "hashed_pw", "salt", "date_created"),
                args=(name, hashed.hex(), salt.hex(), date_created),
            )
            return "User created", True
        except sqlite3.Error as e:
            print(e)

    @classmethod
    def validate_usr(cls, name: str, password: str):
        if (
            response := cls.db.filter(
                cls.tbl,
                columns=(
                    "hashed_pw",
                    "salt",
                    "id",
                ),
                filters={"name": name},
            )
        ) == []:
            return "User does not exist", False, None
        orig_hsh, salt, user_id = response[0]
        print(f"[SERVER] hashed_pw: {orig_hsh}")
        print(f"[SERVER] salt: {salt}")
        if PasswordManager.verify_password(
            stored_pw=orig_hsh, prov_pw=password, salt=salt
        ):
            return "Validated", True, user_id
        return "Invalid password", False, None
