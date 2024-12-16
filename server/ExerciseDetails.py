import sqlite3
import database


class Workouts:
    db = None
    tbl = "exercise_details"

    @classmethod
    def connect_to_db(cls):
        cls.db = database.get_db()

    @classmethod
    def add_excercise_detail(cls, workout_id: int, exercise_id: int) -> int:
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
    def retrieve_data(cls):
        return cls.db.retrieve_all(
            cls.tbl,
            columns=(
                "workout_id",
                "exercise_id",
            ),
            turn_to_dict=True,
        )
