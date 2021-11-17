const express                        = require('express');
const { testController, testRouter } = require('./Controller/testRouter');
const { timeController, timeRouter } = require('./Controller/timeRouter');
const { userController, userRouter } = require('./Controller/userRouter');
const { Connection }                 = require('./Database/dbsetup');
const cookieParser                   = require('cookie-parser');
const session                        = require('express-session');
const bodyParser                     = require('body-parser');
const cors                           = require('cors');
const passport                       = require('passport');
const PORT                           = process.env.PORT || 4000;
const app                            = express();

require('dotenv').config();

const store = new session.MemoryStore();

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
        app.use(express.json())
        app.use(express.urlencoded({extended:false}))
        app.use(session({
            key:'userId',
            secret:'subscribe',
            resave:true,
            saveUninitialized:false,
            cookie:{
                maxAge:3600000*24,
            },
            store,
        }))
        app.use(cookieParser('subscribe'));
        app.use(passport.initialize());    
        app.use(passport.session());  
        require('./Middleware/Authentication/passportConfig')(passport)  
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