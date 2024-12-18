import sqlite3
import database


class Exercises:
    db = None
    tbl = "exercises"

    @classmethod
    def connect_to_db(cls):
        cls.db = database.get_db()

    @classmethod
    def retrieve_data(cls):
        return cls.db.retrieve_all(
            cls.tbl,
            columns=(
                "id",
                "desc",
                "body_part",
            ),
            turn_to_dict=True,
        )

    @classmethod
    def get_exercise_id_by_name(cls, name):
        return cls.db.filter(
            table=cls.tbl,
            columns=("id",),
            filters={"desc": name},
        )