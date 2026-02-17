const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const {votePoll} = require('../controllers/pollController');
const {
    createPoll,
    getPoll
} = require('../controllers/pollController');

// Rate limiter: max 5 votes per IP per 15 minutes
const voteRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: { message: 'Too many vote attempts. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/', createPoll);
router.get('/:roomId', getPoll);
router.post('/:roomId/vote', voteRateLimiter, votePoll);
module.exports = router;
