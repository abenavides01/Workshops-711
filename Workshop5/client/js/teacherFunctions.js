
/*
 * Obtener profesores
 */
function fetchTeachers() {
    const authKey = sessionStorage.getItem('token'); // Obtener el token

    fetch("http://localhost:3001/teachers", {
        method: "GET",
        headers: {
            "Authorization": `Basic ${authKey}`, // Agregar autenticación
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        const table = document.getElementById("teacherList");
        table.innerHTML = ""; // Limpia la tabla existente
        data.forEach(teacher => {
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
    event.preventDefault();
    const id = document.getElementById("teacherId").value;
    const teacherData = {
        first_name: document.getElementById("firstName").value,
        last_name: document.getElementById("lastName").value,
        cedula: document.getElementById("cedula").value,
        age: document.getElementById("age").value,
        course: document.getElementById("course").value
    };

    const authKey = sessionStorage.getItem('token'); 
    if (!authKey) {
        alert("No estás autenticado. Inicia sesión primero.");
        return;
    }

    const url = id ? `http://localhost:3001/teachers?id=${id}` : "http://localhost:3001/teachers";
    const method = id ? "PUT" : "POST";

    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${authKey}`
        },
        body: JSON.stringify(teacherData)
    })
    .then(fetchTeachers);
    
    event.target.reset();
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
    const authKey = sessionStorage.getItem('token'); 
    if (!authKey) {
        alert("No estás autenticado. Inicia sesión primero.");
        return;
    }

    if (confirm("Are you sure you want to delete this teacher?")) {
        fetch(`http://localhost:3001/teachers?id=${id}`, { 
            method: "DELETE",
            headers: { "Authorization": `Basic ${authKey}` } // Agregar autenticación
        })
        .then(fetchTeachers);
    }
}
