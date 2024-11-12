
//? Navigation button logic
const homeSection = document.getElementById('main-section-container');
const addPbSection = document.getElementById('addPb-section-container');
const profileSection = document.getElementById('profile-section-container');

//* home tab
const returnToHome = document.querySelectorAll('.returnToHome');

for (button of returnToHome) {
    button.addEventListener('click', () => {
        document.getElementById('return-button').style.visibility = "hidden";
        homeSection.style.display = "flex";
        addPbSection.style.display = "none";
        profileSection.style.display = "none";
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
    });
}

//* profile tab
const profileButton = document.getElementById('nav-profile-section-button');

profileButton.addEventListener('click', () => {
    profileSection.style.display = "flex";
    returnButton.style.visibility = "visible";
    homeSection.style.display = "none";
    addPbSection.style.display = "none";
});

//? Delete data
document.getElementById('deleteData-button').addEventListener('click', (event) => {
    event.preventDefault();

    if (confirm("Willst du deine Daten aus dieser App restlos löschen?\nDiese Aktion kann nicht rückgängig gemacht werden.")) {
        localStorage.clear();
    }
    //TODO:     Clear previous user input
});


//? Add PB logic
/*
    eventInput
    timeInput
    courseInput
*/

let eventInput = document.getElementById('eventInput');
let eventType = eventInput.value;

let timeInput = document.getElementById('timeInput');
let time = timeInput.value;

let courseInput = document.getElementById('courseInput');
let course = courseInput.value;

function saveAndDisplayPB() {
    //TODO      fix error that localstorage does not accept new values to input fields
    localStorage.setItem("event", eventType);
    localStorage.setItem("time", time);
    localStorage.setItem("course", course);
    console.log("test");

    //? create date object to display creation date of pb
    //TODO      add feature to update date if the event is updated
    let creationDate = new Date().toLocaleDateString();
    console.log(creationDate);

    let newPbContainer = document.createElement("div");
    homeSection.appendChild(newPbContainer);

    //TODO      save new created container to localstorage
    newPbContainer.innerText += "test";
    newPbContainer.innerText += "Date of creation: " + creationDate; 
}
