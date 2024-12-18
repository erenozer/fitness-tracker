from flask import Flask, request, jsonify
from flask_cors import CORS
import database
from Users import Users
from Exercises import Exercises
from Workouts import Workouts
from WorkoutsExercises import WorkoutsExercises 
from ExerciseDetails import ExerciseDetails

app = Flask(__name__)
CORS(app)
app.config["DEBUG"] = True


@app.route("/register_usr", methods=["POST"])
def register_usr():
    if request.content_type != "application/json":
        return jsonify({"message": "Unsupported Media Type"}), 415
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        msg, response = Users.add_usr(username, password)
        if response is False:
            return jsonify({"message": msg}), 400
        else:
            return jsonify({"message": msg}), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500


@app.route("/validate_usr", methods=["POST"])
def validate_usr():
    if request.content_type != "application/json":
        return jsonify({"message": "Content-Type must be application/json"}), 400
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        msg, response, user_id = Users.validate_usr(username, password)
        if response is False:
            return jsonify({"message": msg}), 401
        else:
            return jsonify({"message": msg, "user_id": user_id}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500


@app.route("/get_exercises_lst", methods=["GET"])
def get_exercises_lst():
    # No arguments.
    try:
        exercises = Exercises.retrieve_data()
        return jsonify({"exercises": exercises})
    except Exception as e:
        return jsonify({"message": str(e)}), 500


@app.route("/add_workout", methods=["POST"])
def add_workout():
    try:
        data = request.json
        exercises = data.get("exercises")
        user_id = data.get("user_id")  # Add user_id from request

        if not exercises or not user_id:
            return jsonify({"message": "User ID and exercises are required"}), 400

        # Add new workout
        workout_id = Workouts.add_workout(user_id)
        if workout_id == -1:
            return jsonify({"message": "Error creating workout"}), 500

        # Add exercises with repetitions and weights to the workout
        for exercise in exercises:
            exercise_id = Exercises.get_exercise_id_by_name(exercise["exercise"])
            if not exercise_id:
                return jsonify({"message": f"Exercise {exercise['exercise']} not found"}), 404

            # Add exercise to workout
            workout_exercise_id = WorkoutsExercises.add_exercise_to_workout(
                workout_id=workout_id,
                exercise_id=exercise_id
            )

            # Add exercise details (reps and weight)
            if workout_exercise_id != -1:
                ExerciseDetails.add_excercise_detail(
                    workout_exercise_id=workout_exercise_id,
                    repetitions=exercise["repetitions"],
                    weight=exercise["weight"]
                )

        return jsonify({"message": "Workout added successfully"}), 201
    except Exception as e:
        print(f"Error adding workout: {e}")
        return jsonify({"message": "Error adding workout"}), 500


@app.route("/get_workouts", methods=["POST"])
def get_workouts():
    try:
        data = request.get_json()
        usr_id = data.get("user_id")
        
        if not usr_id:
            return jsonify({"message": "User ID is required"}), 400
            
        workouts = Workouts.get_workouts(usr_id)
        return jsonify({"workouts": workouts}), 200
    except Exception as e:
        print(f"Error getting workouts: {e}")
        return jsonify({"message": "Error retrieving workouts"}), 500


@app.endpoint
def close_app():
    database.close()


# ! ----------------------------------------
if __name__ == "__main__":
    database.init("data.db")
    Users.connect_to_db()
    Exercises.connect_to_db()
    Workouts.connect_to_db()
    app.run(port=4040, debug=True)
