
const shortCourseSection = document.getElementById('shortCourse-new-container-wrapper');
const longCourseSection = document.getElementById('longCourse-new-container-wrapper');

//? Navigation button logic
const homeSection = document.getElementById('main-section-container');
const addPbSection = document.getElementById('addPb-section-container');
const profileSection = document.getElementById('profile-section-container');
const editSection = document.getElementById('edit-time-container');

//* home tab
const returnToHome = document.querySelectorAll('.returnToHome');

for (button of returnToHome) {
    button.addEventListener('click', () => {
        document.getElementById('return-button').style.visibility = "hidden";
        homeSection.style.display = "flex";
        addPbSection.style.display = "none";
        profileSection.style.display = "none";
        editSection.style.display = "none";
    });
}

//* add PB tab
const addPbButtons = document.querySelectorAll('.addPbButton');
const returnButton = document.getElementById('return-button');

for (button of addPbButtons) {
    button.addEventListener('click', () => {
        addPbSection.style.display = "flex";
        returnButton.style.visibility = "visible";
        homeSection.style.display = "none";
        profileSection.style.display = "none";
        editSection.style.display = "none";
    });
}

//* profile tab
const profileButton = document.getElementById('nav-profile-section-button');

profileButton.addEventListener('click', () => {
    profileSection.style.display = "flex";
    returnButton.style.visibility = "visible";
    homeSection.style.display = "none";
    addPbSection.style.display = "none";
    editSection.style.display = "none";
});

//? Delete data
document.getElementById('deleteData-button').addEventListener('click', (event) => {
    event.preventDefault();

    if (confirm("Willst du deine Daten aus dieser App restlos löschen?\nDiese Aktion kann nicht rückgängig gemacht werden.")) {
        localStorage.clear();
    
    }
    //TODO:     Clear previous user input in document
});


//? Add PB logic

let eventInput = document.getElementById('eventInput');
let timeInput = document.getElementById('timeInput');
let courseInput = document.getElementById('courseInput');

let addedEvents = new Set();

timeInput.value = "00:00:00";

let currentEditingContainer = null;

function saveAndDisplayPB() {
    let eventType = eventInput.value;
    let time = timeInput.value;
    let course = courseInput.value;
    let uniqueEventKey = `${eventType}-${course}`;

    if (addedEvents.has(uniqueEventKey)) {
        alert("Dieses Strecke wurde bereits hinzugefügt.");
        console.warn("Failed: Cannot add multiple events of the same type");
        return;
    }

    addedEvents.add(uniqueEventKey);

    let newPbContainer = document.createElement("div");
    newPbContainer.classList.add('newContainer');

    let section = course == "25m" ? shortCourseSection : longCourseSection;
    section.appendChild(newPbContainer);

    //! creation date
    let dateOfCreation = new Date().toLocaleDateString();
    let dateElement = document.createElement("p");
    dateElement.textContent = `${dateOfCreation}`;
    dateElement.style.color = "#686868";
    newPbContainer.appendChild(dateElement);
    
    //! event type
    let eventElement = document.createElement("p");
    eventElement.textContent = `${eventType}`;
    eventElement.style.fontWeight = "bold";
    newPbContainer.appendChild(eventElement);
    
    //! time
    let timeElement = document.createElement("p");
    timeElement.textContent = `${time}`;
    timeElement.style.fontWeight = "bold";
    newPbContainer.appendChild(timeElement);

    //! wrapper for buttons
    let buttonWrapper = document.createElement("div");
    buttonWrapper.classList.add('buttonWrapper');
    newPbContainer.appendChild(buttonWrapper);
    
    //! edit button
    let editButton = document.createElement("button");
    editButton.classList.add('edit-button');
    editButton.onclick = () => {
        currentEditingContainer = {
            container: newPbContainer,
            timeElement: timeElement,
            dateElement: dateElement
        };
        displayEditTimeSection(time);
    };
    buttonWrapper.appendChild(editButton);
    
    //! delete button
    let deleteButton = document.createElement("button");
    deleteButton.classList.add('delete-button');
    deleteButton.onclick = () => {
        newPbContainer.remove();
        addedEvents.delete(uniqueEventKey);
    };
    buttonWrapper.appendChild(deleteButton);

    eventInput.selectedIndex = 0;
    timeInput.value = "00:00:00";
    courseInput.selectedIndex = 0;

    document.getElementById('return-button').style.visibility = "hidden";
    homeSection.style.display = "flex";
    addPbSection.style.display = "none";
    profileSection.style.display = "none";
}

let newTime = document.getElementById('newTimeInput');

function displayEditTimeSection(currentTime) {
    homeSection.style.display = "none";
    addPbSection.style.display = "none";
    profileSection.style.display = "none";
    editSection.style.display = "flex";
    returnButton.style.visibility = "visible";

    newTime.value = currentTime || "00:00:00";
}

function editTime() {
    const updatedTime = newTime.value;

    if (currentEditingContainer) {
        currentEditingContainer.timeElement.textContent = updatedTime;

        const updatedDate = new Date().toLocaleDateString();
        currentEditingContainer.dateElement.textContent = updatedDate;

        homeSection.style.display = "flex";
        addPbSection.style.display = "none";
        profileSection.style.display = "none";
        editSection.style.display = "none";
        returnButton.style.visibility = "hidden";

        currentEditingContainer = null;
    } else {
        alert("Kein Element zum Bearbeiten gefunden.");
    }
}
