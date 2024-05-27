document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        if (response.ok) {
            alert('Usuario registrado exitosamente');
            window.location.href = 'login.html';
        } else {
            const errorText = await response.text();
            alert('Error: ' + errorText);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});
