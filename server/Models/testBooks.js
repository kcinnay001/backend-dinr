const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    owner:{
        type:String
    },
    ownedBy:{
        type:mongoose.Schema.Types.ObjectId,ref:'Test'
    }

})

const Book = mongoose.model("Book",bookSchema);

module.exports = Book;