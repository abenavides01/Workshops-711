async function login() {
    const user = document.getElementById('user').value;
    const password = document.getElementById('password').value;
    const auth = btoa(`${user}:${password}`); // Codificar las credenciales en base64

    const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        sessionStorage.setItem('token', auth);  // Guardar el token en el sessionStorage
        alert('Login exitoso');
        window.location.href = "/teacher.html";  // Redirigir al dashboard o página protegida
    } else {
        alert('Credenciales inválidas');
    }
}
