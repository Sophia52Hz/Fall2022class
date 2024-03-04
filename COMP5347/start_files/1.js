document.getElementById("search-input").addEventListener("input", processSearch);

let charactersData = [];
let selectedCharacters = [];

function processSearch(event) {
  var searchValue = event.target.value.trim().toLowerCase();
  search(searchValue);
}

function search(searchValue) {
  // Filter characters based on search value
  let filteredCharacters = characters.filter(character => {
      return character.name.toLowerCase().includes(searchValue);
  });

  // Render the filtered characters to the table
  renderCharacters(filteredCharacters);
}

function renderCharacters(characterList) {
  const tableBody = document.getElementById('character-table').querySelector('tbody');
  tableBody.innerHTML = ''; // Clear the table body

  characterList.forEach(character => {
      let row = tableBody.insertRow();
      row.insertCell().textContent = character.name;
      row.insertCell().textContent = character.strength;
      row.insertCell().textContent = character.speed;
      row.insertCell().textContent = character.skill;
      row.insertCell().textContent = character.fear_factor;
      row.insertCell().textContent = character.power;
      row.insertCell().textContent = character.intelligence;
      row.insertCell().textContent = character.wealth;
      let checkboxCell = row.insertCell();
      let checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkboxCell.appendChild(checkbox);
  });
}


function selectCharacter(character, checkbox) {
    if (checkbox.checked) {
        if (selectedCharacters.length < 2) {
            selectedCharacters.push(character);
        } else {
            checkbox.checked = false;
            alert('You can only compare two characters at a time.');
            return;
        }
    } else {
        selectedCharacters = selectedCharacters.filter(selected => selected.name !== character.name);
    }
    updateComparisonSection();
}

function updateComparisonSection() {
    // Get the profile elements
    const profile1 = document.getElementById('character1-profile');
    const profile2 = document.getElementById('character2-profile');
    
    // Clear existing content
    profile1.innerHTML = '';
    profile2.innerHTML = '';

    // Function to create profile content
    const createProfileContent = (profile, character) => {
        const name = document.createElement('h2');
        name.textContent = character ? character.name : 'Unknown';
        const image = document.createElement('img');
        image.src = character ? character.image_url : 'images/unknown.jpg';
        image.alt = character ? character.name : 'Unknown Character';

        profile.appendChild(name);
        profile.appendChild(image);
    };

    // Create content for selected characters or unknown profiles
    createProfileContent(profile1, selectedCharacters[0]);
    createProfileContent(profile2, selectedCharacters[1]);

    if (selectedCharacters.length === 2) {
      compareAttributes(selectedCharacters[0], selectedCharacters[1]);
  }
}
function compareAttributes(char1, char2) {
  // Define attribute names
  const attributes = ['strength', 'speed', 'skill', 'fear_factor', 'power', 'intelligence', 'wealth'];

  // Containers for the attributes
  const char1AttributesDiv = document.getElementById('character1-attributes');
  const char2AttributesDiv = document.getElementById('character2-attributes');

  // Clear previous comparison results
  char1AttributesDiv.innerHTML = '';
  char2AttributesDiv.innerHTML = '';

  // Tally of wins per character
  let tally = { char1: 0, char2: 0 };

  // Compare each attribute
  attributes.forEach(attr => {
      const char1Value = char1[attr];
      const char2Value = char2[attr];
      let winner = Math.random() < 0.5 ? 'char1' : 'char2'; // Randomly choose if tie

      if (char1Value > char2Value) {
          winner = 'char1';
      } else if (char1Value < char2Value) {
          winner = 'char2';
      }

      tally[winner] += 1;

      // Create tick and cross icons
      const char1Icon = document.createElement('span');
      char1Icon.textContent = winner === 'char1' ? '✓' : '✗';
      const char2Icon = document.createElement('span');
      char2Icon.textContent = winner === 'char2' ? '✓' : '✗';

      // Append icons to the attributes div
      char1AttributesDiv.appendChild(char1Icon);
      char2AttributesDiv.appendChild(char2Icon);
  });

  // Update background colors based on tally
  const char1Profile = document.getElementById('character1-profile');
  const char2Profile = document.getElementById('character2-profile');
  char1Profile.className = tally.char1 > tally.char2 ? 'known-character green-background' : 'known-character red-background';
  char2Profile.className = tally.char2 > tally.char1 ? 'known-character green-background' : 'known-character red-background';
}

// Initial call to load and display all characters
renderCharacters(characters);