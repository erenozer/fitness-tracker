CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    hashed_pw VARCHAR(100) NOT NULL,
    salt BLOB NOT NULL,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    desc VARCHAR(100),  -- description
    body_part VARCHAR(20)
);

CREATE TABLE workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE workouts_exercises (
    workout_id INTEGER,
    exercise_id INTEGER,
    repetitions INTEGER,
    used_weight INTEGER,
    PRIMARY KEY (workout_id, exercise_id),
    FOREIGN KEY (workout_id) REFERENCES workout(id),
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

-- Basic compound exercises that target multiple muscle groups
INSERT INTO exercises (desc, body_part) VALUES 
    ('Barbell Back Squat', 'Legs'),
    ('Conventional Deadlift', 'Back'),
    ('Bench Press', 'Chest'),
    ('Standing Overhead Press', 'Shoulders'),
    ('Barbell Row', 'Back');

-- Upper body pushing exercises
INSERT INTO exercises (desc, body_part) VALUES 
    ('Push-up', 'Chest'),
    ('Dips', 'Chest'),
    ('Incline Dumbbell Press', 'Chest'),
    ('Lateral Raise', 'Shoulders'),
    ('Tricep Extension', 'Arms');

-- Upper body pulling exercises
INSERT INTO exercises (desc, body_part) VALUES 
    ('Pull-up', 'Back'),
    ('Chin-up', 'Back'),
    ('Face Pull', 'Shoulders'),
    ('Barbell Curl', 'Arms'),
    ('Hammer Curl', 'Arms');

-- Lower body exercises
INSERT INTO exercises (desc, body_part) VALUES 
    ('Romanian Deadlift', 'Legs'),
    ('Bulgarian Split Squat', 'Legs'),
    ('Standing Calf Raise', 'Legs'),
    ('Hip Thrust', 'Legs'),
    ('Leg Press', 'Legs');

-- Core exercises
INSERT INTO exercises (desc, body_part) VALUES 
    ('Plank', 'Core'),
    ('Cable Woodchop', 'Core'),
    ('Ab Wheel Rollout', 'Core'),
    ('Russian Twist', 'Core'),
    ('Dead Bug', 'Core');

-- Compound movement variations
INSERT INTO exercises (desc, body_part) VALUES 
    ('Front Squat', 'Legs'),
    ('Sumo Deadlift', 'Legs'),
    ('Close-Grip Bench Press', 'Chest'),
    ('Power Clean', 'Full Body'),
    ('Turkish Get-Up', 'Full Body');