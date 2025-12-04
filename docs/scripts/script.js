// Load Projects
fetch("../project.json")
  .then(res => res.json())
  .then(projects => {
    const container = document.getElementById("projectCardSet");

    projects.forEach(p => {
      const card = document.createElement("div");
      card.classList.add("projectCards");

      card.innerHTML = `
        <h2>${p.title}</h2>
        <p><strong>Date:</strong> ${p.date}</p>
        <p>${p.description}</p>
        ${p.screenshot || p.image ? `<img src="${p.screenshot || p.image}" alt="${p.title} screenshot">` : ""}
        <p>
          ${p.project ? `<a href="${p.project}" target="_blank">Project Link</a>` : ""}
          ${p.live ? ` | <a href="${p.live}" target="_blank">Live Demo</a>` : ""}
          ${p.code ? ` | <a href="${p.code}" target="_blank">Source Code</a>` : ""}
        </p>
      `;

      container.appendChild(card);
    });
  })
  .catch(err => console.error("Error loading project.json", err));


// Load Achievements
fetch("../achievements.json")
  .then(res => res.json())
  .then(achievements => {
    const container = document.getElementById("achievementCardSet");

    achievements.forEach(a => {
      const card = document.createElement("div");
      card.classList.add("achievementCards");

      card.innerHTML = `
        <h3>${a.title}</h3>
        <p><strong>${a.date}</strong></p>
        <p>${a.description}</p>
        ${a.link ? `<a href="${a.link}" target="_blank">View</a>` : ""}
      `;

      container.appendChild(card);
    });
  })
  .catch(err => console.error("Error loading achievements.json", err));


// Test button
document.getElementById("onClick").addEventListener("click", () => {
  alert("Button Works!");
});