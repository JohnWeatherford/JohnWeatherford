/ scripts/script.js - robust, single loader
document.addEventListener('DOMContentLoaded', () => {
  console.log('script.js running');

  // If your pages folder is named 'pages' this will be true
  const inPages = window.location.pathname.split('/').includes('pages');
  const prefix = inPages ? '../' : '';

  // decide which file + container
  let jsonFile = null;
  let containerSelector = null;
  let projectsFlag = false;
  if (window.location.pathname.includes('projects')) {
    jsonFile = prefix + 'assets/data/projects.json';
    containerSelector = '#projects-container';
    projectsFlag = true;
  } else if (window.location.pathname.includes('achievements')) {
    jsonFile = prefix + 'assets/data/achievements.json';
    containerSelector = '#achievements-container';
  } else {
    console.log('Not a projects or achievements page — nothing to load.');
    return;
  }

  console.log('Loading JSON:', jsonFile);
  fetch(jsonFile)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      return res.json();
    })
    .then(data => {
      if (!Array.isArray(data)) throw new Error('JSON is not an array');
      renderCards(data, containerSelector, projectsFlag);
      console.log('Rendered', data.length, 'items');
    })
    .catch(err => {
      console.error('Failed to load or parse JSON:', err);
      const container = document.querySelector(containerSelector) || document.querySelector('.row.g-4');
      if (container) container.innerHTML = '<div class="col-12"><p class="text-danger">Could not load data.</p></div>';
    });
});

function renderCards(items, containerSelector, projectsFlag = true) {
  const container = document.querySelector(containerSelector) || document.querySelector('.row.g-4');
  if (!container) {
    console.warn('No container found to render into:', containerSelector);
    return;
  }
  container.innerHTML = '';

  items.forEach(item => {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-10 offset-md-1';

    const link = firstTruthy(item.links, item.link, item.project, item.code, item.live, '#');
    const live = firstTruthy(item.live, item.game, '');
    const img = firstTruthy(item.image, item.screenshot, '');

    const title = escapeHtml(firstTruthy(item.title, 'Untitled'));
    const date = escapeHtml(firstTruthy(item.date, ''));
    const desc = escapeHtml(firstTruthy(item.description, ''));

    let imgHtml = '';
    if (img && img !== '#') {
      imgHtml = `<img src="${escapeAttr(img)}" alt="${title} screenshot" class="img-fluid mt-3">`;
    }

    const liveBtn = live ? `<a class="btn btn-sm btn-primary" href="${escapeAttr(live)}" target="_blank" rel="noopener noreferrer">Live</a>` : '';
    const codeBtn = (link && link !== '#') ? `<a class="btn btn-sm btn-outline-primary ms-2" href="${escapeAttr(link)}" target="_blank" rel="noopener noreferrer">Code</a>` : `<button class="btn btn-sm btn-primary" disabled>Details</button>`;

    if (projectsFlag) {
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
      const type = escapeHtml(item.type || '');
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
    if (v !== undefined && v !== null && String(v).trim() !== '') return v;
  }
  return '';
}
function escapeHtml(unsafe = '') {
  return String(unsafe)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
function escapeAttr(s = '') {
  return String(s).trim();
}