// scripts/script.js - simple loader for projects & achievements
document.addEventListener('DOMContentLoaded', () => {
  console.log('script.js running');

  // detect whether page path includes "pages" (so we know to prefix ../)
  const inPages = window.location.pathname.split('/').includes('pages');
  const prefix = inPages ? '../' : '';

  // choose which file & container based on filename
  const path = window.location.pathname.toLowerCase();
  let jsonFile = null;
  let containerId = null;
  let isProjects = false;
  let isAchievements = false;

  if (path.includes('projects')) {
    jsonFile = prefix + 'assets/data/projects.json';
    containerId = 'projects-container';
    isProjects = true;
  } else if (path.includes('achievements')) {
    jsonFile = prefix + 'assets/data/achievements.json';
    containerId = 'achievements-container';
    isAchievements = true;
  } else {
    console.log('Not a projects/achievements page — script will not run.');
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
      renderItems(data, container, isProjects, isAchievements);
      console.log('Rendered', data.length, 'items into', containerId);
    })
    .catch(err => {
      console.error('Could not load data:', err);
      container.innerHTML = '<div class="col-12"><p class="text-danger">Could not load data.</p></div>';
    });
});

function renderItems(items, container, isProjects = false, isAchievements = false) {
  container.innerHTML = ''; // clear existing
  items.forEach(item => {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-10 offset-md-1 mb-4';

    // normalize potential fields
    const title = safeText(firstTruthy(item.title, 'Untitled'));
    const date = safeText(firstTruthy(item.date, ''));
    const desc = safeText(firstTruthy(item.description, ''));
    const img = firstTruthy(item.image, item.screenshot, '');
    const live = firstTruthy(item.game, item.live, '');
    const code = firstTruthy(item.links, item.project, item.code, '');
    const link = firstTruthy(item.link, '');
    const type = safeText(item.type || '');

    // For achievements: check if we have a valid link
    const hasLink = isAchievements && link && link.trim() !== '' && link !== '#';

    // Image HTML - only show if not "#"
    const imgHtml = img && img !== '#' ?
      `<img src="${escapeAttr(img)}" alt="${title}" class="img-fluid mt-3 rounded" style="max-height: 200px; object-fit: contain;">` : '';

    // Projects: Live and Code buttons
    const liveBtn = live ? `<a class="btn btn-sm btn-primary" href="${escapeAttr(live)}" target="_blank" rel="noopener noreferrer">Live</a>` : '';
    const codeBtn = code ? `<a class="btn btn-sm btn-outline-primary ms-2" href="${escapeAttr(code)}" target="_blank" rel="noopener noreferrer">Code</a>` : '';

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
    } else if (isAchievements) {
      // ACHIEVEMENTS: Make entire card clickable if there's a link
      let cardContent = `
        <div class="card-body">
          ${type ? `<span class="badge ${getBadgeColor(type)} mb-2">${type}</span>` : ''}
          <h5 class="card-title">${title}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${date}</h6>
          <p class="card-text">${desc}</p>
          ${imgHtml}
        </div>
      `;

      // If there's a link, wrap the entire card in an anchor
      if (hasLink) {
        col.innerHTML = `
          <a href="${escapeAttr(link)}" class="text-decoration-none" target="_blank" rel="noopener noreferrer">
            <article class="card h-100 shadow-sm border-primary hover-lift">
              ${cardContent}
              <div class="card-footer text-end text-muted small">
                <span class="text-primary">Click to visit →</span>
              </div>
            </article>
          </a>
        `;
      } else {
        // No link, just a regular card
        col.innerHTML = `
          <article class="card h-100 shadow-sm">
            ${cardContent}
            <div class="card-footer text-end">
              <span class="text-muted small">No external link available</span>
            </div>
          </article>
        `;
      }
    }

    container.appendChild(col);
  });
}

// Helper function to get badge colors for achievement types
function getBadgeColor(type) {
  const typeLower = type.toLowerCase();
  const colors = {
    'course': 'bg-success',
    'academic': 'bg-info',
    'skill': 'bg-warning text-dark',
    'honor': 'bg-danger',
    'organization': 'bg-secondary',
    'certification': 'bg-primary'
  };
  return colors[typeLower] || 'bg-primary';
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

function escapeAttr(s = '') {
  // Properly escape URLs for attributes
  return String(s)
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Optional: Add hover effect styles
document.addEventListener('DOMContentLoaded', () => {
  // Add CSS for hover effects
  const style = document.createElement('style');
  style.textContent = `
    .hover-lift {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .hover-lift:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.1) !important;
      border-color: #0d6efd !important;
    }
    .card-title {
      color: inherit;
    }
    a .card:hover .card-title {
      color: #0d6efd;
    }
  `;
  document.head.appendChild(style);
});