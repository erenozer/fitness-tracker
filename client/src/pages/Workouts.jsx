import React, { useEffect, useState, useRef } from "react";

const Workouts = () => {
  const [exercisesLst, setExercisesLst] = useState([]);
  const [workoutDetails, setWorkoutDetails] = useState([]);
  const [showAddWorkoutForm, setShowAddWorkoutForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState({});
  const [editingExercise, setEditingExercise] = useState(null);

  const userId = localStorage.getItem("userId");
  const newRepsRef = useRef(null);
  const newWeightRef = useRef(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_URL}/get_exercises_lst`);
        const data = await response.json();
        
        if (response.ok) {
          setExercisesLst(data.exercises);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Failed to fetch exercises");
      }
    };

    fetchExercises();
  }, []);

  const fetchWorkoutHistory = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/get_workout_details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: parseInt(userId) })
      });
      const data = await response.json();
      
      if (response.ok) {
        setWorkoutHistory(data.workouts);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch workout history");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchWorkoutHistory();
    }
  }, [userId, showAddWorkoutForm]);

  const toggleAddWorkoutForm = () => {
    setShowAddWorkoutForm(!showAddWorkoutForm);
    setWorkoutDetails([]);
    setError(null);
  };

  const handleAddExercise = () => {
    setWorkoutDetails([
      ...workoutDetails,
      { exercise: "", repetitions: "", weight: "" },
    ]);
  };

  const handleRemoveExercise = () => {
    if (workoutDetails.length > 0) {
      setWorkoutDetails(workoutDetails.slice(0, -1));
    }
  };

  const handleExerciseDetailChange = (index, field, value) => {
    const updatedDetails = [...workoutDetails];
    updatedDetails[index][field] = value;
    setWorkoutDetails(updatedDetails);
  };

  const validateForm = () => {
    if (!userId) {
      setError("Please log in first");
      return false;
    }
    if (workoutDetails.length === 0) {
      setError("Please add at least one exercise");
      return false;
    }
    for (const detail of workoutDetails) {
      if (!detail.exercise || !detail.repetitions || !detail.weight) {
        setError("Please fill all exercise details");
        return false;
      }
    }
    return true;
  };

  const handleAddWorkoutForm = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/add_workout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: parseInt(userId),
          exercises: workoutDetails,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert("Workout added successfully!");
        setShowAddWorkoutForm(false);
        setWorkoutDetails([]);
      } else {
        setError(data.message || "Failed to add workout");
      }
    } catch (err) {
      setError("Failed to add workout");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditExercise = async (workoutExerciseId, newReps, newWeight) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/update_exercise_detail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workout_exercise_id: parseInt(workoutExerciseId),
          repetitions: parseInt(newReps),
          weight: parseInt(newWeight)
        })
      });

      if (response.ok) {
        setEditingExercise(null);
        await fetchWorkoutHistory();  // Use await here
      } else {
        const data = await response.json();
        setError(data.message || "Failed to update exercise");
      }
    } catch (err) {
      setError("Failed to update exercise");
    }
  };

  const handleDeleteExercise = async (workoutExerciseId) => {
    if (!confirm("Are you sure you want to delete this exercise?")) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/delete_exercise`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workout_exercise_id: parseInt(workoutExerciseId)
        })
      });

      if (response.ok) {
        await fetchWorkoutHistory();  // Use await here
      } else {
        const data = await response.json();
        setError(data.message || "Failed to delete exercise");
      }
    } catch (err) {
      setError("Failed to delete exercise");
    }
  };

  return (
    <div className="add-workout_container">
      {error && <div className="error-message">{error}</div>}
      
      <button 
        className="submit-btn" 
        onClick={toggleAddWorkoutForm}
        disabled={isLoading}
      >
        {showAddWorkoutForm ? "Cancel" : "Add Workout"}
      </button>

      {showAddWorkoutForm ? (
        <form onSubmit={handleAddWorkoutForm}>
          {workoutDetails.map((detail, index) => (
            <div key={index} className="exercise-row">
              <select
                value={detail.exercise}
                onChange={(e) => handleExerciseDetailChange(index, "exercise", e.target.value)}
                disabled={isLoading}
                required
              >
                <option value="">Select Exercise</option>
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
                onChange={(e) => handleExerciseDetailChange(index, "repetitions", e.target.value)}
                disabled={isLoading}
                required
                min="1"
              />
              <input
                type="number"
                placeholder="Weight (kg)"
                value={detail.weight}
                onChange={(e) => handleExerciseDetailChange(index, "weight", e.target.value)}
                disabled={isLoading}
                required
                min="0"
              />
            </div>
          ))}

          <div className="form-buttons">
            <button
              type="button"
              onClick={handleAddExercise}
              className="add-exercise-btn"
              disabled={isLoading}
            >
              + Add Exercise
            </button>

            {workoutDetails.length > 0 && (
              <button
                type="button"
                onClick={handleRemoveExercise}
                className="remove-exercise-btn"
                disabled={isLoading}
              >
                - Remove Exercise
              </button>
            )}
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Submit Workout"}
          </button>
        </form>
      ) : (
        <div className="workout-history">
          <h2>Workout History</h2>
          {Object.entries(workoutHistory).map(([workoutId, workout]) => (
            <div key={workoutId} className="workout-card">
              <h3>Workout on {new Date(workout.date).toLocaleDateString()}</h3>
              <div className="exercises-list">
                {workout.exercises.map((exercise, index) => (
                  <div key={index} className="exercise-item">
                    {editingExercise === exercise.id ? (
                      <div className="exercise-edit-form">
                        <span className="exercise-name">{exercise.name}</span>
                        <input
                          type="number"
                          defaultValue={exercise.repetitions}
                          ref={newRepsRef}
                          min="1"
                        />
                        <input
                          type="number"
                          defaultValue={exercise.weight}
                          ref={newWeightRef}
                          min="0"
                        />
                        <button onClick={() => handleEditExercise(
                          exercise.id,
                          newRepsRef.current.value,
                          newWeightRef.current.value
                        )}>
                          Save
                        </button>
                        <button onClick={() => setEditingExercise(null)}>Cancel</button>
                      </div>
                    ) : (
                      <>
                        <span className="exercise-name">{exercise.name}</span>
                        <span className="exercise-details">
                          {exercise.repetitions} reps @ {exercise.weight}kg
                        </span>
                        <div className="exercise-actions">
                          <button onClick={() => setEditingExercise(exercise.id)}>Edit</button>
                          <button onClick={() => handleDeleteExercise(exercise.id)}>Delete</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Workouts;