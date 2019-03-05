require('dotenv').config();
const express = require('express');
var bodyParser = require('body-parser');
const botstart = require('./src/runtime');
const db = require('./src/db');
const getModel = require('./src/models');
const getState = require('./src/state');
const app = express();
const HistoryModel = getModel('history', db);
const ErrorModel = getModel('error', db);
const config = require('./src/config');

const state = getState(config);
botstart(state);

db
.authenticate()
.then(() => {
  console.log('Connection has been established successfully.');
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});

app.use(bodyParser.json());

app.get('/history', (req, res) => {
  HistoryModel.findAll().then((data) => {
    res.json(data);
  });
});

app.get('/history/fills', (req, res) => {
  HistoryModel.findAll({where: {action: 'filled'}}).then((data) => {
    res.json(data);
  });
});

app.get('/error', (req, res) => {
  ErrorModel.findAll().then((data) => {
    res.json(data);
  });
});

app.get('/state', (req, res) => {
  res.json(state);
});

app.patch('/state', (req, res) => {
  Object.entries(req.body).forEach(([property, value]) => {
    state.set(property, value);
  });
  res.json(state);
});

const port = process.env.NODE_PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));


