// scripts/script.js — simple, single file for projects & achievements
document.addEventListener('DOMContentLoaded', () => {
  // determine page type
  const path = window.location.pathname.toLowerCase();
  let jsonPath = null;
  let targetId = null; // id of container to render into

  if (path.includes('projects')) {
    jsonPath = '../assets/data/projects.json';
    targetId = 'projects-container';
  } else if (path.includes('achievements')) {
    jsonPath = '../assets/data/achievements.json';
    targetId = 'achievements-container';
  } else {
    // not a JSON-driven page
    console.log('script.js: not a projects or achievements page.');
    return;
  }

  loadAndRender(jsonPath, targetId).catch(err => console.error(err));
});

async function loadAndRender(jsonPath, targetId) {
  console.log('Loading JSON from', jsonPath);
  try {
    const res = await fetch(jsonPath);
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('JSON not an array');
    renderItems(data, targetId);
    console.log(`Rendered ${data.length} items from ${jsonPath}`);
  } catch (err) {
    console.error('Error loading JSON:', err);
    const container = getContainer(targetId);
    if (container) container.innerHTML = '<div class="col-12"><p class="text-danger">Could not load data.</p></div>';
  }
}

function getContainer(targetId) {
  return document.getElementById(targetId) || document.querySelector('.row.g-4');
}

function renderItems(items, targetId) {
  const container = getContainer(targetId);
  if (!container) {
    console.warn('No container found to render items into');
    return;
  }
  container.innerHTML = ''; // clear

  items.forEach(item => {
    // Determine if this is a project (has project/game/code keys) or achievement
    const isProject = Boolean(item.project || item.game || item.code || item.screenshot || item.image);

    const col = document.createElement('div');
    col.className = 'col-md-10 offset-md-1';

    if (isProject) {
      const title = escape(item.title);
      const date = escape(item.date || '');
      const desc = escape(item.description || '');
      const image = escape(item.image || item.screenshot || '');
      const live = safeHref(item.game || item.live || item.links || '');
      const code = safeHref(item.project || item.code || '');

      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${date}</h6>
            <p class="card-text">${desc}</p>
            ${image ? `<img src="${image}" alt="${title} screenshot" class="img-fluid mt-3">` : ''}
          </div>
          <div class="card-footer text-end">
            ${live ? `<a class="btn btn-sm btn-primary" href="${escape(live)}" target="_blank" rel="noopener noreferrer">Live</a>` : ''}
            ${code ? `<a class="btn btn-sm btn-outline-primary ms-2" href="${escape(code)}" target="_blank" rel="noopener noreferrer">Code</a>` : ''}
          </div>
        </div>
      `;
    } else {
      // Achievement card
      const title = escape(item.title);
      const date = escape(item.date || '');
      const desc = escape(item.description || '');
      const type = escape(item.type || '');
      const link = safeHref(item.link || '');

      col.innerHTML = `
        <article class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${date}</h6>
            <p class="card-text">${desc}</p>
          </div>
          <div class="card-footer text-end">
            ${link ? `<a class="btn btn-sm btn-primary" href="${escape(link)}" target="_blank" rel="noopener noreferrer">Details</a>` : `<button class="btn btn-sm btn-primary" disabled>Details</button>`}
            <span class="badge bg-secondary ms-2">${type}</span>
          </div>
        </article>
      `;
    }

    container.appendChild(col);
  });
}

// helpers
function escape(s = '') {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function safeHref(url = '') {
  if (!url) return '';
  const u = String(url).trim();
  if (u === '#' || u.startsWith('http://') || u.startsWith('https://') || u.startsWith('/') || u.startsWith('./') || u.startsWith('../') || u.startsWith('mailto:')) {
    return u;
  }
  // if user forgot protocol and it's like example.com, prefix with https://
  if (/^[\w.-]+\.[a-z]{2,}/i.test(u)) return 'https://' + u;
  return '';
}