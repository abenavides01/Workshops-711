async function fetchTeachers() {
    const response = await fetch("http://localhost:3001/teachers"); // Ajusta la URL según tu servidor
    const teachers = await response.json();
    console.log('Teachers:', teachers);

    if (teachers) {
        const tableBody = document.getElementById('teacherList');
        tableBody.innerHTML = ''; // Limpia la tabla antes de agregar nuevos datos

        teachers.forEach(teacher => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${teacher.first_name}</td>
                <td>${teacher.last_name}</td>
                <td>${teacher.cedula}</td>
                <td>${teacher.age}</td>
                <td>
                    <button class="btn btn-warning btn-sm edit_button" id="${teacher._id}">Edit</button>
                    <button class="btn btn-danger btn-sm delete_button" id="${teacher._id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        assignEditEvents(); // Agrega eventos a los botones de edición
        assignDeleteEvents(); // Agrega eventos a los botones de eliminación
    }
}

// Evento para editar profesores
function assignEditEvents() {
    document.querySelectorAll('.edit_button').forEach(button => {
        button.addEventListener('click', (e) => {
            alert(`Edit teacher with ID: ${e.target.id}`);
        });
    });
}

// Evento para eliminar profesores
function assignDeleteEvents() {
    document.querySelectorAll('.delete_button').forEach(button => {
        button.addEventListener('click', async (e) => {
            const id = e.target.id;
            if (confirm('Are you sure you want to delete this teacher?')) {
                await fetch(`http://localhost:3001/teachers/${id}`, { method: 'DELETE' });
                fetchTeachers(); // Recarga la lista de profesores
            }
        });
    });
}

// Función para crear un nuevo profesor
async function createTeacher() {
    const teacher = {
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        cedula: document.getElementById('cedula').value,
        age: document.getElementById('age').value
    };

    const response = await fetch("http://localhost:3001/teachers", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacher)
    });

    if (response.ok) {
        alert('Teacher saved successfully!');
        fetchTeachers(); // Refresca la lista después de guardar
    } else {
        alert('Error saving teacher.');
    }
}
