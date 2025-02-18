// Fetch all courses
function fetchCourses() {
    fetch("http://localhost:3001/courses")
        .then(response => response.json())
        .then(courses => {
            const table = document.getElementById("courseList");
            table.innerHTML = ""; // Clear existing table rows
            courses.forEach(course => {
                // Verifica si el campo teacher está correctamente poblado
                const teacherName = course.teacher ? `${course.teacher.first_name} ${course.teacher.last_name}` : "No teacher assigned";
                const teacherId = course.teacher ? course.teacher._id : "";

                table.innerHTML += `
                    <tr>
                        <td>${course.name}</td>
                        <td>${course.credits}</td>
                        <td>${teacherName}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editCourse('${course._id}', '${course.name}', ${course.credits}, '${teacherId}')">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteCourse('${course._id}')">Delete</button>
                        </td>
                    </tr>`;
            });
        })
        .catch(err => {
            console.error("Error fetching courses:", err);
        });
}

// Fetch all teachers
function fetchTeachers() {
    fetch("http://localhost:3001/teachers")
        .then(response => response.json())
        .then(teachers => {
            const teacherSelect = document.getElementById("teacherSelect");
            teachers.forEach(teacher => {
                teacherSelect.innerHTML += `<option value="${teacher._id}">${teacher.first_name} ${teacher.last_name}</option>`;
            });
        })
        .catch(err => {
            console.error("Error fetching teachers:", err);
        });
}

// Handle form submission for creating/updating courses
function handleFormSubmit(event) {
    event.preventDefault();

    const courseData = {
        name: document.getElementById("course").value,
        credits: document.getElementById("credits").value,
        teacher: document.getElementById("teacherSelect").value // Aquí es donde se obtiene el ID del profesor
    };

    // Si hay un ID, entonces es una actualización, si no es un curso nuevo
    const courseId = document.getElementById("courseId").value;

    if (courseId) {
        // PUT para actualizar el curso
        fetch(`http://localhost:3001/courses/${courseId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(courseData)
        }).then(fetchCourses);
    } else {
        // POST para crear un nuevo curso
        fetch("http://localhost:3001/courses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(courseData)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Course created:', data);
                fetchCourses(); // Refresh course list
            })
            .catch(err => {
                console.error("Error creating course:", err);
            });

        event.target.reset();
    }
}


    // Edit course
    function editCourse(id, name, credits, teacherId) {
        document.getElementById("courseId").value = id;
        document.getElementById("name").value = name;
        document.getElementById("credits").value = credits;
        document.getElementById("teacherSelect").value = teacherId;
    }

    // Delete course
    function deleteCourse(id) {
        if (confirm("Are you sure you want to delete this course?")) {
            fetch(`http://localhost:3001/courses?id=${id}`, { method: "DELETE" })
                .then(fetchCourses); // Refresh the course list
        }
    }

    // Attach event listener for form submission
    document.getElementById("courseForm").addEventListener("submit", handleFormSubmit);

    // Call the functions on page load
    document.addEventListener("DOMContentLoaded", () => {
        fetchCourses(); // Fetch courses and teachers when the page loads
        fetchTeachers(); // Fetch teachers to populate the course form
    });
