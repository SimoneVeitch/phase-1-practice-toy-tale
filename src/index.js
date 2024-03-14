let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

//Set up card
// <div id="toy-collection"></div>
function renderOneToy(toy){
  let card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} likes</p>
    <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
  `;
  // Add event listener to the like button
  card.querySelector('.like-btn').addEventListener('click', handleLike);
  document.querySelector("#toy-collection").appendChild(card);
}

// Function to handle like button click
function handleLike(event) {
  const toyId = event.target.dataset.id;
  const card = event.target.parentElement;
  const likesElement = card.querySelector('p');
  let likesCount = parseInt(likesElement.textContent);

  // Increment likes count
  likesCount++;

  // Send PATCH request to update likes count
  fetch(`http://localhost:3000/toys/${toyId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      likes: likesCount
    })
  })
  .then(response => response.json())
  .then(updatedToy => {
    // Update likes count in the DOM
    likesElement.textContent = `${updatedToy.likes} likes`;
  })
  .catch(error => console.error("Error updating toy likes:", error));
}

//Fetch data
const toyUrl = 'http://localhost:3000/toys';
function getAllToys() {
  fetch(toyUrl)
  .then (response => response.json())
  .then (toyData => toyData.forEach(toy => renderOneToy(toy)))
  .catch(error => console.error("Error fetching toys:", error));
}

// Initial render
function initialise(){
  getAllToys();
}
initialise();

document.querySelector('.add-toy-form').addEventListener('submit', handleSubmit);

function handleSubmit(e){
  e.preventDefault();
  let toyObj = {
    name: e.target.name.value,
    image: e.target.image.value,
    likes: 0
  };
  renderOneToy(toyObj);
  addNewToy(toyObj);
}

function addNewToy (toyObj){
  fetch(toyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(toyObj)
  })
  .then(response => response.json())
  .then(toy => console.log(toy))
  .catch(error => console.error("Error adding new toy:", error));
}
