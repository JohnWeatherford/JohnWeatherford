// scripts/script.js
document.addEventListener("DOMContentLoaded", () => {
  console.log('Page loaded - checking for projects or achievements');

  // Check if we're on projects or achievements page
  const isProjectsPage = window.location.pathname.includes('projects.html');
  const isAchievementsPage = window.location.pathname.includes('achievements.html');

  if (!isProjectsPage && !isAchievementsPage) {
    console.log('Not on projects or achievements page - script will not run');
    return;
  }

  // Determine which JSON file to load and which container to use
  let jsonFile;
  let container;

  if (isProjectsPage) {
    jsonFile = '../assets/data/projects.json';  // Path from pages folder
    container = document.getElementById('projects-container');
    console.log('Loading projects from:', jsonFile);
  } else if (isAchievementsPage) {
    jsonFile = '../assets/data/achievements.json';  // Path from pages folder
    container = document.getElementById('achievements-container');
    console.log('Loading achievements from:', jsonFile);
  }

  if (!container) {
    console.warn('Container not found!');
    return;
  }

  // Access the JSON file to create cards for each item
  fetch(jsonFile)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Data loaded successfully:', data.length, 'items');

      // Clear any existing content
      container.innerHTML = '';

      // Create cards for each item
      data.forEach(item => {
        console.log('Creating card for:', item.title || 'Untitled');

        // Create column for card
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6 col-lg-4';

        // Create card
        const card = document.createElement('div');
        card.className = 'card h-100 shadow-sm';

        // Create card body
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        // PROJECTS PAGE: Create project card
        if (isProjectsPage) {
          // Add title
          const title = document.createElement('h5');
          title.className = 'card-title';
          title.textContent = item.title || 'Untitled Project';
          cardBody.appendChild(title);

          // Add date if exists
          if (item.date) {
            const date = document.createElement('h6');
            date.className = 'card-subtitle mb-2 text-muted';
            date.textContent = item.date;
            cardBody.appendChild(date);
          }

          // Add description if exists
          if (item.description) {
            const desc = document.createElement('p');
            desc.className = 'card-text';
            desc.textContent = item.description;
            cardBody.appendChild(desc);
          }

          // Add image if exists and not "#"
          if (item.image && item.image !== '#') {
            const img = document.createElement('img');
            img.className = 'img-fluid mt-3 rounded';
            img.src = item.image;
            img.alt = item.title || 'Project image';
            img.style.maxHeight = '150px';
            img.style.objectFit = 'contain';
            cardBody.appendChild(img);
          }

          // Create card footer for buttons
          const cardFooter = document.createElement('div');
          cardFooter.className = 'card-footer text-end';

          // Add Live button if exists
          if (item.live || item.game) {
            const liveBtn = document.createElement('a');
            liveBtn.className = 'btn btn-sm btn-primary me-2';
            liveBtn.href = item.live || item.game;
            liveBtn.textContent = 'Live Demo';
            liveBtn.target = '_blank';
            liveBtn.rel = 'noopener noreferrer';
            cardFooter.appendChild(liveBtn);
          }

          // Add Code button if exists
          if (item.code || item.project) {
            const codeBtn = document.createElement('a');
            codeBtn.className = 'btn btn-sm btn-outline-primary';
            codeBtn.href = item.code || item.project;
            codeBtn.textContent = 'View Code';
            codeBtn.target = '_blank';
            codeBtn.rel = 'noopener noreferrer';
            cardFooter.appendChild(codeBtn);
          }

          card.appendChild(cardBody);
          card.appendChild(cardFooter);

        }
        // ACHIEVEMENTS PAGE: Create achievement card
        else if (isAchievementsPage) {
          // Add type badge if exists
          if (item.type) {
            const typeBadge = document.createElement('span');
            typeBadge.className = 'badge ' + getBadgeColor(item.type);
            typeBadge.textContent = item.type;
            cardBody.appendChild(typeBadge);
            cardBody.appendChild(document.createElement('br'));
          }

          // Add title
          const title = document.createElement('h5');
          title.className = 'card-title';
          title.textContent = item.title || 'Untitled Achievement';
          cardBody.appendChild(title);

          // Add date if exists
          if (item.date) {
            const date = document.createElement('h6');
            date.className = 'card-subtitle mb-2 text-muted';
            date.textContent = item.date;
            cardBody.appendChild(date);
          }

          // Add description if exists
          if (item.description) {
            const desc = document.createElement('p');
            desc.className = 'card-text';
            desc.textContent = item.description;
            cardBody.appendChild(desc);
          }

          // Add image if exists and not "#"
          if (item.image && item.image !== '#') {
            const img = document.createElement('img');
            img.className = 'img-fluid mt-3 rounded';
            img.src = item.image;
            img.alt = item.title || 'Achievement image';
            img.style.maxHeight = '150px';
            img.style.objectFit = 'contain';
            cardBody.appendChild(img);
          }

          // Create card footer
          const cardFooter = document.createElement('div');
          cardFooter.className = 'card-footer text-end';

          // Check if there's a valid link
          const hasValidLink = item.link && item.link.trim() !== '' && item.link !== '#';

          if (hasValidLink) {
            // Create clickable card
            const cardLink = document.createElement('a');
            cardLink.href = item.link;
            cardLink.className = 'text-decoration-none text-dark';
            cardLink.target = '_blank';
            cardLink.rel = 'noopener noreferrer';

            // Add hover effect
            card.classList.add('hover-card');

            // Add click indicator
            const clickIndicator = document.createElement('span');
            clickIndicator.className = 'text-primary';
            clickIndicator.textContent = 'Click to visit →';
            cardFooter.appendChild(clickIndicator);

            // Wrap card in link
            cardLink.appendChild(card);
            col.appendChild(cardLink);
          } else {
            // No link - just show card
            const noLink = document.createElement('span');
            noLink.className = 'text-muted small';
            noLink.textContent = 'No external link';
            cardFooter.appendChild(noLink);

            card.appendChild(cardBody);
            card.appendChild(cardFooter);
            col.appendChild(card);
          }

          // If card wasn't wrapped in link (has link), add body and footer
          if (!hasValidLink) {
            card.appendChild(cardBody);
            card.appendChild(cardFooter);
            col.appendChild(card);
          }
        }

        // Add column to container
        if (isProjectsPage || (isAchievementsPage && !hasValidLink)) {
          col.appendChild(card);
        }
        container.appendChild(col);
      });

      console.log('Successfully created', data.length, 'cards');

    })
    .catch(error => {
      console.error('Error loading data:', error);
      container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger">
                        <h4>Could not load data</h4>
                        <p>Error: ${error.message}</p>
                        <p>Please check the console for more details.</p>
                    </div>
                </div>
            `;
    });
});

// Helper function to get badge colors for achievement types
function getBadgeColor(type) {
  if (!type) return 'bg-secondary';

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

// Add CSS for hover effects
document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement('style');
  style.textContent = `
        .hover-card {
            transition: all 0.3s ease;
            cursor: pointer;
        }
        .hover-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
            border-color: #0d6efd !important;
        }
        a .card:hover .card-title {
            color: #0d6efd !important;
        }
        .badge {
            font-size: 0.8em;
            padding: 0.4em 0.8em;
        }
    `;
  document.head.appendChild(style);
});