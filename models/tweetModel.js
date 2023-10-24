const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
    content: {
        type: String,
        trim: true,
        max: 280,
        required: [true, 'content of tweet is required']
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },

    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
        }
    ],

    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: [Number],

    },

    formattedAddress: String,



}, { timestamps: true })
tweetSchema.post('save', (document) => {
    document.location = undefined;
})
module.exports = mongoose.model("Tweet", tweetSchema)