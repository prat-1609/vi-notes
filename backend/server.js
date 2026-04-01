const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const sessionRoutes = require('./src/routes/sessionRoutes');

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Vi-Notes backend is running' });
});

app.use('/api/sessions', sessionRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});