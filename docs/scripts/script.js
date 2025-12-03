// scripts/script.js - loader for projects.json & achievements.json
document.addEventListener('DOMContentLoaded', () => {
  console.log('script.js running');

  // If your pages folder is named 'pages' this will be true
  const inPages = window.location.pathname.split('/').includes('pages');
  const prefix = inPages ? '../' : '';

  // pick file & container based on URL
  const path = window.location.pathname.toLowerCase();
  let jsonFile = null;
  let containerId = null;
  let isProjects = false;

  if (path.includes('projects')) {
    jsonFile = prefix + 'assets/data/projects.json';
    containerId = 'projects-container';
    isProjects = true;
  } else if (path.includes('achievements')) {
    jsonFile = prefix + 'assets/data/achievements.json';
    containerId = 'achievements-container';
  } else {
    console.log('Not a projects or achievements page — nothing to do.');
    return;
  }

  console.log('Loading JSON:', jsonFile);
  const container = document.getElementById(containerId) || document.querySelector('.row.g-4');
  if (!container) {
    console.warn('Container not found:', containerId);
    return;
  }

  fetch(jsonFile)
    .then(res => {
      if (!res.ok) throw new Error(`Fetch error ${res.status} ${res.statusText}`);
      return res.json();
    })
    .then(data => {
      if (!Array.isArray(data)) throw new Error('JSON root must be an array');
      renderItems(data, container, isProjects);
      console.log('Rendered', data.length, 'items into', containerId);
    })
    .catch(err => {
      console.error('Could not load data:', err);
      container.innerHTML = '<div class="col-12"><p class="text-danger">Could not load data.</p></div>';
    });
});

function renderItems(items, container, isProjects = false) {
  container.innerHTML = ''; // clear existing

  items.forEach(p => {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-10 offset-md-1';

    // the lines you requested
    const live = firstTruthy(p.game, p.live, '');
    const code = firstTruthy(p.links, p.project, p.code, '');

    const title = safeText(firstTruthy(p.title, 'Untitled'));
    const date = safeText(firstTruthy(p.date, ''));
    const desc = safeText(firstTruthy(p.description, ''));
    const img = firstTruthy(p.image, p.screenshot, '');

    const imgHtml = (img && img !== '#') ? `<img src="${escapeAttr(img)}" alt="${title} screenshot" class="img-fluid mt-3">` : '';

    const liveBtn = live ? `<a class="btn btn-sm btn-primary" href="${escapeAttr(live)}" target="_blank" rel="noopener noreferrer">Live</a>` : '';
    const codeBtn = code ? `<a class="btn btn-sm btn-outline-primary ms-2" href="${escapeAttr(code)}" target="_blank" rel="noopener noreferrer">Code</a>` : `<button class="btn btn-sm btn-primary" disabled>Details</button>`;

    if (isProjects) {
      col.innerHTML = `
        <article class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${date}</h6>
            <p class="card-text">${desc}</p>
            ${imgHtml}
          </div>
          <div class="card-footer text-end">
            ${liveBtn}
            ${codeBtn}
          </div>
        </article>
      `;
    } else {
      const type = safeText(p.type || '');
      col.innerHTML = `
        <article class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${date}</h6>
            <p class="card-text">${desc}</p>
          </div>
          <div class="card-footer text-end">
            ${codeBtn}
            ${type ? `<span class="badge bg-secondary ms-2">${type}</span>` : ''}
          </div>
        </article>
      `;
    }

    container.appendChild(col);
  });
}

function firstTruthy(...vals) {
  for (const v of vals) {
    if (v !== undefined && v !== null && String(v).trim() !== '' && String(v).trim() !== '#') return v;
  }
  return '';
}
function safeText(s = '') {
  return String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}
function escapeAttr(s = '') { return String(s).trim(); }