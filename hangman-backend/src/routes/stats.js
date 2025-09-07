const express = require('express');
const statsRouter = express.Router();
const authMiddleware = require('../middlewares/auth');
const User = require('../models/user');
const Game = require('../models/game');

statsRouter.get('/stats/:userId', authMiddleware, async (req, res) => {
    try {
        const userId = req.params?.userId;
        const user = await User.findById(userId);

        if(!user) res.status(404).send({error: "User not found"});

        const [topScores, totalGames] = await Promise.all([
            Game.find({ userId: userId })
            .sort({ score: -1 }) 
            .limit(5) ,
            Game.countDocuments({ userId: userId })]
        );
        res.send({topScores, totalGames});
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).send({error: "Something went wrong"});
    }
});

statsRouter.get('/leaderboard', async (req, res) => {
    try {
        const leaderboard = await Game.find({})
        .sort({ score: -1 })          
        .limit(5)                     
        .populate('userId', 'email') 
        .select('score userId'); 
        res.send(leaderboard);
    }
    catch(error) {
        return res.status(500).send({error: "Something went wrong"});
    }
});

module.exports = statsRouter;