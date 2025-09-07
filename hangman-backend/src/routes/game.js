const express = require('express');
const Game = require('../models/game');
const authMiddleware = require('../middlewares/auth');
const WordList = require('../models/wordList');
const { gameValidation } = require('../utils/validation');
const game = require('../models/game');

const gameRouter = express.Router();

async function getWordList() {
    const wordList = await WordList.findOne();
    if(!wordList) throw new Error("Word list not initialized");
    if(wordList.words.length === 0) throw new Error("Word list is empty");
    return wordList;
}

gameRouter.get('/new-game', authMiddleware, async (req, res) => {
    try {
        const wordList = await getWordList();
        const randomWord = wordList.getRandomWord();
        const game = new Game({
            userId: req.user.id,
            currentWord: randomWord
        })
        await game.save();
        res.send(game);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({error: "Something went wrong"});
    }
});

gameRouter.post('/next-word', authMiddleware, async (req, res) => {
    try {
        gameValidation(req);
        const { _id, wordsGuessed } = req.body;

        const game = await Game.findById(_id);
        if(!game) return res.status(404).send({error: "Game not found"});

        const wordList = await getWordList();

        const availableWords = wordList.words.filter(word => !wordsGuessed.includes(word));
        if(availableWords.length === 0) {
            return res.status(400).send({error: "No more new words available"});
        }
        const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        res.send({nextWord: randomWord});
    }
    catch (error) {
        return res.status(500).send({error: "Something went wrong"});
    }       
});

gameRouter.post('/end-game', authMiddleware, async (req, res) => {
    gameValidation(req);
    const { _id, attemptsLeft, timeRemaining } = req.body;
    const game = await Game.findById(_id);
    if(!game) return res.status(404).send({error: "Game not found"});

    if (game.attemptsLeft === 0 || game.timeRemaining === 0) {
        return res.status(400).send({error: "Game has already ended"});
    }
    
    if (attemptsLeft > 0 && timeRemaining > 0) {
        return res.status(400).send({error: "Game is still ongoing"});
    }
    Object.assign(game, req.body)
    await game.save();
    res.send({message: "Game ended successfully"});
});



module.exports = gameRouter;