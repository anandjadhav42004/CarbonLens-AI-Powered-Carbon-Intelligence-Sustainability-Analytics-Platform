const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn('\n⚠️  WARNING: MONGO_URI environment variable is not defined.');
    console.warn('🔄 Switching to Resilient Mock DB mode. Data will persist in: BACKEND/data/mock_db.json\n');
    process.env.MOCK_DB = 'true';
    return;
  }
  
  try {
    console.log('⏳ Connecting to MongoDB...');
    // Use a fast timeout (3s) to avoid hanging when MongoDB isn't running locally
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('✅ MongoDB connected successfully!');
  } catch (err) {
    console.warn('\n⚠️  WARNING: Failed to connect to MongoDB:', err.message);
    console.warn('🔄 Falling back to Resilient Mock DB mode. Data will persist in: BACKEND/data/mock_db.json\n');
    process.env.MOCK_DB = 'true';
  }
};

module.exports = connectDB;

