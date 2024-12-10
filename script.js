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
        location.reload();
    }
});

//? export data
function exportData() {
    if (confirm("You are about to download the 'pbData.json' file containing your PB data.")) {
      const data = {
        pbData: JSON.parse(localStorage.getItem("pbData")) || []
      };

      const dataStr = JSON.stringify(data, null, 2);
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const exportFileDefaultName = "pbData.json";
  
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();
    }
  }

//? Add PB logic

// global variables
let eventInput = document.getElementById('eventInput');
let timeInput = document.getElementById('timeInput');
let courseInput = document.getElementById('courseInput');
let newTime = document.getElementById('newTimeInput');
let addedEvents = new Set();
let currentEditingContainer = null;
let pbData = JSON.parse(localStorage.getItem('pbData')) || [];

function loadPBData() {
    pbData.forEach((pb) => {
        renderPB(pb);
        addedEvents.add(`${pb.event}-${pb.course}`);
    });
}

function savePBToStorage() {
    localStorage.setItem('pbData', JSON.stringify(pbData));
}

function deletePBFromStorage(uniqueKey) {
    pbData = pbData.filter(pb => `${pb.event}-${pb.course}` !== uniqueKey);
    savePBToStorage();
}

function updatePBInStorage(uniqueKey, newTime) {
    pbData.forEach(pb => {
        if (`${pb.event}-${pb.course}` === uniqueKey) {
            pb.time = newTime;
            pb.date = new Date().toLocaleDateString();
        }
    });
}

function renderPB(pb) {
    const uniqueEventKey = `${pb.event}-${pb.course}`;
    const section = pb.course === "25m" ? shortCourseSection : longCourseSection;

    let newPbContainer = document.createElement("div");
    newPbContainer.classList.add('newContainer');

    let dateElement = document.createElement("p");
    dateElement.textContent = pb.date;
    dateElement.style.color = "#686868";
    newPbContainer.appendChild(dateElement);

    let eventElement = document.createElement("p");
    eventElement.textContent = pb.event;
    eventElement.style.fontWeight = "bold";
    newPbContainer.appendChild(eventElement);

    let timeElement = document.createElement("p");
    timeElement.textContent = pb.time;
    timeElement.style.fontWeight = "bold";
    newPbContainer.appendChild(timeElement);

    let buttonWrapper = document.createElement("div");
    buttonWrapper.classList.add('buttonWrapper');
    newPbContainer.appendChild(buttonWrapper);

    let editButton = document.createElement("button");
    editButton.classList.add('edit-button');
    editButton.onclick = () => {
        currentEditingContainer = {
            container: newPbContainer,
            timeElement: timeElement,
            dateElement: dateElement,
            uniqueKey: uniqueEventKey
        };
        displayEditTimeSection(pb.time);
    };
    buttonWrapper.appendChild(editButton);

    let deleteButton = document.createElement("button");
    deleteButton.classList.add('delete-button');
    deleteButton.onclick = () => {
        newPbContainer.remove();
        addedEvents.delete(uniqueEventKey);
        deletePBFromStorage(uniqueEventKey);
    };
    buttonWrapper.appendChild(deleteButton);

    section.appendChild(newPbContainer);
}

function saveAndDisplayPB() {
    let eventType = eventInput.value;
    let course = courseInput.value;
    
    // Werte aus den benutzerdefinierten Zeitfeldern abrufen
    let minutes = document.getElementById("minutes").value.padStart(2, '0');
    let seconds = document.getElementById("seconds").value.padStart(2, '0');
    let milliseconds = document.getElementById("milliseconds").value;

    let time = `${minutes}:${seconds}.${milliseconds}`;
    let uniqueEventKey = `${eventType}-${course}`;
    let dateOfCreation = new Date().toLocaleDateString();

    if (!eventType || !time || !course) {
        alert("Bitte fülle alle Felder aus.");
        return;
    }

    if (addedEvents.has(uniqueEventKey)) {
        alert("Diese Strecke wurde bereits hinzugefügt.");
        return;
    }

    const pb = {
        event: eventType,
        time: time,
        course: course,
        date: dateOfCreation
    };

    addedEvents.add(uniqueEventKey);
    pbData.push(pb);

    pbData.sort(compareEvents);

    updateUI();
    savePBToStorage();

    eventInput.selectedIndex = 0;
    document.getElementById("minutes").value = "";
    document.getElementById("seconds").value = "";
    document.getElementById("milliseconds").value = "";
    courseInput.selectedIndex = 0;

    homeSection.style.display = "flex";
    addPbSection.style.display = "none";
}

function updateUI() {
    shortCourseSection.innerHTML = "";
    longCourseSection.innerHTML = "";

    pbData.forEach(pb => renderPB(pb));
}

function displayEditTimeSection() {
    homeSection.style.display = "none";
    addPbSection.style.display = "none";
    profileSection.style.display = "none";
    editSection.style.display = "flex";
    returnButton.style.visibility = "visible";
}


function editTime() {
    let updatedMinutes = document.getElementById("newMinutes").value.padStart(2, '0');
    let updatedSeconds = document.getElementById("newSeconds").value.padStart(2, '0');
    let updatedMilliseconds = document.getElementById("newMilliseconds").value;

    let updatedTime = `${updatedMinutes}:${updatedSeconds}.${updatedMilliseconds}`;
    
    if (currentEditingContainer) {
        const { timeElement, dateElement, uniqueKey } = currentEditingContainer;

        timeElement.textContent = updatedTime;
        const updatedDate = new Date().toLocaleDateString();
        dateElement.textContent = updatedDate;

        updatePBInStorage(uniqueKey, updatedTime);
        savePBToStorage();

        homeSection.style.display = "flex";
        editSection.style.display = "none";
        currentEditingContainer = null;
    } else {
        alert("Kein Element zum Bearbeiten gefunden.");
    }
}

//? Sortin algorithm
const swimOrder = {
    "Delfin": 1,
    "Rücken": 2,
    "Brust": 3,
    "Kraul": 4,
    "Lagen": 5,
};

const distanceOrder = [50, 100, 200, 400, 800, 1500];

function compareEvents(a, b) {
    const [distanceA, strokeA] = a.event.split(" ");
    const [distanceB, strokeB] = b.event.split(" ");

    const strokeOrderA = swimOrder[strokeA];
    const strokeOrderB = swimOrder[strokeB];
    if (strokeOrderA !== strokeOrderB) {
        return strokeOrderA - strokeOrderB;
    }

    const distanceIndexA = distanceOrder.indexOf(parseInt(distanceA, 10));
    const distanceIndexB = distanceOrder.indexOf(parseInt(distanceB, 10));
    return distanceIndexA - distanceIndexB;
}



document.addEventListener('DOMContentLoaded', function () {
    loadPBData();

    //* Cookie Baner
    const cookieBanner = document.getElementById("cookie-banner");
    const acceptCookiesButton = document.getElementById("accept-cookies");

    const nav = document.getElementById('navbar');

    if (!localStorage.getItem("cookiesAccepted")) {
        cookieBanner.classList.add("show");

        nav.style.pointerEvents = "none";
        homeSection.style.pointerEvents = "none";
    }

    acceptCookiesButton.addEventListener("click", () => {
        localStorage.setItem("cookiesAccepted", "true");
        cookieBanner.classList.remove("show");

        nav.style.pointerEvents = "auto";
        homeSection.style.pointerEvents = "auto";
    });
});

