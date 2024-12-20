import sqlite3
import database


class WorkoutsExercises:
    db = None
    tbl = "workouts_exercises"

    @classmethod
    def connect_to_db(cls):
        cls.db = database.get_db()


    @classmethod
    def add_exercise_to_workout(cls, workout_id: int, exercise_id: int) -> int:
        try:
            return cls.db.add_to_table(
                table=cls.tbl,
                columns=("workout_id", "exercise_id"),
                args=(workout_id, exercise_id),
            )
        except sqlite3.Error as e:
            print(f"Error linking exercise {exercise_id} to workout {workout_id}: {e}")
            return -1
        
    @classmethod
    def retrieve_data(cls, user_id: int):
        """Modified to only return workout exercises for a user's workouts"""
        query = """
            SELECT we.id, we.workout_id, we.exercise_id
            FROM workouts_exercises we
            JOIN workouts w ON we.workout_id = w.id
            WHERE w.user_id = ?
        """
        try:
            results = cls.db.execute_custom_query(query, (user_id,), turn_to_dict=True)
            return results if results else []
        except sqlite3.Error as e:
            print(f"Error retrieving workout exercises for user {user_id}: {e}")
            return []

    @classmethod
    def get_by_workout_id(cls, workout_id: int):
        try:
            return cls.db.filter(
                table=cls.tbl,
                columns=("id", "workout_id", "exercise_id"),
                filters={"workout_id": workout_id},
            )
        except sqlite3.Error as e:
            print(f"Error retrieving exercises for workout {workout_id}: {e}")
            return []
    @classmethod    
    def delete_workout_exercise(cls, workout_exercise_id: int) -> bool:
        try:
            query = "DELETE FROM workouts_exercises WHERE id = ?"
            cls.db.execute_custom_query(query, (workout_exercise_id,))
            return True
        except sqlite3.Error as e:
            print(f"Error deleting workout exercise with id {workout_exercise_id}: {e}")
            return False
