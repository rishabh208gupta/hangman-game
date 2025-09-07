const mongoose = require('mongoose');

const wordListSchema = new mongoose.Schema({
    words : {
        type : [String],
        required: true,
        default: []
    }
},
{
    timestamps: false
});

wordListSchema.methods.getRandomWord = function () {
    const words = this.words;
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

module.exports = mongoose.model('WordList', wordListSchema);