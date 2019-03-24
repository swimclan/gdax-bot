require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const botstart = require('./src/runtime');
const db = require('./src/db');
const getModel = require('./src/models');
const getState = require('./src/state');
const app = express();
const HistoryModel = getModel('history', db);
const ErrorModel = getModel('error', db);
const config = require('./src/config');

app.use('/static', express.static(path.join(__dirname, './src/public')))
app.use('/', (req, res, next) => {
  const reqUrl = req.originalUrl;
  if (reqUrl.match(/(woff2?|ttf)/)) {
    res.redirect(`/static/assets/fonts${reqUrl}`);
  } else {
    next();
  }
});
// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/src/views'));

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

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/api/history', (req, res) => {
  HistoryModel.findAll().then((data) => {
    res.json(data);
  });
});

app.get('/api/history/fills', (req, res) => {
  HistoryModel.findAll({where: {action: 'fill'}, order: '"updatedAt" ASC'}).then((data) => {
    res.json(data);
  });
});

app.get('/api/error', (req, res) => {
  ErrorModel.findAll().then((data) => {
    res.json(data);
  });
});

app.get('/api/state', (req, res) => {
  res.json(state);
});

app.patch('/api/state', (req, res) => {
  Object.entries(req.body).forEach(([property, value]) => {
    state.set(property, value);
  });
  res.json(state);
});

const port = process.env.NODE_PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));


