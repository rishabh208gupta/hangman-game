require('dotenv').config();
const express = require('express');
const connectDb = require('./config/database');
const cookieParser = require("cookie-parser");
const wordList = require('./utils/wordList')
const WordList = require('./models/wordList');
const app = express();

const authRouter = require('./routes/auth');
const gameRouter = require('./routes/game');
const statsRouter = require('./routes/stats');

app.use(express.json());
app.use(cookieParser());

app.use(authRouter);
app.use(gameRouter);
app.use(statsRouter);

async function initServer() {
    await connectDb();
    console.log("Connected to db successfully");
    await initializeWordList();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
}


async function initializeWordList() {
    const wordsToSave = wordList.map(word => word.toLowerCase());
    try {
        const existingWordList = await WordList.findOne();
        if(existingWordList) {
            console.log("Word list already present, updating it");
            const newWords = wordsToSave.filter(word => !existingWordList.words.includes(word));
            if(newWords.length > 0) {
                existingWordList.words.push(...newWords);
            } else {
                console.log("No new words to add to the word list");
            }
            await existingWordList.save();
            console.log("Word list updated");
            return;
        }
        const newWordList = new WordList({words: wordsToSave});
        await newWordList.save();
        console.log("Word list initialized");
    } catch (error) {
        console.log("Error initializing word list", error);
    }
}

initServer().then(() => {
    console.log("Server initialized successfully");
}).catch((error) => {
    console.log("Error initializing server", error);
});