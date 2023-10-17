const mongoose = require('mongoose')
const bcrypt= require('bcryptjs')

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
      changePasswordAt: {
        type:Date,
        default: Date.now()
      },
      phone: String,
      profileImage: String,
      role: {
        type: String,
        enum: ["user", "manager", "admin"],
        default: "user",
      },
      active:{
        type:Boolean,
        default: true,
      },
      passwordResetCode:String,
      passwordExpTime:Date,
      passwordResetVerified:Boolean,
      

},{timestamps:true })
userSchema.pre('save',async function(next){
  this.password = await bcrypt.hash(this.password ,12);
  next();
})
module.exports = mongoose.model("User",userSchema)