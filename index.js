let allCharacters = [];
let currentPage = 1;
const charactersPerPage = 20;
let filteredCharacters = [];

function getAllCharacters(page = 1) {
    fetch(`https://rickandmortyapi.com/api/character?page=${page}`)
        .then(response => response.json())
        .then(data => {
            allCharacters = allCharacters.concat(data.results);
            if (data.info.next) {
                getAllCharacters(page + 1);
            } else {
                populateLocationFilter();
                filterCharacters();
            }
        });
}

function populateLocationFilter() {
    const locationFilter = document.getElementById('location');
    const locations = Array.from(new Set(allCharacters.map(char => char.location.name))).sort();
    locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location.toLowerCase();
        option.textContent = location;
        locationFilter.appendChild(option);
    });
}

function displayCharacters(page, characters) {
    const main = document.querySelector("main");
    main.innerHTML = '';

    const startIndex = (page - 1) * charactersPerPage;
    const endIndex = startIndex + charactersPerPage;
    const charactersToDisplay = characters.slice(startIndex, endIndex);

    charactersToDisplay.forEach(character => {
        const article = document.createRange().createContextualFragment(/*html*/ `
            <article>
                <div class="image-container">
                    <img src="${character.image}" alt="${character.name}">
                </div>
                <h2>${character.name}</h2>
                <span>${character.status}</span>
                <span>${character.gender}</span>
                <span>${character.species}</span>
                <span>${character.origin.name}</span>
                <span>${character.location.name}</span>
            </article>
        `);
        main.append(article);
    });
}

function filterCharacters() {
    const name = document.getElementById('name').value.toLowerCase();
    const status = document.getElementById('status').value;
    const gender = document.getElementById('gender').value;
    const location = document.getElementById('location').value;

    filteredCharacters = allCharacters.filter(character => {
        return (
            (name === '' || character.name.toLowerCase().includes(name)) &&
            (status === '' || character.status.toLowerCase() === status) &&
            (gender === '' || character.gender.toLowerCase() === gender) &&
            (location === '' || character.location.name.toLowerCase() === location)
        );
    });

    currentPage = 1; // Reset to first page of results
    displayCharacters(currentPage, filteredCharacters);
}

document.getElementById('searchForm').addEventListener('submit', (event) => {
    event.preventDefault();
    filterCharacters();
});

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayCharacters(currentPage, filteredCharacters);
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    if ((currentPage * charactersPerPage) < filteredCharacters.length) {
        currentPage++;
        displayCharacters(currentPage, filteredCharacters);
    }
});

getAllCharacters();
