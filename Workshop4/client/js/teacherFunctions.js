
/*
 * Obtener profesores
 */
function fetchTeachers() {
    fetch("http://localhost:3001/teachers") // Hace un GET al localhost
        .then(response => response.json()) // Convierte la respuesta a JSON
        .then(data => {
            const table = document.getElementById("teacherList");
            table.innerHTML = ""; // Limpia la tabla existente
            data.forEach(teacher => {
                // Agrega una nueva fila a la tabla
                table.innerHTML += `
                    <tr>
                        <td>${teacher.first_name}</td>
                        <td>${teacher.last_name}</td>
                        <td>${teacher.cedula}</td>
                        <td>${teacher.age}</td>
                        <td>${teacher.course}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editTeacher('${teacher._id}', '${teacher.first_name}', '${teacher.last_name}', '${teacher.cedula}', ${teacher.age}, '${teacher.course}')">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteTeacher('${teacher._id}')">Delete</button>
                        </td>
                    </tr>`;
            });
        })
        .catch(error => console.error("Error fetching teachers:", error));
}

/*
 * Manejo del formulario
 */
function handleFormSubmit(event) {
    event.preventDefault(); // Previene que se recargue la página
    const id = document.getElementById("teacherId").value; // Obtiene el id
    const teacherData = {
        first_name: document.getElementById("firstName").value,
        last_name: document.getElementById("lastName").value,
        cedula: document.getElementById("cedula").value,
        age: document.getElementById("age").value,
        course: document.getElementById("course").value
    };

    // Si el formulario tiene un ID, se hace un PUT
    if (id) {
        fetch(`http://localhost:3001/teachers?id=${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(teacherData)
        })
        .then(fetchTeachers);
    } 
    // Si no tiene ID, es un nuevo profesor, se hace un POST
    else {
        fetch("http://localhost:3001/teachers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(teacherData)
        })
        .then(fetchTeachers); // Vuelve a cargar la lista de profesores
    }
    event.target.reset(); // Limpia el formulario luego de guardar los cambios
}

/*
 * Editar profesor
 * Es llamado con el botón 'Edit'
 */
function editTeacher(id, firstName, lastName, cedula, age, course) {
    // Obtiene los datos por medio del ID y los actualiza
    document.getElementById("teacherId").value = id;
    document.getElementById("firstName").value = firstName;
    document.getElementById("lastName").value = lastName;
    document.getElementById("cedula").value = cedula;
    document.getElementById("age").value = age;
    document.getElementById("course").value = course;
}

/*
 * Eliminar profesor
 */
function deleteTeacher(id) {
    // Muestra mensaje de confirmación para eliminar los datos, si se confirma, se elimina el ID especificado
    if (confirm("Are you sure you want to delete this teacher?")) {
        fetch(`http://localhost:3001/teachers?id=${id}`, { method: "DELETE" })
            .then(fetchTeachers); // Actualiza la lista de profesores
    }
}
