const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
    content: {
        type: String
    },
    image: {
        type: String
    },
    
} ,{timestamps:ture})

module.exports = mongoose.model("Tweet",tweetSchema)