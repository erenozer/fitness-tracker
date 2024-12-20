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


@app.route("/add_workout", methods=["POST"])
def add_workout():
    try:
        data = request.json
        exercises = data.get("exercises")
        user_id = data.get("user_id")

        if not exercises or not user_id:
            return jsonify({"message": "User ID and exercises are required"}), 400

        # Add new workout
        workout_id = Workouts.add_workout(user_id)
        if workout_id == -1:
            return jsonify({"message": "Error creating workout"}), 500

        # Add exercises with repetitions and weights to the workout
        for exercise in exercises:
            exercise_name = exercise["exercise"]
            result = Exercises.get_exercise_id_by_name(exercise_name)
            if not result or len(result) == 0:
                return jsonify({"message": f"Exercise {exercise_name} not found"}), 404
                
            exercise_id = result[0][0]  # Get the first ID from the result tuple

            # Add exercise to workout
            workout_exercise_id = WorkoutsExercises.add_exercise_to_workout(
                workout_id=workout_id,
                exercise_id=exercise_id
            )

            if workout_exercise_id != -1:
                ExerciseDetails.add_excercise_detail(
                    workout_exercise_id=workout_exercise_id,
                    repetitions=int(exercise["repetitions"]),
                    weight=int(exercise["weight"])
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


@app.route("/get_workout_details", methods=["POST"])
def get_workout_details():
    try:
        data = request.get_json()
        user_id = data.get("user_id")
        
        if not user_id:
            return jsonify({"message": "User ID is required"}), 400
            
        workouts_data = Workouts.get_workouts(user_id)
        if not workouts_data:
            return jsonify({'workouts': {}}), 200

        workouts = {}
        for workout in workouts_data:
            workout_id = workout[0]
            workout_exercises = WorkoutsExercises.get_by_workout_id(workout_id)
            
            exercises_list = []
            for we in workout_exercises:
                exercise_id = we[2]
                we_id = we[0]  # This is the workout_exercise_id
                
                exercise_details = ExerciseDetails.get_by_workout_exercise_id(we_id)
                if exercise_details:
                    exercise_info = Exercises.get_exercise_by_id(exercise_id)
                    if exercise_info:
                        exercises_list.append({
                            'id': we_id,  # Include the workout_exercise_id
                            'name': exercise_info[0][1],
                            'repetitions': exercise_details[0][1],
                            'weight': exercise_details[0][2]
                        })
            
            workouts[workout_id] = {
                'date': workout[2],
                'exercises': exercises_list
            }
        
        return jsonify({'workouts': workouts}), 200
    except Exception as e:
        print(f"Error getting workout details: {e}")
        return jsonify({"message": "Error retrieving workout details"}), 500

@app.route("/get_exercises_lst", methods=["GET"])
def get_exercises_lst():
    # 
    try:
        exercises = Exercises.retrieve_data()
        return jsonify({"exercises": exercises})
    except Exception as e:
        return jsonify({"message": str(e)}), 500


@app.route("/update_exercise_detail", methods=["POST"])
def update_exercise_detail():
    try:
        data = request.get_json()
        workout_exercise_id = data.get("workout_exercise_id")
        repetitions = data.get("repetitions")
        weight = data.get("weight")

        if not all([workout_exercise_id, repetitions, weight]):
            return jsonify({"message": "Missing required fields"}), 400

        # Validate the parameters are integers
        try:
            workout_exercise_id = int(workout_exercise_id)
            repetitions = int(repetitions)
            weight = int(weight)
        except (TypeError, ValueError):
            return jsonify({"message": "Invalid parameter types"}), 400

        success = ExerciseDetails.update_exercise_detail(
            workout_exercise_id=workout_exercise_id,
            repetitions=repetitions,
            weight=weight
        )

        if success:
            return jsonify({"message": "Exercise detail updated successfully"}), 200
        else:
            return jsonify({"message": "Failed to update exercise detail"}), 500

    except Exception as e:
        print(f"Error updating exercise detail: {e}")
        return jsonify({"message": f"Error updating exercise detail: {str(e)}"}), 500

@app.route("/delete_exercise", methods=["POST"])
def delete_exercise():
    try:
        data = request.get_json()
        workout_exercise_id = data.get("workout_exercise_id")

        if workout_exercise_id is None:
            return jsonify({"message": "Workout exercise ID is required"}), 400

        # Validate workout_exercise_id is an integer
        try:
            workout_exercise_id = int(workout_exercise_id)
        except (TypeError, ValueError):
            return jsonify({"message": "Invalid workout exercise ID"}), 400

        # Delete exercise details first (due to foreign key constraints)
        details_deleted = ExerciseDetails.delete_exercise_detail(workout_exercise_id)
        if not details_deleted:
            return jsonify({"message": "Failed to delete exercise details"}), 500

        # Then delete the workout exercise entry
        exercise_deleted = WorkoutsExercises.delete_workout_exercise(workout_exercise_id)
        if not exercise_deleted:
            return jsonify({"message": "Failed to delete workout exercise"}), 500

        return jsonify({"message": "Exercise deleted successfully"}), 200

    except Exception as e:
        print(f"Error deleting exercise: {e}")
        return jsonify({"message": f"Error deleting exercise: {str(e)}"}), 500


@app.route("/delete_workout", methods=["POST"])
def delete_workout():
    try:
        data = request.get_json()
        workout_id = data.get("workout_id")
        
        if not workout_id:
            return jsonify({"message": "Workout ID is required"}), 400

        success = Workouts.delete_workout(workout_id)
        
        if success:
            return jsonify({"message": "Workout deleted successfully"}), 200
        else:
            return jsonify({"message": "Failed to delete workout"}), 500

    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500

@app.endpoint
def close_app():
    database.close()


# ! ----------------------------------------
if __name__ == "__main__":
    database.init("data.db")
    Users.connect_to_db()
    Exercises.connect_to_db()
    Workouts.connect_to_db()
    WorkoutsExercises.connect_to_db()
    ExerciseDetails.connect_to_db()
    
    app.run(port=4040, debug=True)
