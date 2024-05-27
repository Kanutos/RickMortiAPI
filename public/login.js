document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            alert('Inicio de sesión exitoso');
            // Guardar el token en localStorage 
            localStorage.setItem('token', data.token);
            window.location.href = 'index.html';
        } else {
            const errorText = await response.text();
            alert('Error: ' + errorText);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});
