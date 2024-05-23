let allCharacters = [];
let currentPage = 1;
const charactersPerPage = 20;

function getAllCharacters(page = 1) {
    fetch(`https://rickandmortyapi.com/api/character?page=${page}`)
        .then(response => response.json())
        .then(data => {
            allCharacters = allCharacters.concat(data.results);
            if (data.info.next) {
                getAllCharacters(page + 1);
            } else {
                displayCharacters(currentPage);
            }
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
