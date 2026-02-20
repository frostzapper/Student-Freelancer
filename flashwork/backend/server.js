require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDatabase } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const workerRoutes = require('./routes/workerRoutes');
const poolRoutes = require('./routes/poolRoutes');
const platformRoutes = require('./routes/platformRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const walletRoutes = require('./routes/walletRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.json({ message: 'FlashWork API Running' });
});

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/pool', poolRoutes);
app.use('/api/platform', platformRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/wallet', walletRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDatabase();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
