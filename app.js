const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello from my demo Node.js app!');
});

app.get('/info', (req, res) => {
  res.json({
    app: 'Demo Node.js Application',
    version: '1.0.0',
    author: 'Stark',
    description: 'A simple demo app for Jenkins pipeline with Docker'
  });
});

app.listen(port, () => {
  console.log(`Demo app listening at http://localhost:${port}`);
});
