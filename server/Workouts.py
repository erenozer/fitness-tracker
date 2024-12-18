import sqlite3
import database


class Workouts:
    db = None
    tbl = "workouts"

    @classmethod
    def connect_to_db(cls):
        cls.db = database.get_db()

    @classmethod
    def add_workout(cls, user_id: int) -> int:
        try:
            return cls.db.add_to_table(
                table=cls.tbl,
                columns=["user_id"],  # Fix: Use list instead of string
                args=(user_id,),      # Fix: Add comma to make it a tuple
            )
        except sqlite3.Error as e:
            print(f"Error adding workout for user {user_id}: {e}")
            return -1

    @classmethod
    def retrieve_data(cls):
        return cls.db.retrieve_all(
            cls.tbl,
            columns=(
                "id",
                "user_id",
                "date_created",
            ),
            turn_to_dict=True,
        )

    @classmethod
    def get_workouts(cls, user_id: int):
        try:
            return cls.db.retrieve_filtered(
                table=cls.tbl,
                columns=["id", "user_id", "date_created"],
                where_clause="user_id = ?",
                args=(user_id,),
                turn_to_dict=True
            )
        except sqlite3.Error as e:
            print(f"Error retrieving workouts for user {user_id}: {e}")
            return []
