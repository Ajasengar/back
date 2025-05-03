const express = require('express');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const User = require('../models/User');



const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });  

const router = express.Router();



router.get('/username-check', async (req, res) => {
  const { username } = req.query;
  try {
    const user = await User.findOne({ username });
    if (user) {
      return res.json({ available: false });
    }
    res.json({ available: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/save-profile', upload.single('profilePhoto'), async (req, res) => {
  try {
    const {
      username,
      currentPassword,
      newPassword,
      profession,
      companyName,
      addressLine1,
      state,
      city,
      country,
      subscriptionPlan,
      newsletter,
      gender,
      companyAddress,
    } = req.body;

    console.log('Username:', username);

    const users = await User.find({ username });
    console.log('User data:', users);

    if (users.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }

    if (!addressLine1 || !state || !city || !country) {
      return res.status(400).json({ error: "Address fields are required" });
    }

    const parsedAddress = {
      addressLine1,
      state,
      city,
      country,
    };

    const hashedPassword = newPassword
      ? await bcrypt.hash(newPassword, 10)
      : currentPassword
      ? await bcrypt.hash(currentPassword, 10)
      : null;

    const newUser = new User({
      profilePhoto: req.file ? req.file.buffer : null,
      username,
      password: hashedPassword,
      profession,
      companyName: profession === 'Business' ? companyName : undefined,
      address: parsedAddress,
      subscriptionPlan,
      newsletter,
      gender,
      companyAddress,
    });

    await newUser.save();
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save profile', details: err.message });
  }
});

  
  
  

module.exports = router;
