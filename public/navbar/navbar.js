document.addEventListener('DOMContentLoaded', () => {
    fetch('/navbar/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-container').innerHTML = data;
            const currentPath = window.location.pathname;
            const navLinks = document.querySelectorAll('.navbar a');

            navLinks.forEach(link => {
                if (link.getAttribute('href') === currentPath) {
                    link.classList.add('active');
                }
            });

            initializeDropdown();
        });
});

function initializeDropdown() {
    const seasonLinks = document.querySelectorAll('.dropdown-content a');
    seasonLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const season = event.target.dataset.season;
            window.location.href = `/Episodios/episodios.html?season=${season}`;
        });
    });
}
