// scripts/script.js - simple loader for projects.json
document.addEventListener('DOMContentLoaded', () => {
  const inPages = window.location.pathname.split('/').includes('pages');
  const prefix = inPages ? '../' : '';
  const jsonPath = prefix + 'assets/data/projects.json';

  const container = document.getElementById('projects-container') || document.querySelector('.row.g-4');
  if (!container) {
    console.warn('No projects container found (#projects-container or .row.g-4)');
    return;
  }

  fetch(jsonPath)
    .then(r => {
      if (!r.ok) throw new Error(`Failed to fetch ${jsonPath}: ${r.status}`);
      return r.json();
    })
    .then(data => {
      if (!Array.isArray(data)) throw new Error('projects.json must be an array');
      container.innerHTML = '';
      data.forEach(p => {
        const title = safeText(p.title || 'Untitled');
        const date = safeText(p.date || '');
        const desc = safeText(p.description || '');
        const img = firstTruthy(p.image, p.screenshot, '');
        const live = firstTruthy(p.game, p.live, '');
        const code = firstTruthy(p.links, p.project, p.code, '');

        const imgHtml = img && img !== '#' ? `<img src="${escapeAttr(img)}" alt="${title} screenshot" class="img-fluid mt-3">` : '';

        const liveBtn = live ? `<a class="btn btn-sm btn-primary" href="${escapeAttr(live)}" target="_blank" rel="noopener noreferrer">Live</a>` : '';
        const codeBtn = code ? `<a class="btn btn-sm btn-outline-primary ms-2" href="${escapeAttr(code)}" target="_blank" rel="noopener noreferrer">Code</a>` : `<button class="btn btn-sm btn-primary" disabled>Details</button>`;

        const col = document.createElement('div');
        col.className = 'col-12 col-md-10 offset-md-1';
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
        container.appendChild(col);
      });
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = '<div class="col-12"><p class="text-danger">Could not load data.</p></div>';
    });
});

function firstTruthy(...vals) {
  for (const v of vals) {
    if (v !== undefined && v !== null && String(v).trim() !== '' && String(v).trim() !== '#') return v;
  }
  return '';
}
function safeText(s = '') { return String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'); }
function escapeAttr(s = '') { return String(s).trim(); }