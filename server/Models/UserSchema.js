const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    teamid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Team'
        }, 
    times:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Time'
    }]
})

const User = mongoose.model("User",UserSchema);

module.exports = User;