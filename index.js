let allCharacters = [];
let allLocations = new Set();
let currentPage = 1;
const charactersPerPage = 20;

function getAllCharacters(page = 1) {
    fetch(`https://rickandmortyapi.com/api/character?page=${page}`)
        .then(response => response.json())
        .then(data => {
            allCharacters = allCharacters.concat(data.results);
            data.results.forEach(character => {
                allLocations.add(character.location.name);
            });
            if (data.info.next) {
                getAllCharacters(page + 1);
            } else {
                populateLocationDropdown();
                displayCharacters(currentPage);
            }
        });
}

function populateLocationDropdown() {
    const locationSelect = document.getElementById('location');
    const sortedLocations = Array.from(allLocations).sort();
    sortedLocations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        locationSelect.appendChild(option);
    });
}

function displayCharacters(page) {
    const main = document.querySelector("main");
    main.innerHTML = ''; // Clear existing content

    const startIndex = (page - 1) * charactersPerPage;
    const endIndex = startIndex + charactersPerPage;
    const charactersToDisplay = allCharacters.slice(startIndex, endIndex);

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

    const filteredCharacters = allCharacters.filter(character => {
        return (
            (name === '' || character.name.toLowerCase().includes(name)) &&
            (status === '' || character.status.toLowerCase() === status) &&
            (gender === '' || character.gender.toLowerCase() === gender) &&
            (location === '' || character.location.name.toLowerCase() === location.toLowerCase())
        );
    });

    displayFilteredCharacters(filteredCharacters);
}

function displayFilteredCharacters(filteredCharacters) {
    const main = document.querySelector("main");
    main.innerHTML = ''; // Clear existing content

    filteredCharacters.forEach(character => {
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

document.getElementById('searchForm').addEventListener('submit', (event) => {
    event.preventDefault();
    filterCharacters();
});

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayCharacters(currentPage);
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    if ((currentPage * charactersPerPage) < allCharacters.length) {
        currentPage++;
        displayCharacters(currentPage);
    }
});

getAllCharacters();
