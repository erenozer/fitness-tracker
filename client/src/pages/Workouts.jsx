import React, { useEffect, useState } from "react";

const Workouts = () => {
  const [exercisesLst, setExercisesLst] = useState([]); // List of exercises
  const [workoutDetails, setWorkoutDetails] = useState([]); // Selected exercises with details
  const [showAddWorkoutForm, setShowAddWorkoutForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Monday"); // Default to Monday

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Fetch exercises list from the API
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    fetch(`${API_URL}/get_exercises_lst`, { method: "GET" }).then((response) => {
      const status = response.status;
      response.json().then((json) => {
        if (status !== 200 && status !== 201) {
          alert(json.message);
        } else {
          if (Array.isArray(json.exercises)) {
            console.log("Fetched exercises from API:", json.exercises);
            setExercisesLst(json.exercises); // Set exercises list properly
          } else {
            console.error("API response is not an array.");
          }
        }
      });
    });
  }, []);

  const toggleAddWorkoutForm = () => {
    setShowAddWorkoutForm(!showAddWorkoutForm);
    setWorkoutDetails([]); // Reset the form state when toggled
  };

  const handleAddExercise = () => {
    setWorkoutDetails([
      ...workoutDetails,
      { exercise: "", repetitions: "", weight: "" },
    ]);
  };

  const handleExerciseDetailChange = (index, field, value) => {
    const updatedDetails = [...workoutDetails];
    updatedDetails[index][field] = value;
    setWorkoutDetails(updatedDetails);
  };

  const handleAddWorkoutForm = (event) => {
    event.preventDefault();
    console.log("Workout for:", selectedDay);
    console.log("Workout Details:", workoutDetails);

    // Send data to the backend
    const API_URL = import.meta.env.VITE_API_URL;
    fetch(`${API_URL}/add_workout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        day: selectedDay,
        exercises: workoutDetails,
      }),
    })
      .then((response) => {
        if (response.ok) {
          alert("Workout added successfully!");
          setShowAddWorkoutForm(false);
          setWorkoutDetails([]);
        } else {
          alert("Failed to add workout.");
        }
      })
      .catch((err) => console.error("Error adding workout:", err));
  };

  return (
    <div className="add-workout_container">
      <button className="submit-btn" onClick={toggleAddWorkoutForm}>
        {showAddWorkoutForm ? "Cancel" : "Add Workout"}
      </button>

      {showAddWorkoutForm && (
        <form onSubmit={handleAddWorkoutForm}>
          {/* Day selection */}
          <label>
            Select Day:
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
            >
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </label>

          {/* Workout details input */}
          {workoutDetails.map((detail, index) => (
            <div key={index} className="exercise-row">
              <select
                value={detail.exercise}
                onChange={(e) =>
                  handleExerciseDetailChange(index, "exercise", e.target.value)
                }
              >
                <option value="" disabled>
                  Select Exercise
                </option>
                {exercisesLst.map((exercise) => (
                  <option key={exercise.id} value={exercise.desc}>
                    {exercise.desc}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Repetitions"
                value={detail.repetitions}
                onChange={(e) =>
                  handleExerciseDetailChange(index, "repetitions", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Weight (kg)"
                value={detail.weight}
                onChange={(e) =>
                  handleExerciseDetailChange(index, "weight", e.target.value)
                }
              />
            </div>
          ))}

          {/* Add another exercise */}
          <button
            type="button"
            onClick={handleAddExercise}
            className="add-exercise-btn"
          >
            + Add Exercise
          </button>

          {/* Submit button */}
          <button type="submit" className="submit-btn">
            Submit Workout
          </button>
        </form>
      )}
    </div>
  );
};

export default Workouts;
