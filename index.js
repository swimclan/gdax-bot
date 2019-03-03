require('dotenv').config();
const express = require('express');
var bodyParser = require('body-parser')
const botstart = require('./src/runtime');
const db = require('./src/db');
const getModel = require('./src/models');

const app = express();
const HistoryModel = getModel('history', db);
const ErrorModel = getModel('error', db);
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
  HistoryModel.findAll().then((data) => {
    res.json(data);
  });
});

app.get('/fills', (req, res) => {
  HistoryModel.find({where: {action: 'filled'}}).then((data) => {
    res.json(data);
  });
});

app.get('/error', (req, res) => {
  ErrorModel.findAll().then((data) => {
    res.json(data);
  });
});

const port = process.env.NODE_PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));


