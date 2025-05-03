const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');
require('dotenv').config();
const userRoutes = require('./controllers/userController');

const app = express();

// CORS configuration
app.use(cors({
  origin: 'https://front-omega-mocha.vercel.app', // Allow frontend
  credentials: true,
}));

app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
  res.send('Server working properly');
});




mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});


  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
  });

// Routes
app.use('/api', userRoutes);

// Countries / states / cities endpoints
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

// Export as a serverless function handler
module.exports = serverless(app);


