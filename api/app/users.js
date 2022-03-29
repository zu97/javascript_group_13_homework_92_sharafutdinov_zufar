const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');

const router = express.Router();

router.post('/', async (req, res, next) => {
    try {
        const userData = {
            email: req.body.email,
            password: req.body.password,
            displayName: req.body.displayName,
        };

        const user = new User(userData)

        user.generateToken();
        await user.save();

        res.send(user);
    } catch (e) {
        if (e instanceof mongoose.Error.ValidationError) {
            return res.status(400).send(e);
        }

        next(e);
    }
});

router.post('/sessions', async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).send({ error: 'Invalid email or password' });
        }

        const isMatch = await user.checkPassword(req.body.password);
        if (!isMatch) {
            return res.status(400).send({ error: 'Invalid email or password' });
        }

        user.generateToken();
        await user.save();

        res.send(user);
    } catch(e) {
        if (e instanceof mongoose.Error.ValidationError) {
            return res.status(400).send(e);
        }

        next(e);
    }
});

router.delete('/sessions', async (req, res, next) => {
    try {
        const token = req.get('Authorization');
        const message = { message: 'ok' };

        if (!token) {
            return res.send(message);
        }

        const user = await User.findOne({ token });
        if (!user) {
            return res.send(message);
        }

        user.generateToken();
        await user.save();

        res.send(message);
    } catch(e) {
        next(e);
    }
})

module.exports = router;