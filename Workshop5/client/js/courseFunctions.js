// Fetch all courses
function fetchCourses() {
    const authKey = sessionStorage.getItem('token'); 

    fetch("http://localhost:3001/courses", {
        method: "GET",
        headers: {
            "Authorization": `Basic ${authKey}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(courses => {
        const table = document.getElementById("courseList");
        table.innerHTML = "";
        courses.forEach(course => {
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
    .catch(err => console.error("Error fetching courses:", err));
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
        teacher: document.getElementById("teacherSelect").value
    };

    const courseId = document.getElementById("courseId").value;
    const authKey = sessionStorage.getItem('token'); 
    if (!authKey) {
        alert("No estás autenticado. Inicia sesión primero.");
        return;
    }

    const url = courseId ? `http://localhost:3001/courses/${courseId}` : "http://localhost:3001/courses";
    const method = courseId ? "PUT" : "POST";

    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${authKey}`
        },
        body: JSON.stringify(courseData)
    })
    .then(fetchCourses);

    event.target.reset();
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
        const authKey = sessionStorage.getItem('token'); 
        if (!authKey) {
            alert("No estás autenticado. Inicia sesión primero.");
            return;
        }
    
        if (confirm("Are you sure you want to delete this course?")) {
            fetch(`http://localhost:3001/courses?id=${id}`, { 
                method: "DELETE",
                headers: { "Authorization": `Basic ${authKey}` } 
            })
            .then(fetchCourses);
        }
    }

    // Attach event listener for form submission
    document.getElementById("courseForm").addEventListener("submit", handleFormSubmit);

    // Call the functions on page load
    document.addEventListener("DOMContentLoaded", () => {
        fetchCourses(); // Fetch courses and teachers when the page loads
        fetchTeachers(); // Fetch teachers to populate the course form
    });
