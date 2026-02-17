const mongoose = require("mongoose");

const connectDB  = async () => {
    try{
        console.log('[DATABASE] Attempting to connect to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('[DATABASE] ✓ MongoDB Connected Successfully');
    }
    catch(err){
        console.error('[DATABASE] ✗ MongoDB Connection Failed');
        console.error('[DATABASE] Error message:', err.message);
        console.error('[DATABASE] Full error:', err);
        process.exit(1);
    }
};
module.exports = connectDB;
