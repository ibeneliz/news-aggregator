var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const userScheme = new Schema({
      fullName: {
        type: String,
        required: [true, "Fullname not provided."],
      },
      email: {
        type: String,
        unique: [true, "Email already exists in database."],
        lowercase: true,
        trim: true,
        required: [true, "Email not provided."],
        validate: {
          validator: function (v) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
          },
          message: '{VALUE} is not a valid email!'
        }
      },
      password: {
        type: String,
        required: true
      },
      preferences: {
        type: Object,
        required: true
      },
      favorite: {
        type: Array
      },
      read: {
        type: Array
      }
});

module.exports = mongoose.model('User', userScheme);