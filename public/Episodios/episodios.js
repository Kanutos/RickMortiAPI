let allEpisodes = [];
let currentPage = 1;
const episodesPerPage = 20;

function getAllEpisodes(page = 1) {
    fetch(`https://rickandmortyapi.com/api/episode?page=${page}`)
        .then(response => response.json())
        .then(data => {
            allEpisodes = allEpisodes.concat(data.results);
            if (data.info.next) {
                getAllEpisodes(page + 1);
            } else {
                displayEpisodes(currentPage);
            }
        })
        .catch(error => console.error('Error fetching episodes:', error));
}

function getEpisodeCharacters(episode) {
    const characterPromises = episode.characters.map(url =>
        fetch(url).then(response => response.json())
    );
    return Promise.all(characterPromises);
}

function createCharacterCarousel(characters) {
    const carousel = document.createElement('div');
    carousel.className = 'carousel';

    characters.forEach(character => {
        const characterDiv = document.createElement('div');
        characterDiv.className = 'carousel-item';
        characterDiv.innerHTML = `
            <img src="${character.image}" alt="${character.name}">
            <p>${character.name}</p>
        `;
        carousel.appendChild(characterDiv);
    });

    return carousel;
}

function displayEpisodes(page) {
    const episodesList = document.getElementById('episodes-list');
    episodesList.innerHTML = '';

    const startIndex = (page - 1) * episodesPerPage;
    const endIndex = startIndex + episodesPerPage;
    const episodesToDisplay = allEpisodes.slice(startIndex, endIndex);

    episodesToDisplay.forEach(episode => {
        const episodeElement = document.createElement('div');
        episodeElement.className = 'episode';
        episodeElement.innerHTML = `
            <div class="episode-info">
                <h2>${episode.name}</h2>
                <p>Temporada: ${episode.episode.split('E')[0].replace('S', 'T')}</p>
                <p>Episodio: ${episode.episode.split('E')[1]}</p>
                <p>Fecha de emisión: ${episode.air_date}</p>
            </div>
            <div class="episode-characters">
                <h3>Personajes</h3>
            </div>
        `;
        episodesList.appendChild(episodeElement);

        getEpisodeCharacters(episode).then(characters => {
            const carousel = createCharacterCarousel(characters);
            episodeElement.querySelector('.episode-characters').appendChild(carousel);
        });
    });
}

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayEpisodes(currentPage);
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    if ((currentPage * episodesPerPage) < allEpisodes.length) {
        currentPage++;
        displayEpisodes(currentPage);
    }
});

getAllEpisodes();
