import React, { useEffect, useState } from "react";

const Workouts = () => {
  const [exercisesLst, setExercisesLst] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [showAddWorkoutForm, setShowAddWorkoutForm] = useState(false);
  // ! In case exercises have been locally stored,
  // ! don't fetch the data from the server.
  useEffect(() => {
    const storedExercises = localStorage.getItem("storedExercises");
    if (storedExercises) {
      setExercisesLst(JSON.parse(storedExercises));
    } else {
      const API_URL = import.meta.env.VITE_API_URL;
      fetch(`${API_URL}/get_exercises_lst`, { method: "GET" }).then(
        (response) => {
          const status = response.status;
          response.json().then((json) => {
            if (status != 200 && status != 201) {
              alert(json.message);
            } else {
              setExercisesLst(json);
              localStorage.setItem("storedExercises", JSON.stringify(json));
              console.log(exercisesLst);
            }
          });
        }
      );
    }
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
          {exercisesLst.map((exercise) => (
            <div key={exercise.id}>
              <label>
                <input
                  type="checkbox"
                  value={exercise.description}
                  onChange={handleCheckboxChange}
                />
                {exercise.description}
              </label>
            </div>
          ))}
          <button type="submit" className="submit-btn">
            Add Workout
          </button>
        </form>
      )}
    </div>
  );
};

export default Workouts;
