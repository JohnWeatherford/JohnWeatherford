/// /scripts/script.js - safer loader for projects.json
document.addEventListener('DOMContentLoaded', () => {
  (async function loadProjects() {
    try {
      const inPages = window.location.pathname.split('/').includes('pages');
      const prefix = inPages ? '../' : '';
      const jsonPath = prefix + 'assets/data/projects.json';

      const container = document.getElementById('projects-container') || document.querySelector('.row.g-4');
      if (!container) {
        console.warn('No projects container found (#projects-container or .row.g-4)');
        return;
      }

      const resp = await fetch(jsonPath);
      if (!resp.ok) throw new Error(`Failed to fetch ${jsonPath}: ${resp.status} ${resp.statusText}`);
      const data = await resp.json();

      if (!Array.isArray(data)) throw new Error('projects.json must be an array');

      // clear existing content
      container.innerHTML = '';

      data.forEach(p => {
        const title = safeText(p.title ?? 'Untitled');
        const date = safeText(p.date ?? '');
        const desc = safeText(p.description ?? '');
        const img = firstTruthy(p.image, p.screenshot, '');
        const live = firstTruthy(p.game, p.live, '');
        const code = firstTruthy(p.links, p.project, p.code, '');

        // col wrapper
        const col = document.createElement('div');
        col.className = 'col-12 col-md-10 offset-md-1';

        // card
        const card = document.createElement('article');
        card.className = 'card h-100 shadow-sm';

        // card body
        const body = document.createElement('div');
        body.className = 'card-body';

        const h5 = document.createElement('h5');
        h5.className = 'card-title';
        h5.textContent = title;

        const h6 = document.createElement('h6');
        h6.className = 'card-subtitle mb-2 text-muted';
        h6.textContent = date;

        const pEl = document.createElement('p');
        pEl.className = 'card-text';
        pEl.textContent = desc;

        body.appendChild(h5);
        body.appendChild(h6);
        body.appendChild(pEl);

        if (img && String(img).trim() !== '#') {
          const imgEl = document.createElement('img');
          imgEl.className = 'img-fluid mt-3';
          imgEl.setAttribute('alt', `${title} screenshot`);
          imgEl.setAttribute('src', String(img).trim());
          body.appendChild(imgEl);
        }

        // footer with buttons
        const footer = document.createElement('div');
        footer.className = 'card-footer text-end';

        if (live) {
          const aLive = document.createElement('a');
          aLive.className = 'btn btn-sm btn-primary';
          aLive.setAttribute('href', String(live).trim());
          aLive.setAttribute('target', '_blank');
          aLive.setAttribute('rel', 'noopener noreferrer');
          aLive.textContent = 'Live';
          footer.appendChild(aLive);
        }

        if (code) {
          const aCode = document.createElement('a');
          aCode.className = 'btn btn-sm btn-outline-primary ms-2';
          aCode.setAttribute('href', String(code).trim());
          aCode.setAttribute('target', '_blank');
          aCode.setAttribute('rel', 'noopener noreferrer');
          aCode.textContent = 'Code';
          footer.appendChild(aCode);
        }

        if (!live && !code) {
          const btn = document.createElement('button');
          btn.className = 'btn btn-sm btn-primary';
          btn.setAttribute('disabled', 'disabled');
          btn.textContent = 'Details';
          footer.appendChild(btn);
        }

        card.appendChild(body);
        card.appendChild(footer);
        col.appendChild(card);
        container.appendChild(col);
      });
    } catch (err) {
      console.error(err);
      const container = document.getElementById('projects-container') || document.querySelector('.row.g-4');
      if (container) {
        container.innerHTML = '<div class="col-12"><p class="text-danger">Could not load data.</p></div>';
      }
    }
  })();
});

// helper: return first non-empty, not '#' string
function firstTruthy(...vals) {
  for (const v of vals) {
    if (v !== undefined && v !== null) {
      const s = String(v).trim();
      if (s !== '' && s !== '#') return s;
    }
  }
  return '';
}

// sanitize plain text for display (keeps it safe when using textContent)
function safeText(s = '') {
  return String(s);
}