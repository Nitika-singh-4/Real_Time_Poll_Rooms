const Poll  = require('../models/Poll');
const {v4: uuidv4} = require('uuid');

exports.createPoll = async (req, res) => {
    try {
        const {question, options} = req.body;
        if(!question || !options || options.length < 2){
            return res.status(400).json({message: "Question and at least 2 options are required"});
        }
        if(!options || options.length < 2){
            return res.status(400).json({message: "At least 2 options are required"});
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
        res.status(201).json({message: "Poll created successfully", roomId: newPoll.roomId});
    }
        catch (error) {
            res.status(500).json({message: "Server error", error: error.message});
        }
        const validOptions = options
  .map(opt => opt.trim())
  .filter(opt => opt !== "");

if (validOptions.length < 2) {
  return res.status(400).json({
    message: "At least 2 valid options required"
  });
}

};

exports.getPoll = async (req, res) => {
    try {
        const {roomId} = req.params;
        const poll = await Poll.findOne({roomId});
        if(!poll){
            return res.status(404).json({message: "Poll not found"});
        }
        res.status(200).json(poll); 
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};

exports.votePoll = async (req, res) => {
    try{
        const {roomId} = req.params;
        const {optionIndex, fingerprint} = req.body;
        const poll = await Poll.findOne({roomId});
        if(!poll){
            return res.status(404).json({message: "Poll not found"});
        }
        if(optionIndex === undefined || optionIndex < 0 || optionIndex >= poll.options.length){
            return res.status(400).json({message: "Invalid option index"});
        }
        const ip = 
        req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const alreadyVoted = poll.voters.find(
            coter => voter.ip === ip || voter.fingerprint === fingerprint   
        )
        if(alreadyVoted){
            return res.status(400).json({message: "You have already voted"});
        }
        poll.options[optionIndex].votes += 1;
        poll.voters.push({ip, fingerprint});
        await poll.save();
        const io = req.app.get("io");
       io.to(roomId).emit("resultsUpdated", poll);
        res.status(200).json({message: "Vote recorded successfully"});  
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});

    }
};

