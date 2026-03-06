import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [ true, "username already taken"],
        required: true
    },

    email: {
        type: String,
        unique: [ true, "user already exist with this email"],
        required: true
    },

    password: {
        type: String,
        required: true
    }
})

export const UserModel = mongoose.model("Users", UserSchema);