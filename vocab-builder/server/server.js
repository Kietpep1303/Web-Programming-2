const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
global.Vocab = require('./api/models/vocabModel');
const routes = require('./api/routes/vocabRoutes');

// Connect to a MongoDB database.
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/vocab-builder', 
{ useNewUrlParser: true });

// Set the server port to 3000.
const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Registers the application's routes, associating them with the Express app.
routes(app);
app.listen(port);
app.use((req, res) => {
  // If any requests that do not match any defined route, returning a 404 error with a message.
  res.status(404).send({ url: `${req.originalUrl} not found` });
});

console.log(`Server started on port ${port}`);