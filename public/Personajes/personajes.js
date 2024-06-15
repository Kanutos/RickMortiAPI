document.addEventListener('DOMContentLoaded', () => {
    const characters = document.querySelectorAll('.character');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    characters.forEach(character => {
        observer.observe(character);
    });
});
