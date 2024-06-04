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
            <h2>${episode.name}</h2>
            <p>Temporada: ${episode.episode.split('E')[0].replace('S', 'T')}</p>
            <p>Episodio: ${episode.episode.split('E')[1]}</p>
            <p>Fecha de emisión: ${episode.air_date}</p>
        `;
        episodesList.appendChild(episodeElement);
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
