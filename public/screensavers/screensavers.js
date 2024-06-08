let selectedImageUrl = '';

function loadScreensavers() {
    const screensavers = [
        { url: 'https://fondosmil.co/fondo/27333.jpg', name: 'Rick_and_Morty_Screen1.jpg' },
        { url: 'https://fondosmil.co/fondo/27334.jpg', name: 'Rick_and_Morty_Screen2.jpg' },
        { url: 'https://fondosmil.co/fondo/27335.jpg', name: 'Rick_and_Morty_Screen3.jpg' },
        { url: 'https://fondosmil.co/fondo/27340.jpg', name: 'Rick_and_Morty_Screen4.jpg' },
        { url: 'https://fondosmil.co/fondo/27342.jpg', name: 'Rick_and_Morty_Screen5.jpg' },
        { src: 'titulo_rick_y_morty.png', name: 'Rick_and_Morty_Screen6.jpg' } // Prueba localmente funciona
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
    // Uso del proxy para evitar problemas de CORS
    const proxyUrl = `/proxy?url=${encodeURIComponent(url)}`;

    fetch(proxyUrl)
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
