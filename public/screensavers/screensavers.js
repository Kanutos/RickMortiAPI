let selectedImageUrl = '';

function checkImageFormats(basePath, formats) {
    return new Promise((resolve, reject) => {
        let found = false;
        formats.forEach((format, index) => {
            const img = new Image();
            img.src = `${basePath}${format}`;
            img.onload = () => {
                if (!found) {
                    found = true;
                    resolve(`${basePath}${format}`);
                }
            };
            img.onerror = () => {
                if (index === formats.length - 1 && !found) {
                    reject(new Error('No valid image format found.'));
                }
            };
        });
    });
}

async function loadScreensavers() {
    const screensavers = [
        { basePath: '/imagenes/salvapantallas1', name: 'Rick_and_Morty_Screen1' },
        { basePath: '/imagenes/salvapantallas2', name: 'Rick_and_Morty_Screen2' },
        { basePath: '/imagenes/salvapantallas3', name: 'Rick_and_Morty_Screen3' },
        { basePath: '/imagenes/salvapantallas4', name: 'Rick_and_Morty_Screen4' },
        { basePath: '/imagenes/salvapantallas5', name: 'Rick_and_Morty_Screen5' },
        { basePath: '/imagenes/salvapantallas6', name: 'Rick_and_Morty_Screen6' },
        { basePath: '/imagenes/salvapantallas7', name: 'Rick_and_Morty_Screen7' },
        { basePath: '/imagenes/salvapantallas8', name: 'Rick_and_Morty_Screen8' },
        { basePath: '/imagenes/salvapantallas9', name: 'Rick_and_Morty_Screen9' },
    ];

    const formats = ['.jpg', '.png', '.jpeg', '.gif'];
    const screensaversGrid = document.querySelector('.screensavers-grid');

    for (const screensaver of screensavers) {
        try {
            const imageUrl = await checkImageFormats(screensaver.basePath, formats);
            const screensaverElement = document.createRange().createContextualFragment(/*html*/ `
                <div class="screensaver">
                    <img src="${imageUrl}" alt="${screensaver.name}">
                    <button onclick="openDownloadModal('${imageUrl}', '${screensaver.name}')">
                        <i class="fas fa-download"></i> Descargar
                    </button>
                </div>
            `);
            screensaversGrid.appendChild(screensaverElement);
        } catch (error) {
            console.error(`Failed to load image for ${screensaver.name}:`, error);
        }
    }
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
