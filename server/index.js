const express = require('express');
const { testController, testRouter } = require('./Controller/testRouter');
const { timeController, timeRouter } = require('./Controller/timeRouter');
const { userController, userRouter } = require('./Controller/userRouter');
const { Connection } = require('./Database/dbsetup');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 4000;
const app = express();

require('dotenv').config();

class Initialize extends Connection{
    constructor(){
        super();
        this.InitializeMiddleware();
        this.initRoutes();
        this.start();
    }

    start () {
        app.listen(PORT,()=>{
            console.log(`starting server on PORT:${PORT}`)
        })
    }

    InitializeMiddleware () {
        app.use(cors({
            origin:['http://localhost:3000'],
            methods:['GET','POST','PUT','DELETE'],
            credentials:true
        }))
        app.use(cookieParser());
        app.use(express.json())
        app.use(bodyParser.urlencoded({extended:true}))
        app.use(session({
            key:'userId',
            secret:'subscribe',
            resave:false,
            saveUninitialized:false,
            cookie:{
                expires:60*60*24
            }
        }))
    } 

    initRoutes () {
        app.use('/test',testRouter)
        app.use('/time',timeRouter)
        app.use('/user',userRouter)
    }
}

new Initialize();
new testController();
new timeController();
new userController();