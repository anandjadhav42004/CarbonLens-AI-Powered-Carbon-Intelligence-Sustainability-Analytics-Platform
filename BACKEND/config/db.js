const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.warn(`MongoDB unavailable: ${err.message}`);
    console.warn('Backend will run with realtime fallback data until MongoDB is available.');
  }
};

module.exports = connectDB;
