const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');
const path    = require('path');
dotenv.config();

const connectDB = require('./config/db');
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth',        require('./routes/auth'));
app.use('/api/emissions',   require('./routes/emissions'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/insights',    require('./routes/insights'));
app.use('/api/realtime',    require('./routes/realtime'));
app.use('/api/ledger',      require('./routes/ledger'));
app.use('/api/sensors',     require('./routes/sensors'));
app.use('/api/forecast',    require('./routes/forecast'));
app.use('/api/documents',   require('./routes/documents'));
app.use('/api/community',   require('./routes/community'));
app.use('/api/comments',    require('./routes/comments'));
app.use('/api/circles',     require('./routes/circles'));
app.use('/api/admin',       require('./routes/admin'));
app.use('/api/users',       require('./routes/users'));
app.use('/api/assistant',   require('./routes/assistant'));

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
