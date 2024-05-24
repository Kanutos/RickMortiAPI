function loadScreensavers() {
    const screensavers = [
        { url: 'https://example.com/screen1.jpg', name: 'Screen 1' },
        { url: 'https://example.com/screen2.jpg', name: 'Screen 2' },
        { url: 'https://example.com/screen3.jpg', name: 'Screen 3' },
        { url: 'https://example.com/screen4.jpg', name: 'Screen 4' }
    ];

    const screensaversGrid = document.querySelector('.screensavers-grid');
    screensavers.forEach(screensaver => {
        const screensaverElement = document.createRange().createContextualFragment(/*html*/ `
            <div class="screensaver">
                <img src="${screensaver.url}" alt="${screensaver.name}">
                <a href="${screensaver.url}" download="${screensaver.name}">
                    <button><i class="fas fa-download"></i> Descargar</button>
                </a>
            </div>
        `);
        screensaversGrid.append(screensaverElement);
    });
}

document.addEventListener('DOMContentLoaded', loadScreensavers);
