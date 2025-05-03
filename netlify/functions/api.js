const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');
require('dotenv').config();

const userRoutes = require('../../controllers/userController'); // ✅ updated path

const app = express();

// ✅ CORS
app.use(cors({
  origin: 'https://front-omega-mocha.vercel.app', // frontend URL
  credentials: true,
}));

app.use(express.json());

// ✅ log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// ✅ test endpoint
app.get('/', (req, res) => {
  res.send('Server working properly');
});

// ✅ Connect MongoDB once
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};
connectDB();

// ✅ Routes
app.use('/api', userRoutes);

// ✅ Countries / States / Cities
const countries = [
  { id: 'IN', name: 'India' },
  { id: 'US', name: 'USA' },
];

const states = {
  IN: [
    { id: 'UP', name: 'Uttar Pradesh' },
    { id: 'DL', name: 'Delhi' },
  ],
  US: [
    { id: 'CA', name: 'California' },
    { id: 'NY', name: 'New York' },
  ],
};

const cities = {
  UP: ['Lucknow', 'Noida', 'Varanasi'],
  DL: ['New Delhi', 'Dwarka'],
  CA: ['Los Angeles', 'San Francisco'],
  NY: ['New York City', 'Buffalo'],
};

app.get('/api/countries', (req, res) => {
  res.json(countries);
});

app.get('/api/states/:countryId', (req, res) => {
  const countryId = req.params.countryId;
  const result = states[countryId] || [];
  res.json(result);
});

app.get('/api/cities/:stateId', (req, res) => {
  const stateId = req.params.stateId;
  const result = cities[stateId] || [];
  res.json(result);
});

// ✅ export handler for Netlify
module.exports.handler = serverless(app);
