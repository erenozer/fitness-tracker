// App.js
document.getElementById('programForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const programName = document.getElementById('programName').value;
    if (addProgram(programName)) { // Check if program was successfully added
        document.getElementById('programName').value = '';
    }
});

let programs = {};  // Store programs and their movements

function addProgram(name) {
    if (programs[name]) {
        alert("A program with that name already exists!");
        return false; // Indicate program was not added
    }

    programs[name] = []; // Initialize an empty array for movements

    const li = document.createElement('li');
    li.id = `program-${name}`; // Add an ID to the list item
    li.innerHTML = `<strong>${name}</strong>`;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Program';
    deleteButton.onclick = function() {
        delete programs[name];  // Remove data from our programs object
        li.remove();
        savePrograms(); // Save the updated programs
    };
    li.appendChild(deleteButton);
    // ... (rest of the code for adding table and form is the same)

    const movementForm = document.createElement('form');
    movementForm.className = 'movement-form';
    movementForm.innerHTML = `
        <input type="text" id="movementName" placeholder="Movement" required>
        <input type="number" id="movementReps" placeholder="Reps" required>
        <input type="number" id="movementSets" placeholder="Sets" required>
        <button type="submit">Add Movement</button>
    `;
    // ... (rest of the code is the same)
    document.getElementById('programList').appendChild(li);
    savePrograms(); // Save after adding a new program
    return true; // Indicate program was added
}


function addMovement(programName, form) {
    const movement = form.querySelector('#movementName').value;
    const reps = form.querySelector('#movementReps').value;
    const sets = form.querySelector('#movementSets').value;
    // ... (rest is the same)

    programs[programName].push({ movement, reps, sets }); // Store movement data
    savePrograms(); // Save after adding a movement
}


function savePrograms() {
    localStorage.setItem('fitnessPrograms', JSON.stringify(programs));
}

function loadPrograms() {
    const storedPrograms = localStorage.getItem('fitnessPrograms');
    if (storedPrograms) {
        programs = JSON.parse(storedPrograms);
        for (const programName in programs) {
            addProgram(programName); // Re-create the program list
            for (const movement of programs[programName]) {
                 // Re-add the movements
                 const movementForm = document.getElementById(`program-${programName}`).querySelector('.movement-form')
                 addMovement(programName, movementForm, movement)

            }
        }

    }
}


//Modified addMovement function to allow us to insert the data 
//from local storage
function addMovement(programName, form, movementData = null) {

    let movement, reps, sets;

    //Check if data is passed to the function, then don't pull
    //it from the form but from the localstorage.
    if (movementData == null) {
         movement = form.querySelector('#movementName').value;
         reps = form.querySelector('#movementReps').value;
         sets = form.querySelector('#movementSets').value;
    } else {
         movement = movementData.movement;
         reps = movementData.reps;
         sets = movementData.sets;

         form.reset(); //Added to reset the form after filling from the localstorage
    }


    const movementRow = document.createElement('tr');
    movementRow.innerHTML = `
        <td>${movement}</td>
        <td>${reps}</td>
        <td>${sets}</td>
        <td><button onclick="this.parentElement.parentElement.remove()">Remove</button></td>
    `;

    document.getElementById(`movementList-${programName}`).appendChild(movementRow);


    if (movementData == null) {
        programs[programName].push({ movement, reps, sets }); // Store movement data only if we didn't load it in
    }

    savePrograms(); // Save after adding a movement
}