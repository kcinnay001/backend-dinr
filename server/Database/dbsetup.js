const mongoose = require('mongoose');


const uri = "mongodb+srv://dbuser:4k7l4mDyDTvS290O@cluster0.dqt55.mongodb.net/DinRdatabase?retryWrites=true&w=majority";
//const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

class Connection {
    constructor() {
        this.initDbConnection();
    }
    initDbConnection(){
        mongoose.connect(uri,{useNewUrlParser:true,useUnifiedTopology:true},()=>{
            console.log('connected to DinR database!!!')
        })
    }
}

module.exports = { Connection }