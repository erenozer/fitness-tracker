import sqlite3
import database


class Workouts:
    db = None
    tbl = "workouts"

    @classmethod
    def connect_to_db(cls):
        cls.db = database.get_db()

    @classmethod
    # ! params
    def add_workout(cls):
        try:
            pass
        except sqlite3.Error as e:
            print(e)

    @classmethod
    # ! params
    def retrieve_workouts(cls, usr_id: int):
        if (
            response := cls.db.filter(
                cls.tbl,
                (
                    # ! params
                ),
                {"user_id": usr_id},
            )
        ) == []:
            return "No workouts for the user.", False
        return response
