const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'build')));

app.post('/signup', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  console.log(email);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
});

app.listen(3000);