document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("search-input")
    .addEventListener("input", processSearch);
  loadCharacters();
});

let charactersData = [];
let selectedCharacters = [];

async function loadCharacters() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    charactersData = await response.json();
    console.log('kkkk')
    renderCharacters(charactersData);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

function processSearch(event) {
  const searchValue = event.target.value.trim().toLowerCase();
  const filteredCharacters = charactersData.filter((character) =>
    character.name.toLowerCase().includes(searchValue)
  );
  renderCharacters(filteredCharacters);
}

function renderCharacters(characterList) {
  const tableBody = document.getElementById("character-table-body");
  tableBody.innerHTML = "";
  characterList.forEach((character) => {
    const row = tableBody.insertRow();
    row.insertCell().textContent = character.name;
    row.insertCell().textContent = character.strength;
    row.insertCell().textContent = character.speed;
    row.insertCell().textContent = character.skill;
    row.insertCell().textContent = character.fear_factor;
    row.insertCell().textContent = character.power;
    row.insertCell().textContent = character.intelligence;
    row.insertCell().textContent = character.wealth;
    const selectCell = row.insertCell();
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", () =>
      selectCharacter(character, checkbox)
    );
    selectCell.appendChild(checkbox);
  });
}

function selectCharacter(character, checkbox) {
  // If the checkbox is checked, add the character to the selection
  if (checkbox.checked) {
    // Limit the selection to two characters
    if (selectedCharacters.length < 2) {
      selectedCharacters.push(character);
    } else {
      // If more than two are selected, uncheck the new selection and alert the user
      checkbox.checked = false;
      alert("You can only compare two characters at a time.");
      return;
    }
  } else {
    // If the checkbox is unchecked, remove the character from the selection
    selectedCharacters = selectedCharacters.filter(
      (selected) => selected.name !== character.name
    );
  }
  // Update the comparison section with the new selection
  updateComparisonSection();
}

function updateComparisonSection() {
  // Clear existing content in the comparison profiles
  const profile1 = document.getElementById("character1-profile");
  const profile2 = document.getElementById("character2-profile");
  profile1.innerHTML = "";
  profile2.innerHTML = "";

  // Helper function to create profile content
  const createProfileContent = (profile, character, profileId) => {
    // Create the name element
    const name = document.createElement("h2");
    name.textContent = character ? character.name : "Unknown";

    // Create the image element
    const image = document.createElement("img");
    image.src = character
      ? `images/${character.image_url}`
      : "images/unknown.png"; // Make sure the path is correct
    image.alt = character ? character.name : "Unknown Character";

    // Append the name and image to the profile
    profile.appendChild(name);
    profile.appendChild(image);

    // If the character is not selected, show the 'Unknown' placeholder
    if (!character) {
      profile.classList.add("unknown-character"); // Add a class to style the 'Unknown' state
    } else {
      profile.classList.remove("unknown-character");
    }
  };

  // Create content for selected characters or unknown profiles
  createProfileContent(profile1, selectedCharacters[0]);
  createProfileContent(profile2, selectedCharacters[1]);

  if (selectedCharacters.length === 2) {
    compareAttributes(selectedCharacters[0], selectedCharacters[1]);
  }
}

// Call this once at the start and whenever the characters data is updated
loadCharacters().then((characters) => {
  charactersData = characters; // Ensure the charactersData is assigned the loaded data
  renderCharacters(charactersData); // Render the characters table
});
