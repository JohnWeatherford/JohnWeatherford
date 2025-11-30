document.addEventListener("DOMContentLoaded", () => {
  console.log("document succesfully loaded, baby");

  document.getElementById('btnClicky').addEventListener('click', btnClicky);
}
);

function btnClicky() {
  console.log('in btnClicky event');
  document.getElementById('btnClicky').style.transform = 'rotate(90deg)'
  console.log('after rotation');
}
document.addEventListener("DOMContentLoaded", () => {

  // Detect if page is inside /pages/
  const prefix = window.location.pathname.includes("/pages/") ? "../" : "";

  // Choose correct JSON file based on which page you're on
  let jsonFile = "";

  if (window.location.pathname.includes("achievements")) {
    jsonFile = prefix + "assets/data/achievements.json";
  } else if (window.location.pathname.includes("projects")) {
    jsonFile = prefix + "assets/data/projects.json";
  } else {
    console.log("Not an achievements or projects page.");
    return;
  }

  fetch(jsonFile)
    .then(response => response.json())
    .then(data => renderCards(data))
    .catch(err => console.error("JSON load error:", err));
});

function renderCards(items) {

  const container = document.querySelector(".row.g-4");
  container.innerHTML = ""; // clear hardcoded cards

  items.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("col-md-10", "offset-md-1");

    card.innerHTML = `
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${item.date}</h6>
                    <p class="card-text">${item.description}</p>
                </div>
                <div class="card-footer text-end">
                    <a href="${item.link || '#'}" class="btn btn-sm btn-primary" target="_blank">
                        Details
                    </a>
                </div>
            </div>
        `;

    container.appendChild(card);
  });
}
