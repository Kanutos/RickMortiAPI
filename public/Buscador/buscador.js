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
        const article = document.createRange().createContextualFragment(`
            <article>
                <div class="image-container">
                    <img src="${character.image}" alt="${character.name}" data-index="${allCharacters.indexOf(character)}">
                </div>
                <h2>${character.name}</h2>
                <span><b>Estado:</b> ${character.status}</span>
                <span><b>Genero:</b> ${character.gender}</span>
                <span><b>Especie:</b> ${character.species}</span>
                <span><b>origen:</b> ${character.origin.name}</span>
                <span><b>localizacion:</b> ${character.location.name}</span>
            </article>
        `);
        main.append(article);
    });

    document.querySelectorAll('.image-container img').forEach(img => {
        img.addEventListener('click', event => {
            const index = event.target.getAttribute('data-index');
            showCharacterDetails(index);
        });
    });
}

function showCharacterDetails(index) {
    const character = allCharacters[index];
    document.getElementById('characterImage').src = character.image;
    document.getElementById('characterName').textContent = character.name;
    document.getElementById('characterSpecies').textContent = character.species;
    document.getElementById('characterStatus').textContent = character.status;
    document.getElementById('characterGender').textContent = character.gender;
    document.getElementById('characterOrigin').textContent = character.origin.name;
    
    // Show the modal
    const modal = document.getElementById('characterModal');
    modal.style.display = "block";
}

// Close the modal when the user clicks on <span> (x)
document.querySelector('.close').addEventListener('click', () => {
    const modal = document.getElementById('characterModal');
    modal.style.display = "none";
});

// Close the modal when the user clicks anywhere outside of the modal
window.addEventListener('click', event => {
    const modal = document.getElementById('characterModal');
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

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

    currentPage = 1;
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
