import React, { useEffect, useState } from "react";

const Workouts = () => {
  const [exercisesLst, setExercisesLst] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [showAddWorkoutForm, setShowAddWorkoutForm] = useState(false);
  // ! In case exercises have been locally stored,
  // ! don't fetch the data from the server.
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    fetch(`${API_URL}/get_exercises_lst`, { method: "GET" }).then(
      (response) => {
        const status = response.status;
        response.json().then((json) => {
          if (status != 200 && status != 201) {
            alert(json.message);
          } else {
            if (Array.isArray(json.exercises)) {
              console.log("Fetched exercises from API:", json.exercises);
              setExercisesLst(json.exercises);
              console.log(`exercisesLst: ${exercisesLst}`);
            } else {
              console.error("API response is not an array.");
            }
          }
        });
      }
    );
  }, []);
  const toggleAddWorkoutForm = () => {
    setShowAddWorkoutForm(!showAddWorkoutForm);
  };
  const handleAddWorkoutForm = (event) => {
    event.preventDefault();
    console.log("Selected exercises:", selectedExercises);
    setShowAddWorkoutForm(false);
  };
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedExercises([...selectedExercises, value]);
    } else {
      setSelectedExercises(
        selectedExercises.filter((exercise) => exercise !== value)
      );
    }
  };
  // Add workout btn.
  return (
    <div className="add-workout_container">
      <button className="submit-btn" onClick={toggleAddWorkoutForm}>
        {showAddWorkoutForm ? "Cancel" : "Add Workout"}
      </button>
      {showAddWorkoutForm && (
        <form onSubmit={handleAddWorkoutForm}>
          <select
            id="exerciseSelect"
            value={selectedExercises}
            onChange={(event) => {
              const options = event.target.options;
              const selected = [];
              for (let i = 0; i < options.length; i++) {
                if (options[i].selected) {
                  selected.push(options[i].value);
                }
              }
              setSelectedExercises(selected);
            }}
          >
            {exercisesLst.map((exercise) => (
              <option key={exercise.id} value={exercise.desc}>
                {exercise.desc}
              </option>
            ))}
          </select>
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default Workouts;
