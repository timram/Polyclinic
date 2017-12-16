const express = require('express');
const routes = require('./api/routes');
const bodyParser = require('body-parser');
const { RequestLogger } = require('./api/helpers');

const app = express();

app.use(bodyParser.json());

app.use(RequestLogger);

app.use(routes);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App started at: localhost:${port}`));
