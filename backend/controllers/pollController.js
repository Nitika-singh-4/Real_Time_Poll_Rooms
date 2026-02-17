const Poll  = require('../models/poll.js');
const {v4: uuidv4} = require('uuid');

exports.createPoll = async (req, res) => {
    try {
        const {question, options} = req.body;
        
        console.log('[CREATE POLL] Request received:', { question, options });
        
        if(!question || !options || options.length < 2){
            console.error('[CREATE POLL] Validation failed: Missing question or insufficient options');
            return res.status(400).json({message: "Question and at least 2 options are required"});
        }
        
        const formattedOptions = options.map(opt => ({
            text: opt,
            votes: 0
        }));
        
        const newPoll = new Poll({
            roomId: uuidv4(),
            question,
            options: formattedOptions
        });
        
        await newPoll.save();
        console.log('[CREATE POLL] Poll created successfully:', newPoll.roomId);
        res.status(201).json({message: "Poll created successfully", roomId: newPoll.roomId});
    } catch (error) {
        console.error('[CREATE POLL] Error:', error.message);
        console.error('[CREATE POLL] Stack trace:', error.stack);
        res.status(500).json({message: "Server error", error: error.message});
    }
};

exports.getPoll = async (req, res) => {
    try {
        const {roomId} = req.params;
        console.log('[GET POLL] Fetching poll:', roomId);
        
        const poll = await Poll.findOne({roomId});
        if(!poll){
            console.error('[GET POLL] Poll not found:', roomId);
            return res.status(404).json({message: "Poll not found"});
        }
        
        console.log('[GET POLL] Poll found successfully:', roomId);
        res.status(200).json(poll); 
    } catch (error) {
        console.error('[GET POLL] Error:', error.message);
        console.error('[GET POLL] Stack trace:', error.stack);
        res.status(500).json({message: "Server error", error: error.message});
    }
};

exports.votePoll = async (req, res) => {
    try{
        const {roomId} = req.params;
        const {optionIndex, fingerprint} = req.body;
        
        console.log('[VOTE POLL] Vote attempt:', { roomId, optionIndex, fingerprint });
        
        const poll = await Poll.findOne({roomId});
        if(!poll){
            console.error('[VOTE POLL] Poll not found:', roomId);
            return res.status(404).json({message: "Poll not found"});
        }
        
        if(optionIndex === undefined || optionIndex < 0 || optionIndex >= poll.options.length){
            console.error('[VOTE POLL] Invalid option index:', optionIndex);
            return res.status(400).json({message: "Invalid option index"});
        }
        
        // Only check fingerprint, not IP
        const alreadyVoted = poll.voters.find((voter) => {
            return voter.fingerprint === fingerprint;
        });
        
        if(alreadyVoted){
            console.warn('[VOTE POLL] Already voted:', fingerprint);
            return res.status(400).json({message: "You have already voted"});
        }
        
        poll.options[optionIndex].votes += 1;
        poll.voters.push({fingerprint});
        await poll.save();
        
        console.log('[VOTE POLL] Vote recorded successfully:', { roomId, optionIndex });
        
        const io = req.app.get("io");
        io.to(roomId).emit("resultsUpdated", poll);
        res.status(200).json({message: "Vote recorded successfully"});  
    } catch (error) {
        console.error('[VOTE POLL] Error:', error.message);
        console.error('[VOTE POLL] Stack trace:', error.stack);
        res.status(500).json({message: "Server error", error: error.message});
    }
};

