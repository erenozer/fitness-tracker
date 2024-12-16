import sqlite3
import database


class Workouts:
    db = None
    tbl = "workouts"

    @classmethod
    def connect_to_db(cls):
        """
        Connect to the database by initializing the database connection.
        """
        cls.db = database.get_db()

    @classmethod
    def add_workout(cls, user_id: int):
        """
        Adds a new workout entry for a user.

        :param user_id: ID of the user performing the workout.
        """
        try:
            query = f"INSERT INTO {cls.tbl} (user_id) VALUES (?)"
            cls.db.execute(query, (user_id,))
            cls.db.commit()
            return "Workout added successfully."
        except sqlite3.Error as e:
            print(f"Error adding workout: {e}")
            return "Failed to add workout."

    @classmethod
    def retrieve_workouts(cls, user_id: int):
        """
        Retrieve all workouts for a specific user.

        :param user_id: User ID to filter workouts.
        :return: List of workouts or a message if none found.
        """
        try:
            query = f"SELECT * FROM {cls.tbl} WHERE user_id = ?"
            response = cls.db.fetch_all(query, (user_id,))
            if not response:
                return "No workouts for the user.", False
            return response
        except sqlite3.Error as e:
            print(f"Error retrieving workouts: {e}")
            return "Failed to retrieve workouts.", False

    @classmethod
    def delete_workout(cls, workout_id: int):
        """
        Deletes a workout entry by its ID.

        :param workout_id: ID of the workout to delete.
        """
        try:
            query = f"DELETE FROM {cls.tbl} WHERE id = ?"
            cls.db.execute(query, (workout_id,))
            cls.db.commit()
            return "Workout deleted successfully."
        except sqlite3.Error as e:
            print(f"Error deleting workout: {e}")
            return "Failed to delete workout."

    @classmethod
    def update_workout(cls, workout_id: int, new_user_id: int):
        """
        Updates a workout's user ID.

        :param workout_id: ID of the workout to update.
        :param new_user_id: New user ID to associate with the workout.
        """
        try:
            query = f"UPDATE {cls.tbl} SET user_id = ? WHERE id = ?"
            cls.db.execute(query, (new_user_id, workout_id))
            cls.db.commit()
            return "Workout updated successfully."
        except sqlite3.Error as e:
            print(f"Error updating workout: {e}")
            return "Failed to update workout."
