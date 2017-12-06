const express = require('express');
const routes = require('./routes');
const bodyParser = require('body-parser');
const { RequestLogger } = require('./helpers');

const app = express();

app.use((req, res, next) => {
  console.log('TEST');

  next();
});

app.use(bodyParser.json());

app.use(RequestLogger);

app.use(routes);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App started at: localhost:${port}`));
