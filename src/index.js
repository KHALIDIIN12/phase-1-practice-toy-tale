let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form");

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });


  fetchToys();

  
  toyForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameInput = event.target.name.value;
    const imageInput = event.target.image.value;

    const newToy = {
      name: nameInput,
      image: imageInput,
      likes: 0,
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newToy),
    })
      .then((resp) => resp.json())
      .then((toy) => {
        renderToyCard(toy);
        toyForm.reset();
      })
      .catch((error) => console.error("POST error:", error));
  });
});


function fetchToys() {
  fetch("http://localhost:3000/toys")
    .then((resp) => resp.json())
    .then((toys) => toys.forEach(renderToyCard))
    .catch((err) => console.error("Fetch error:", err));
}


function renderToyCard(toy) {
  const toyCollection = document.getElementById("toy-collection");

  const card = document.createElement("div");
  card.className = "card";

  const h2 = document.createElement("h2");
  h2.textContent = toy.name;

  const img = document.createElement("img");
  img.src = toy.image;
  img.className = "toy-avatar";

  const p = document.createElement("p");
  p.textContent = `${toy.likes} Likes`;

  const btn = document.createElement("button");
  btn.className = "like-btn";
  btn.id = toy.id;
  btn.textContent = "Like ❤️";


  btn.addEventListener("click", () => {
    const newLikes = toy.likes + 1;

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ likes: newLikes }),
    })
      .then((resp) => resp.json())
      .then((updatedToy) => {
        p.textContent = `${updatedToy.likes} Likes`;
        toy.likes = updatedToy.likes; 
      })
      .catch((error) => console.error("PATCH error:", error));
  });

  card.append(h2, img, p, btn);
  toyCollection.appendChild(card);
}