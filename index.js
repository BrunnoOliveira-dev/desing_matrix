const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const router = require('./server/router/router.js');


app.use(express.json())
app.use(express.static(path.join(__dirname, 'client/src')));

app.use(router);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

