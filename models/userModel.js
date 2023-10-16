const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        require: [true, "name required"],
      },
      email: {
        type: String,
        require: [true, "email required"],
        unique: true
      },
      password: {
        type: String,
        require: [true, "password required"],
        minlength: [6, "Too short password "],
      },
      
    phone: String,
    
    profileImage: String,
    role: {
        type: String,
        enum: ["user", "manager", "admin"],
        default: "user",
      },

},{timestamps:true })

module.exports = mongoose.model("User",userSchema)