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

// CONFIG

const DATA_PATH = 'data.json';

// Fallback SVG (no extra file needed)
const FALLBACK_DATA_URI = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">' +
  '<rect width="100%" height="100%" fill="#e6eef0"/>' +
  '<text x="50%" y="50%" font-size="24" fill="#7a8b8c" text-anchor="middle" dominant-baseline="central">Image not available</text>' +
  '</svg>'
);

// IMAGE FIELD RESOLUTION

function chooseImageField(item) {
  const keys = ['image', 'img', 'imgUrl', 'screenshot', 'thumbnail', 'thumb', 'picture'];
  for (const k of keys) {
    if (item[k]) return String(item[k]).trim();
  }
  if (item.media && item.media.image) return String(item.media.image).trim();
  return null;
}



// CARD COMPONENT

function createCard(item, index) {
  const card = document.createElement('article');
  card.className = 'card';

  const img = document.createElement('img');
  img.className = 'card-img';

  const src = chooseImageField(item);
  if (src) {
    img.src = src;
  } else {
    img.src = FALLBACK_DATA_URI;
    console.warn('No image field found for item:', item.title || index, item);
  }

  img.onerror = () => {
    console.warn('Image failed to load, using fallback:', img.src);
    img.src = FALLBACK_DATA_URI;
  };

  img.alt = item.title ? item.title + ' screenshot' : 'project screenshot';

  const body = document.createElement('div');
  body.className = 'card-body';

  const title = document.createElement('h3');
  title.className = 'title';
  title.textContent = item.title || 'Untitled Project';

  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.textContent = item.date || '';

  const desc = document.createElement('p');
  desc.className = 'desc';
  desc.textContent = item.description || '';

  const links = document.createElement('div');
  links.className = 'links';

  function addLink(url, label, primary = false) {
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = primary ? 'btn' : 'btn muted-btn';
    a.textContent = label;
    links.appendChild(a);
  }

  addLink(item.live || item.game || item.links, 'Live', true);
  addLink(item.project || item.code, 'Code');

  body.appendChild(title);
  body.appendChild(meta);
  body.appendChild(desc);
  body.appendChild(links);

  card.appendChild(img);
  card.appendChild(body);

  return card;
}



// LOAD + RENDER

async function loadAndRender() {
  const grid = document.getElementById('grid');
  const debug = document.getElementById('debug');

  try {
    const res = await fetch(DATA_PATH, { cache: 'no-cache' });
    if (!res.ok) throw new Error('Failed to fetch JSON: ' + res.status);
    const data = await res.json();

    if (!Array.isArray(data)) throw new Error('JSON must be an array.');

    grid.innerHTML = '';

    let withImages = 0;

    data.forEach((item, i) => {
      if (chooseImageField(item)) withImages++;
      grid.appendChild(createCard(item, i));
    });

    debug.textContent = `Loaded ${data.length} projects — ${withImages} have images.`;

  } catch (err) {
    console.error(err);
    debug.innerHTML = `<span class="warning">Error loading projects: ${err.message}</span>`;
  }
}

loadAndRender();