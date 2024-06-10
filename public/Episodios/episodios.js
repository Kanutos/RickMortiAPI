document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar a');
    let currentSeason = null;

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    const seasonLinks = document.querySelectorAll('.dropdown-content a');
    seasonLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            currentSeason = event.target.dataset.season;
            currentPage = 1; // Reset to the first page
            displayEpisodesBySeason(currentSeason, currentPage);
        });
    });

    getAllEpisodes();

    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            if (currentSeason) {
                displayEpisodesBySeason(currentSeason, currentPage);
            } else {
                displayEpisodes(currentPage);
            }
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        if (currentPage * episodesPerPage < allEpisodes.length) {
            currentPage++;
            if (currentSeason) {
                displayEpisodesBySeason(currentSeason, currentPage);
            } else {
                displayEpisodes(currentPage);
            }
        }
    });
});

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
    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'carousel-container';

    const carousel = document.createElement('div');
    carousel.className = 'carousel';
    carouselContainer.appendChild(carousel);

    characters.forEach(character => {
        const characterDiv = document.createElement('div');
        characterDiv.className = 'carousel-item';
        characterDiv.innerHTML = `
            <img src="${character.image}" alt="${character.name}" data-character-id="${character.id}">
            <p>${character.name}</p>
        `;
        carousel.appendChild(characterDiv);
    });

    return carouselContainer;
}

function startCarousel(carousel, itemWidth, itemsToShow) {
    let currentIndex = 0;
    const totalItems = carousel.children.length;

    setInterval(() => {
        currentIndex = (currentIndex + itemsToShow) % totalItems;
        carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    }, 4000); 
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
            const carouselContainer = createCharacterCarousel(characters);
            episodeElement.querySelector('.episode-characters').appendChild(carouselContainer);

            const carousel = carouselContainer.querySelector('.carousel');
            const itemWidth = carouselContainer.querySelector('.carousel-item').offsetWidth;
            startCarousel(carousel, itemWidth, 3);

            carouselContainer.querySelectorAll('.carousel-item img').forEach(img => {
                img.addEventListener('click', (e) => {
                    const characterId = e.target.dataset.characterId;
                    showCharacterDetails(characterId);
                });
            });
        });
    });
}

function displayEpisodesBySeason(season, page) {
    const episodesList = document.getElementById('episodes-list');
    episodesList.innerHTML = '';

    const seasonEpisodes = allEpisodes.filter(episode => episode.episode.includes(`S${String(season).padStart(2, '0')}`));
    const startIndex = (page - 1) * episodesPerPage;
    const endIndex = startIndex + episodesPerPage;
    const episodesToDisplay = seasonEpisodes.slice(startIndex, endIndex);

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
            const carouselContainer = createCharacterCarousel(characters);
            episodeElement.querySelector('.episode-characters').appendChild(carouselContainer);

            const carousel = carouselContainer.querySelector('.carousel');
            const itemWidth = carouselContainer.querySelector('.carousel-item').offsetWidth;
            startCarousel(carousel, itemWidth, 3); 

            carouselContainer.querySelectorAll('.carousel-item img').forEach(img => {
                img.addEventListener('click', (e) => {
                    const characterId = e.target.dataset.characterId;
                    showCharacterDetails(characterId);
                });
            });
        });
    });
}

function showCharacterDetails(characterId) {
    fetch(`https://rickandmortyapi.com/api/character/${characterId}`)
        .then(response => response.json())
        .then(character => {
            const characterDetails = document.getElementById('characterDetails');
            characterDetails.innerHTML = `
                <div class="character-card">
                    <img src="${character.image}" alt="${character.name}">
                    <div class="character-info">
                        <h2>${character.name}</h2>
                        <p><strong>Especie:</strong> ${character.species}</p>
                        <p><strong>Género:</strong> ${character.gender}</p>
                        <p><strong>Origen:</strong> ${character.origin.name}</p>
                        <p><strong>Estado:</strong> ${character.status}</p>
                    </div>
                </div>
            `;
            document.getElementById('characterModal').style.display = 'block';
        })
        .catch(error => console.error('Error fetching character details:', error));
}

document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('characterModal').style.display = 'none';
});
