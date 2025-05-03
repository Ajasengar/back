const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./controllers/userController');

const app = express();

// ✅ Allow all origins (you want to allow requests from any domain)
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// If you need to handle preflight requests explicitly (optional, not required with `cors()` alone)
// app.options('*', cors());

app.get('/', (req, res) => {
  res.send('Server Working');
});

// Middleware
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Routes
app.use('/api', userRoutes);

// Sample static data
const countries = [
  { id: 'IN', name: 'India' },
  { id: 'US', name: 'USA' },
];

const states = {
  IN: [
    { id: 'UP', name: 'Uttar Pradesh' },
    { id: 'MP', name: 'Madhya Pradesh' },
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

// Get all countries
app.get('/api/countries', (req, res) => {
  res.json(countries);
});

// Get states for a country
app.get('/api/states/:countryId', (req, res) => {
  const countryId = req.params.countryId;
  const result = states[countryId] || [];
  res.json(result);
});

// Get cities for a state
app.get('/api/cities/:stateId', (req, res) => {
  const stateId = req.params.stateId;
  const result = cities[stateId] || [];
  res.json(result);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
