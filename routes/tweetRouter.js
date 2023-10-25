const express = require('express');
const router = express.Router();

const { createTweet, likeOrDislikeTweet, getAllTweets, getTweet, updateTweet, deleteTweet } = require("../controllers/tweetController")
const { protect } = require("../controllers/authController")


router.route('/').post(protect, createTweet).get(protect, getAllTweets)
router.route('/:id').get(protect, getTweet).put(protect, updateTweet).delete(protect, deleteTweet)
router.route('/:id/like').put(protect, likeOrDislikeTweet)

module.exports = router