const mongoose = require('mongoose');

// Address Schema
const addressSchema = new mongoose.Schema({
  addressLine1: { type: String},
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
});

// User Schema
const userSchema = new mongoose.Schema({
  profilePhoto: {
    data: Buffer,             // Store the image data in a buffer
    contentType: String,      // Store the content type of the image
  },
  username: { type: String, required: true, unique: true },
  currentPassword: { type: String, required: true },
  newPassword: { type: String, required: true },
  profession: { type: String, required: true },
  companyName: { type: String }, 
  address: { type: addressSchema},
  subscriptionPlan: { type: String, enum: ['Basic', 'Pro', 'Enterprise'], required: true },
  newsletter: { type: Boolean, default: true },
  gender: { type: String, required: true },  // Added gender field
  companyAddress: { type: String},  // Added company address field
}, { timestamps: true });

// Validation for company name if profession is 'Entrepreneur'
userSchema.pre('validate', function (next) {
  if (this.profession === 'Entrepreneur' && !this.companyName) {
    this.invalidate('companyName', 'Company Name is required for Entrepreneurs');
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
