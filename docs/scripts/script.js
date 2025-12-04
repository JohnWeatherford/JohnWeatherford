document.addEventListener("DOMContentLoaded", () => {
  console.log("document loaded");
  document.getElementById('onClick').addEventListener('click', onClick);
}
);

function onClick() {
  console.log('in onClick event');
  document.getElementById('onClick').style.transform = 'rotate(15deg)'
  console.log('after rotation');
}

// script to pull data from json file and create project cards
fetch('https://github.com/JohnWeatherford/JohnWeatherford/blob/main/docs/project.json').then(response => response.json())
  .then(data => {

    const projectCardSet = document.getElementById('projectCardSet');
    data.projects.forEach(project => {
      console.log(project);
      const card = document.createElement('div');
      card.className = "projectCards cards";
      const cardName = document.createElement('h1');
      cardName.textContent = `${project.name}`;
      card.appendChild(cardName);

      const projectDesc = document.createElement('h6');
      projectDesc.className = "projectDesc";
      projectDesc.textContent = `${project.desc}`;
      card.appendChild(projectDesc);



      const projectImg = document.createElement('img');
      projectImg.className = "projectImg";
      projectImg.src = `${project.img}`;
      projectImg.alt = "project image";
      card.appendChild(projectImg);

      const repoLink = document.createElement('a');
      repoLink.className = "repoLinks btn btn-secondary btn-sm";
      repoLink.href = `${project.repo}`;
      repoLink.textContent = "Repo Link";
      repoLink.target = "_blank";
      card.appendChild(repoLink);

      const projectLink = document.createElement('a');
      projectLink.className = "projectLinks btn btn-secondary btn-sm";
      projectLink.href = `${project.app}`;
      projectLink.textContent = "project Link";
      projectLink.target = "_blank";
      card.appendChild(projectLink);

      // card.textContent = ` ${project.repo}, ${project.app}, ${project.img}`;

      projectCardSet.appendChild(card);


    });

  })
  .catch(error => console.error('Error fetching app ideas:', error));

// script to pull data from json file and create achievement cards
fetch('https://github.com/JohnWeatherford/JohnWeatherford/blob/main/docs/achievements.json').then(response => response.json())
  .then(data => {

    const achievementCardSet = document.getElementById('achievementCardSet');
    data.achievements.forEach(achievement => {




      console.log(achievement);
      const card = document.createElement('div');
      card.className = "achievementCards";

      const trophyIcon = document.createElement("i")
      trophyIcon.className = "bi bi-trophy-fill trophyIcon";
      card.appendChild(trophyIcon);

      const cardName = document.createElement('h2');
      cardName.textContent = `${achievement.name}`;
      card.appendChild(cardName);

      const achievementDesc = document.createElement('h6');
      achievementDesc.className = "achievementDesc";
      achievementDesc.textContent = `${achievement.desc}`;
      card.appendChild(achievementDesc);

      achievementCardSet.appendChild(card);


    });

  })
  .catch(error => console.error('Error fetching app ideas:', error));