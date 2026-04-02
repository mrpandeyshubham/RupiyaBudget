const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

app.get('/', (req, res) => {
  res.send('KharchaTrack API running');
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;
