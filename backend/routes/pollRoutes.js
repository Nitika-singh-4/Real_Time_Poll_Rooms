const express = require('express');
const router = express.Router();
const {votePoll} = require('../controllers/pollController');
const {
    createPoll,
    getPoll
} = require('../controllers/pollController');
router.post('/', createPoll);
router.get('/:roomId', getPoll);
router.post('/:roomId/vote', votePoll);
module.exports = router;
