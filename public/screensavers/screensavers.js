let selectedImageUrl = '';

function fetchScreensavers() {
    return fetch('/api/screensavers')
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching screensavers:', error);
            return [];
        });
}

async function loadScreensavers() {
    const images = await fetchScreensavers();
    const screensaversGrid = document.querySelector('.screensavers-grid');

    images.forEach((image) => {
        const imageUrl = `/imagenes/${image}`;
        const screensaverElement = document.createRange().createContextualFragment(/*html*/ `
            <div class="screensaver">
                <img src="${imageUrl}" alt="${image}">
                <button onclick="openDownloadModal('${imageUrl}', '${image}')">
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
    fetch(url)
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
