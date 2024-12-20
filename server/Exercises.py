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
            columns=("id", "desc"),
            filters={"desc": name},
        )

    @classmethod
    def get_exercise_by_id(cls, exercise_id: int):
        try:
            return cls.db.filter(
                table=cls.tbl,
                columns=("id", "desc", "body_part"),
                filters={"id": exercise_id},
            )
        except sqlite3.Error as e:
            print(f"Error retrieving exercise with id {exercise_id}: {e}")
            return []