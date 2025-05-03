const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./controllers/userController');




const app = express();

app.use(cors({
    origin: 'https://front-omega-mocha.vercel.app',
    credentials: true
  }));

  
// Middleware
app.use(express.json());


// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Routes
app.use('/api', userRoutes);



// ✅ Sample static data (replace with MongoDB queries if needed)
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
  
  // ✅ Get all countries
  app.get('/api/countries', (req, res) => {
    res.json(countries);
  });
  
  // ✅ Get states for a country
  app.get('/api/states/:countryId', (req, res) => {
    const countryId = req.params.countryId;
    const result = states[countryId] || [];
    res.json(result);
  });
  
  // ✅ Get cities for a state
  app.get('/api/cities/:stateId', (req, res) => {
    const stateId = req.params.stateId;
    const result = cities[stateId] || [];
    res.json(result);
  });



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
