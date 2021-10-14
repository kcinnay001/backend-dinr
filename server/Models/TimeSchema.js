const mongoose = require('mongoose');

const TimeSchema = new mongoose.Schema({
    duration:{
        type:String,
        required:true
    },
    User:{
        type:{type:mongoose.Schema.Types.ObjectId, ref:'User'}
    },
    date:{
        type:String,
        required:true
    }
})

const Time = mongoose.model("Time",TimeSchema);

module.exports = Time;