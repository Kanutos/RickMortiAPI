/*Funcion para cargar el navbar en los htmls*/
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
        });
});

