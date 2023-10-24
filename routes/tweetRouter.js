const express = require('express');
const router = express.Router();

const { createTweet, likeOrDislikeTweet } = require("../controllers/tweetController")
const { protect } = require("../controllers/authController")


router.route('/').post(protect, createTweet)
router.route('/:id/like').put(protect, likeOrDislikeTweet)

module.exports = router