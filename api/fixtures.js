const mongoose = require('mongoose');
const config = require('./config');

const User = require('./models/User');
const Message = require('./models/Message');
const {nanoid} = require("nanoid");

const run = async () => {
    await mongoose.connect(config.mongo.url, config.mongo.options);

    const collections = await mongoose.connection.db.listCollections().toArray();
    for (let coll of collections) {
        await mongoose.connection.db.dropCollection(coll.name);
    }

    const [anna, john] = await User.create({
        email: 'anna@gmail.com',
        password: '123',
        displayName: 'Anna',
        token: nanoid()
    }, {
        email: 'john@gmail.com',
        password: '123',
        displayName: 'John',
        token: nanoid()
    });

    await Message.create({
        user: john,
        message: 'Привет'
    }, {
        user: anna,
        message: 'Привет'
    }, {
        user: john,
        message: 'Как дела?'
    }, {
        user: anna,
        message: 'Нормально, как твои дела?'
    }, {
        user: john,
        message: 'Пойдет...'
    }, {
        user: anna,
        message: 'Что делаешь?'
    }, {
        user: john,
        message: 'Да так...ничего особенного, а ты?'
    }, {
        user: anna,
        message: 'Гуляю'
    }, {
        user: john,
        message: 'Ты где сейчас?'
    });

    await mongoose.connection.close();
};
run().catch((e) => console.error(e));