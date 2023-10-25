const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    require: [true, "name required"],
  },
  slug: {
    type: String,
    lowercase: true,
  },
  email: {
    type: String,
    require: [true, "email required"],
    unique: true,
    lowercase: true,

  },
  phone: String,
  bio: {
    type: String,
    maxlength: 200,
    default: "Hello, I'm new on Twitter"
  },
  profileImage: {
    type: String,
    default: 'default.jpg',
  },
  password: {
    type: String,
    require: [true, "password required"],
    minlength: [6, "Too short password "],
  },
  role: {
    type: String,
    enum: ["user", "manager", "admin"],
    default: "user",
  },
  birthDate: String,
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  changePasswordAt: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
  },
  passwordResetCode: String,
  passwordExpTime: Date,
  passwordResetVerified: Boolean,

  Following: [{
    type: mongoose.Types.ObjectId,
    ref: 'User'
  }],
  Followers: [{
    type: mongoose.Types.ObjectId,
    ref: 'User'
  }]




}, { timestamps: true })


userSchema.pre(/^find/, async function (next) {
  this.find({ active: true });
  next();

})



userSchema.post('init', function (doc) {
  doc.profileImageLink = `${process.env.BASE_URL}/users/${doc.profileImage}`;
});

userSchema.post('save', function (doc) {
  doc.profileImageLink = `${process.env.BASE_URL}/users/${doc.profileImage}`;
});
module.exports = mongoose.model("User", userSchema)
