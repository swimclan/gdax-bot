require('dotenv').config();
const express = require('express');
var bodyParser = require('body-parser')
const botstart = require('./src/runtime');
const db = require('./src/db');
const getModel = require('./src/models');

const app = express();
const History = getModel('history', db);
botstart();

db
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

app.get('/history', (req, res) => {
  History.findAll().then((data) => {
    res.json(data);
  });
});

app.listen(3000, () => console.log('Server started on port 3000'));


