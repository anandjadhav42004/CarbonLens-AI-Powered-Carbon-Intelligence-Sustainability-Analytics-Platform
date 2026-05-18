const mongoose = require('mongoose');

function hasMongoConnection() {
  return mongoose.connection.readyState === 1;
}

module.exports = { hasMongoConnection };
