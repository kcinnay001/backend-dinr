const mongoose = require('mongoose');

const testUserSchema = new mongoose.Schema({
    username:{
        type:String
    },
    password:{
        type:String
    }
})

const testUser = mongoose.model("TestUser",testUserSchema);

module.exports = testUser;