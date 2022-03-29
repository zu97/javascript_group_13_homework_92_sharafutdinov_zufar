const express = require('express');
const expressWs = require('express-ws');
const cors = require('cors');
const mongoose = require('mongoose');

const config = require('./config');
const users = require('./app/users');
const chat = require('./app/chat');

const app = express();
const port = 8000;

expressWs(app);

app.use(cors());
app.use(express.json());
app.use('/users', users);
app.ws('/chat', chat);

const run = async () => {
    await mongoose.connect(config.mongo.url, config.mongo.options);

    app.listen(port, () => {
        console.log(`Server started on ${port} port`);
    });

    process.on('exit', () => {
       mongoose.disconnect();
    });
};

run().catch((e) => console.log(e));