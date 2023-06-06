const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: String,
    },
    token:{
      type:String,
      default:''
    }
  },
  { timestamps: true }  // mongodb+srv://manahilmano2002:matii1013@cluster0.nconi13.mongodb.net/
);


const userModel = mongoose.model('users', userSchema);

module.exports = userModel;