function getAllCharacters(page = 1, allCharacters = []) {
    fetch(`https://rickandmortyapi.com/api/character?page=${page}`)
        .then(response => response.json())
        .then(data => {
            allCharacters = allCharacters.concat(data.results);
            if (data.info.next) {
                getAllCharacters(page + 1, allCharacters);
            } else {
                displayCharacters(allCharacters);
            }
        });
}

function displayCharacters(characters) {
    const main = document.querySelector("main");
    main.innerHTML = ''; // Clear existing content

    characters.forEach(character => {
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

getAllCharacters();
