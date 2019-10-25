const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose
    .connect('mongodb://localhost/heyy', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => console.log(`mongodb connected.`))
    .catch((err) => console.log(err));

// creating app
const app = express();

// middlewares
app.use(bodyParser.json());

// Creation v1 routes base endpoint
app.use('/api/v1', require("./routes"));

// listing app on port
port = 3000;
app.listen(port, () => console.log(`app listining on port ${port}`));