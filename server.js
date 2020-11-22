const express = require('express');
const path = require('path');
const app = express();
const port = 5000;

app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', (req, res) => {
  return res.send('pong')
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

app.listen(5000);