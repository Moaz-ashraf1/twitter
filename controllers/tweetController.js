const asyncHandler = require("express-async-handler");
const NodeGeocoder = require('node-geocoder');

const Tweet = require("../models/tweetModel");
const AppError = require("../utils/appError");

exports.createTweet = asyncHandler(async (req, res, next) => {
    const latitude = req.body.location.coordinates[0];
    const longitude = req.body.location.coordinates[1];

    const tweet = await Tweet.create({
        content: req.body.content,
        location: req.body.location,
        author: req.currentUser.id,
    })

    const geocoder = NodeGeocoder({
        provider: 'mapbox',
        apiKey: 'pk.eyJ1IjoibW9hemFzaHJhZiIsImEiOiJjbGtzOWg3azcwMTI4M2RwbjFrOGVmZXV0In0.rCbQNfmfZQ2pGrgHK3JGXw',
    });

    geocoder.reverse({ lat: latitude, lon: longitude })
        .then(async (result) => {
            console.log(result);
            const formattedAddress = await result[0].country + ',' + result[0].state;
            tweet.formattedAddress = formattedAddress;
            tweet.save();

            res.status(201).json({
                tweet
            })
        })
        .catch((err) => {
            res.status(500).json({ error: 'Error in reverse geocoding' });
        });




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