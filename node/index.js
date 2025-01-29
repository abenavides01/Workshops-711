require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/test';
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
