const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    foodName:{
        type:String,
        required:true
    },
    days:{
        type:Number,
        default:0
    },
    books:[{type: mongoose.Schema.Types.ObjectId, ref: 'Book'}]
 
})

const test = mongoose.model("Test",testSchema);

module.exports = test;