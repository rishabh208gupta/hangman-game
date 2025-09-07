const mongoose = require('mongoose');
const validator = require('validator');
const user = require('./user');

const gameSchema = new mongoose.Schema({
    currentWord : {
        type : String,
        required: true,
        trim: true,
        lowercase: true,
    },
    lettersGuessed : {
        type : [Number],
        default: () => Array(26).fill(0),
        required: true
    },
    attemptsLeft : {
        type : Number,
        required: true,
        default: 6,
        min: 0
    },
    wordsGuessed : {
        type : [String],
        default: [],
        required: true
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }, 
    timeRemaining : {
        type : Number,
        required: true,
        default: 180,
        min: 0
    },
    score : {
        type : Number,
        required: true,
        min: 0,
        default: 0
    }
},
{
    timestamps: true
});

gameSchema.pre('save', function(next) {
    if (this.attemptsLeft == 0) this.score = this.wordsGuessed.length;
    else this.score = this.attemptsLeft * this.wordsGuessed.length;
    next();
});

gameSchema.index({score: -1});

module.exports = mongoose.model('Game', gameSchema);