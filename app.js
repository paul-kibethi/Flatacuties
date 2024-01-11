
const animalList = document.getElementById('animalList');
const animalDetails = document.getElementById('animalDetails');
const animalForm = document.createElement('form');
const name = document.getElementById('animalName').value;
// const image = document.getElementById('animalImage').value;

fetch('http://localhost:3000/characters')
  .then(response => response.json())
  .then(data => {

    data.forEach(animal => {
      const animalItem = document.createElement('div');
      animalItem.textContent = animal.name;
      animalItem.addEventListener('click', () => showAnimalDetails(animal.id));
      animalList.appendChild(animalItem);
    });
  })


  function showAnimalDetails(animalId) {
    fetch(`http://localhost:3000/characters/${animalId}`)
      .then(response => response.json())
      .then(animal => {
        animalDetails.innerHTML = `
          <h2>${animal.name}</h2>
          <img src="${animal.image}" alt="${animal.name}">
          <p>Votes: ${animal.votes}</p>
          <button onclick="voteForAnimal(${animal.id})">Vote</button>
        `;
      })
  }

  function voteForAnimal(animalId) {
    // Fetch the current data of the specific animal
    fetch(`http://localhost:3000/characters/${animalId}`)
      .then(response => response.json())
      .then(animal => {
        // Increment the votes
        const updatedVotes = animal.votes + 1;

        // Make a PATCH request to update the votes on the server
        fetch(`http://localhost:3000/characters/${animalId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ votes: updatedVotes }),
        })
          .then(response => response.json())
          .then(updatedAnimal => {
            // Display the updated votes in the UI
            animalDetails.innerHTML = `
              <h2>${updatedAnimal.name}</h2>
              <img src="${updatedAnimal.image}" alt="${updatedAnimal.name}">
              <p>Votes: ${updatedAnimal.votes}</p>
              <button onclick="voteForAnimal(${updatedAnimal.id})">Vote</button>
            `;
          })
      })
  }

  function resetVotes() {
    // Fetch all animals from the server
    fetch('http://localhost:3000/characters')
      .then(response => response.json())
      .then(data => {
        // Iterate through each animal and reset votes to 0
        const resetPromises = data.map(animal => {
          return fetch(`http://localhost:3000/characters/${animal.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ votes: 0 }),
          });
        });

        // Wait for all PATCH requests to complete
        Promise.all(resetPromises)
          .then(() => {
            // Display the reset votes in the UI
            animalDetails.innerHTML = '<p>Votes reset to 0 for all animals.</p>';
          })
      })
  }

  function addAnimal() {
    fetch('http://localhost:3000/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, image, votes: 0 }),
      })
        .then(response => response.json())
        .then(newAnimal => {
          // Display the new animal details in the UI
          animalDetails.innerHTML = `
            <h2>${newAnimal.name}</h2>
            <img src="${newAnimal.image}" alt="${newAnimal.name}">
            <p>Votes: ${newAnimal.votes}</p>
            <button onclick="voteForAnimal(${newAnimal.id})">Vote</button>
          `;
        })
  }

  animalForm.innerHTML = `
  <label for="animalName">Animal Name:</label>
  <input type="text" id="animalName" name="animalName" required>
  <label for="animalImage">Animal Image URL:</label>
  <input type="text" id="animalImage" name="animalImage" required>
  <button type="button" onclick="addAnimal()">Add Animal</button>
`;

document.body.appendChild(animalForm);