const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.route('/')
.post(async (req, res) => {
    try {
        const { username } = req.body;
        const newUser = new User({ username });
        await newUser.save();
        res.json({ username: newUser.username, _id: newUser._id });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
})
.get(async (req, res) => {
    try {
        const users = await User.find({}, { log: 0 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

router.post('/:_id/exercises', async (req, res) => {
    try {
        const { _id } = req.params;
        const { description, duration, date } = req.body;
        const exerciseDate = date ? new Date(date) : new Date();

        const user = await User.findById(_id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const exercise = { description, duration: parseInt(duration), date: exerciseDate };
        user.log.push(exercise);
        await user.save();

        res.json({
            _id: user._id,
            username: user.username,
            description: exercise.description,
            duration: exercise.duration,
            date: exercise.date.toDateString(),
        });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

router.get('/:_id/logs', async (req, res) => {
    try {
        const { _id } = req.params;
        const { from, to, limit } = req.query;

        const user = await User.findById(_id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        let log = user.log;

        if (from) log = log.filter(e => new Date(e.date) >= new Date(from));
        if (to) log = log.filter(e => new Date(e.date) <= new Date(to));

        if (limit) log = log.slice(0, parseInt(limit));

        log = log.map(({ description, duration, date }) => ({
            description,
            duration,
            date: new Date(date).toDateString(),
        }));

        res.json({
            _id: user._id,
            username: user.username,
            count: log.length,
            log,
        });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
