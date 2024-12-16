from flask import Flask, request, jsonify
from flask_cors import CORS
import database
from Users import Users
from Exercises import Exercises

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
        return jsonify({"message": "Unsupported Media Type"}), 415
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        msg, response = Users.validate_usr(username, password)
        if response is False:
            return jsonify({"message": msg}), 400
        else:
            return jsonify({"message": msg}), 200
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
    """
    ! Potentially user_id
    ["name"]: Username
    ["workout"]: Array of exercises (id's)
    """
    pass

@app.route("/get_workouts", methods=["POST"])
def get_workouts():
    # user_id
    data = request.get_json()
    usr_id = data.get("user_id")
    # Workotus.get_workouts(user_id)


@app.endpoint
def close_app():
    database.close()


# ! ----------------------------------------
if __name__ == "__main__":
    database.init("data.db")
    Users.connect_to_db()
    Exercises.connect_to_db()
    app.run(port=4040, debug=True)
