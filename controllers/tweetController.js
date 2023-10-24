const asyncHandler = require("express-async-handler");
const Tweet = require("../models/tweetModel");
const AppError = require("../utils/appError");

exports.createTweet = asyncHandler(async (req, res, next) => {
    const tweet = await Tweet.create({
        content: req.body.content,
        author: req.currentUser.id,
    })

    res.status(201).json({
        tweet
    })
});

exports.likeOrDislikeTweet = asyncHandler(async (req, res, next) => {
    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) return next(new AppError('this tweet is not available', 404));

    const userIndex = tweet.likes.indexOf(req.currentUser.id);

    if (userIndex !== -1) {
        tweet.likes.splice(userIndex, 1);
    } else {

        tweet.likes.push(req.currentUser.id);
    }


    await tweet.save()

    res.status(200).json({ tweet });

})