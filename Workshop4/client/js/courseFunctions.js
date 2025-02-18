// Fetch all courses
function fetchCourses() {
    fetch("http://localhost:3001/courses")
        .then(response => response.json())
        .then(courses => {
            const table = document.getElementById("courseList");
            table.innerHTML = ""; // Clear existing table rows
            courses.forEach(course => {
                table.innerHTML += `
                    <tr>
                        <td>${course.name}</td>
                        <td>${course.credits}</td>
                        <td>${course.teacher ? course.teacher.name : "No teacher assigned"}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editCourse('${course._id}', '${course.name}', ${course.credits}, '${course.teacher ? course.teacher._id : ""}')">Edit</button>
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
    event.preventDefault(); // Prevent page refresh
    const id = document.getElementById("courseId").value;
    const courseData = {
        name: document.getElementById("courseName").value,
        credits: document.getElementById("credits").value,
        teacher: document.getElementById("teacherSelect").value
    };

    // If an ID exists, it's an update
    if (id) {
        fetch(`http://localhost:3001/courses?id=${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(courseData)
        }).then(fetchCourses);
    } else {
        // If no ID, it's a new course
        fetch("http://localhost:3001/courses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(courseData)
        }).then(fetchCourses);
    }
    event.target.reset(); // Reset form fields
}

// Edit course
function editCourse(id, name, credits, teacherId) {
    document.getElementById("courseId").value = id;
    document.getElementById("courseName").value = name;
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
