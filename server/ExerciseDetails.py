import sqlite3
import database


class ExerciseDetails:
    db = None
    tbl = "exercise_details"

    @classmethod
    def connect_to_db(cls):
        cls.db = database.get_db()

    @classmethod
    def add_excercise_detail(cls, workout_exercise_id: int, repetitions: int, weight: int) -> int:
        try:
            return cls.db.add_to_table(
                table=cls.tbl,
                columns=("workout_exercise_id", "repetitions", "weight"),
                args=(workout_exercise_id, repetitions, weight),
            )
        except sqlite3.Error as e:
            print(f"Error linking exercise {workout_exercise_id} to workout {repetitions} to workout {weight}: {e}")
            return -1
        
    @classmethod
    def retrieve_data(cls, user_id: int):
        """Modified to only return exercise details for a user's workouts"""
        query = """
            SELECT ed.workout_exercise_id, ed.repetitions, ed.weight
            FROM exercise_details ed
            JOIN workouts_exercises we ON ed.workout_exercise_id = we.id
            JOIN workouts w ON we.workout_id = w.id
            WHERE w.user_id = ?
        """
        try:
            results = cls.db.execute_custom_query(query, (user_id,), turn_to_dict=True)
            return results if results else []
        except sqlite3.Error as e:
            print(f"Error retrieving exercise details for user {user_id}: {e}")
            return []

    @classmethod
    def get_by_workout_exercise_id(cls, workout_exercise_id: int):
        try:
            return cls.db.filter(
                table=cls.tbl,
                columns=("workout_exercise_id", "repetitions", "weight"),
                filters={"workout_exercise_id": workout_exercise_id},
            )
        except sqlite3.Error as e:
            print(f"Error retrieving exercise details for workout_exercise_id {workout_exercise_id}: {e}")
            return []

    @classmethod
    def update_exercise_detail(cls, workout_exercise_id: int, repetitions: int, weight: int) -> bool:
        try:
            query = """
                UPDATE exercise_details
                SET repetitions = ?, weight = ?
                WHERE workout_exercise_id = ?
            """
            cls.db.execute_custom_query(query, (repetitions, weight, workout_exercise_id))
            return True
        except sqlite3.Error as e:
            print(f"Error updating exercise details for workout_exercise_id {workout_exercise_id}: {e}")
            return False

    @classmethod
    def delete_exercise_detail(cls, workout_exercise_id: int) -> bool:
        try:
            query = "DELETE FROM exercise_details WHERE workout_exercise_id = ?"
            cls.db.execute_custom_query(query, (workout_exercise_id,))
            return True
        except sqlite3.Error as e:
            print(f"Error deleting exercise details for workout_exercise_id {workout_exercise_id}: {e}")
            return False
