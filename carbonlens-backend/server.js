const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth',        require('./routes/auth'));
app.use('/api/emissions',   require('./routes/emissions'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/insights',    require('./routes/insights'));

app.get('/', (req, res) => {
  res.send('Backend Running');
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend is healthy',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
