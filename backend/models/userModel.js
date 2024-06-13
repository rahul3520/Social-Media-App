import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
        },
        mobileNo:{
            type: String,
            required: true,
            unique: true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

const discussionSchema = mongoose.Schema(
    {
        userEmail: {
            type: String,
            required: true,
        },
        textField: {
            type: String,
        },
        imageUrl: {
            type: String,
        },
        hashTags: [{
            type: String
        }],
    },
    {
        timestamps: true,
    }
);

export const User = mongoose.model('User',userSchema);

export const Discuss = mongoose.model('Discussion',discussionSchema);
