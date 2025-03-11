const express = require('express');
const app = express();
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/teachers");

const bodyParser = require("body-parser");
app.use(bodyParser.json());
const cors = require("cors");
const atob = (str) => Buffer.from(str, 'base64').toString('utf-8');

const { teacherCreate, teacherGet, teacherUpdate, teacherDelete } = require('./controllers/teacherController');
const { coursePost, courseGet, courseUpdate, courseDelete } = require('./controllers/courseController');

app.use(cors({ domains: '*', methods: "*" }));

// Ruta de autenticación
app.post('/auth/login', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const authBase64 = authHeader.split(' ')[1];
    const userPass = Buffer.from(authBase64, 'base64').toString('utf8');
    const [user, password] = userPass.split(':');

    if (user === 'admin' && password === '1234') {
        return res.status(200).json({ message: "Login successful" });
    }

    res.status(401).json({ error: "Invalid credentials" });
});

// Middleware de autenticación
app.use((req, res, next) => {
  if (req.headers["authorization"]) {
    const authBase64 = req.headers['authorization'].split(' ')[1];
    const userPass = atob(authBase64);
    const [user, password] = userPass.split(':');

    if (user === 'admin' && password === '1234') {
      next();
      return;
    }
  }
  res.status(401).json({ error: "Unauthorized" });
});

// Rutas para los profesores
app.post('/teachers', teacherCreate);
app.get("/teachers", teacherGet);
app.put("/teachers", teacherUpdate);
app.delete("/teachers", teacherDelete);

// Rutas para los cursos
app.post('/courses', coursePost);
app.get('/courses', courseGet);
app.put('/courses/:id', courseUpdate);
app.delete('/courses', courseDelete);

app.listen(3001, () => console.log(`Server running on port 3001`));
