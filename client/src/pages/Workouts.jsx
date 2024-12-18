import React, { useEffect, useState } from "react";

const Workouts = () => {
  const [exercisesLst, setExercisesLst] = useState([]);
  const [workoutDetails, setWorkoutDetails] = useState([]);
  const [showAddWorkoutForm, setShowAddWorkoutForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const userId = localStorage.getItem("userId");

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

      {showAddWorkoutForm && (
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

          <button
            type="button"
            onClick={handleAddExercise}
            className="add-exercise-btn"
            disabled={isLoading}
          >
            + Add Exercise
          </button>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Submit Workout"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Workouts;