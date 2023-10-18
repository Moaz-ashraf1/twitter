const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        phone: String,
        bio: {
            type: String,
            maxlength: 200
        },
        profilePhoto: String,
        dateOfBirth: String,


    }, {
    timestamps: true
})

userProfileSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'userId',
        select: "-_id name email ",

    }),
        next();
});
module.exports = mongoose.model("userProfile", userProfileSchema)