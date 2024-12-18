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
                columns=("workout_exercise_id", "repetitions", "weight",),
                args=(workout_exercise_id, repetitions, weight),
            )
        except sqlite3.Error as e:
            print(f"Error linking exercise {workout_exercise_id} to workout {repetitions} to workout {weight}: {e}")
            return -1
        
    @classmethod
    def retrieve_data(cls):
        return cls.db.retrieve_all(
            cls.tbl,
            columns=(
                "workout_exercise_id",
                "repetitions",
                "weight",
            ),
            turn_to_dict=True,
        )
