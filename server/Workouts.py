from datetime import datetime
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
            date_created = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            workout_id = cls.db.add_to_table(
                table=cls.tbl,
                columns=("user_id", "date_created"), 
                args=(user_id, date_created),
            )
            print(f"Created workout with id: {workout_id}")  # Debug log
            return workout_id
        except sqlite3.Error as e:
            print(f"Error adding workout for user {user_id}: {e}")
            return -1

    @classmethod
    def retrieve_data(cls, user_id: int):
        """Modified to only return workouts for a specific user"""
        return cls.db.filter(
            table=cls.tbl,
            columns=("id", "user_id", "date_created"),
            filters={"user_id": user_id},
            turn_to_dict=True,
        )

    @classmethod
    def get_workouts(cls, user_id: int):
        try:
            return cls.db.filter(
                table=cls.tbl,
                columns=("id", "user_id", "date_created"),
                filters={"user_id": user_id},
            )
        except sqlite3.Error as e:
            print(f"Error retrieving workouts for user {user_id}: {e}")
            return []
