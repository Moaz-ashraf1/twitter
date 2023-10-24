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




}, { timestamps: true })
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
})

userSchema.pre(/^find/, async function (next) {
  this.find({ active: true });
  next();

})

userSchema.post('init', (doc) => {
  doc.profileImage = `${process.env.BASE_URL}/users/${doc.profileImage}`

})
userSchema.post('save', (doc) => {
  doc.profileImage = `${process.env.BASE_URL}users/${doc.profileImage}`

})
module.exports = mongoose.model("User", userSchema)