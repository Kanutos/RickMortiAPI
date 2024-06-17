document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const season = urlParams.get('season');
    if (season) {
        currentPage = 1;
        getAllEpisodes().then(() => {
            displayEpisodesBySeason(season, currentPage);
            togglePagination(false);
        });
    } else {
        getAllEpisodes().then(() => {
            displayEpisodes(currentPage);
            togglePagination(true);
        });
    }

    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            if (season) {
                displayEpisodesBySeason(season, currentPage);
            } else {
                displayEpisodes(currentPage);
            }
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        if (currentPage * episodesPerPage < allEpisodes.length) {
            currentPage++;
            if (season) {
                displayEpisodesBySeason(season, currentPage);
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
    return fetch(`https://rickandmortyapi.com/api/episode?page=${page}`)
        .then(response => response.json())
        .then(data => {
            allEpisodes = allEpisodes.concat(data.results);
            if (data.info.next) {
                return getAllEpisodes(page + 1);
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

function togglePagination(show) {
    const pagination = document.getElementById('pagination');
    if (show) {
        pagination.style.display = 'block';
    } else {
        pagination.style.display = 'none';
    }
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

// Archivo episodios.js

document.addEventListener("DOMContentLoaded", function () {
    const episodesList = document.getElementById('episodes-list');
    const pagination = document.getElementById('pagination');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');

    let currentPage = 1;

    function fetchEpisodes(page) {
        fetch(`https://rickandmortyapi.com/api/episode?page=${page}`)
            .then(response => response.json())
            .then(data => {
                renderEpisodes(data.results);
                handlePagination(data.info);
            })
            .catch(error => console.error(error));
    }

    function renderEpisodes(episodes) {
        episodesList.innerHTML = '';
        episodes.forEach(episode => {
            const episodeElement = document.createElement('div');
            episodeElement.className = 'episode';
            episodeElement.innerHTML = `
                <div class="episode-info">
                    <h2>${episode.name}</h2>
                    <p><strong>Episode:</strong> ${episode.episode}</p>
                    <p><strong>Air Date:</strong> ${episode.air_date}</p>
                </div>
                <div class="episode-characters">
                    <div class="carousel-container">
                        <div class="carousel" id="carousel-${episode.id}">
                            ${episode.characters.slice(0, 4).map(characterUrl => `
                                <div class="carousel-item">
                                    <img src="#" data-url="${characterUrl}" alt="Character Image">
                                    <p>Loading...</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            episodesList.appendChild(episodeElement);
            fetchCharacters(episode.characters.slice(0, 4), episode.id);
        });
    }

    function fetchCharacters(characterUrls, episodeId) {
        characterUrls.forEach(url => {
            fetch(url)
                .then(response => response.json())
                .then(character => {
                    const carouselItem = document.querySelector(`img[data-url="${url}"]`).parentElement;
                    carouselItem.querySelector('img').src = character.image;
                    carouselItem.querySelector('p').textContent = character.name;
                })
                .catch(error => console.error(error));
        });
    }

    function handlePagination(info) {
        prevPageBtn.disabled = !info.prev;
        nextPageBtn.disabled = !info.next;
    }

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchEpisodes(currentPage);
        }
    });

    nextPageBtn.addEventListener('click', () => {
        currentPage++;
        fetchEpisodes(currentPage);
    });

    fetchEpisodes(currentPage);
});
