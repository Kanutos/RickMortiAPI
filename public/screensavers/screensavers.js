let selectedImageUrl = '';

function loadScreensavers() {
    const screensavers = [
        { url: '/imagenes/salvapantallas1', name: 'Rick_and_Morty_Screen1' },
        { url: '/imagenes/salvapantallas2', name: 'Rick_and_Morty_Screen2' },
        { url: '/imagenes/salvapantallas3', name: 'Rick_and_Morty_Screen3' },
        { url: '/imagenes/salvapantallas4', name: 'Rick_and_Morty_Screen4' },
        { url: '/imagenes/salvapantallas5', name: 'Rick_and_Morty_Screen5' },
        { url: '/imagenes/salvapantallas6', name: 'Rick_and_Morty_Screen6' },
        { url: '/imagenes/salvapantallas7', name: 'Rick_and_Morty_Screen7' },
        { url: '/imagenes/salvapantallas8', name: 'Rick_and_Morty_Screen8' },
        { url: '/imagenes/salvapantallas9', name: 'Rick_and_Morty_Screen9' },
    ];

    const screensaversGrid = document.querySelector('.screensavers-grid');
    screensavers.forEach(screensaver => {
        const screensaverElement = document.createRange().createContextualFragment(/*html*/ `
            <div class="screensaver">
                <img src="${screensaver.url}" alt="${screensaver.name}">
                <button onclick="openDownloadModal('${screensaver.url}', '${screensaver.name}')">
                    <i class="fas fa-download"></i> Descargar
                </button>
            </div>
        `);
        screensaversGrid.appendChild(screensaverElement);
    });
}

function openDownloadModal(url, name) {
    selectedImageUrl = url;
    document.getElementById('fileName').value = name; // Set default filename
    document.getElementById('downloadModal').style.display = 'flex';
}

function closeDownloadModal() {
    document.getElementById('downloadModal').style.display = 'none';
}

function downloadImage(url, filename) {
    fetch(url, { mode: 'no-cors' })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok. Status: ${response.status}, StatusText: ${response.statusText}`);
            }
            return response.blob();
        })
        .then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch(error => {
            console.error('Error during the fetch:', error);
            alert(`Error al descargar la imagen. Por favor, intenta de nuevo. Detalles: ${error.message}`);
        });
}

document.addEventListener('DOMContentLoaded', loadScreensavers);

document.getElementById('confirmDownload').addEventListener('click', () => {
    const fileName = document.getElementById('fileName').value || 'descarga';
    downloadImage(selectedImageUrl, fileName);
    closeDownloadModal();
});

document.querySelector('.close').addEventListener('click', closeDownloadModal);
