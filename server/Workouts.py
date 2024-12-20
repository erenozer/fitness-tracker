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
        return cls.db.filter(
            table=cls.tbl,
            columns=("id", "user_id", "date_created"),
            filters={"user_id": user_id},
            turn_to_dict=True,
            order_by="date_created DESC"
        )

    @classmethod
    def get_workouts(cls, user_id: int):
        try:
            return cls.db.filter(
                table=cls.tbl,
                columns=("id", "user_id", "date_created"),
                filters={"user_id": user_id},
                order_by="date_created DESC"
            )
        except sqlite3.Error as e:
            print(f"Error retrieving workouts for user {user_id}: {e}")
            return []
        
    @classmethod
    def delete_workout(cls, workout_id: int) -> bool:
        try:
            # First, delete all exercise details for this workout
            query1 = """
                DELETE FROM exercise_details 
                WHERE workout_exercise_id IN (
                    SELECT id FROM workouts_exercises 
                    WHERE workout_id = ?
                )
            """
            
            # Then delete all workout-exercise associations
            query2 = """
                DELETE FROM workouts_exercises 
                WHERE workout_id = ?
            """
            
            # Finally delete the workout itself
            query3 = """
                DELETE FROM workouts 
                WHERE id = ?
            """
            
            # Execute queries in order
            cls.db.execute_custom_query(query1, (workout_id,))
            cls.db.execute_custom_query(query2, (workout_id,))
            cls.db.execute_custom_query(query3, (workout_id,))
            
            return True
        except sqlite3.Error as e:
            print(f"Error deleting workout {workout_id}: {e}")
            return False