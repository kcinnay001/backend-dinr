const userRouter = require('express').Router();
const userModel = require('../Models/UserSchema')
const teamModel = require('../Models/TeamSchema')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const e = require('express');
const passport = require('passport');
const { Cookie } = require('express-session');
const cookieParser = require('cookie-parser');
const saltRounds = 10;


//Handling all the log in and registering 

class userController {
    constructor(){
        this.initRouteGet()
    }

    initRouteGet(){ 
        //Gettting all the times in the userdb
        userRouter.get('/usertime',async (req,res)=>{
            userModel.find({}).populate('times').exec((err,val)=>{
                if(err){
                    return err
                } 
                res.send(val)
            })
        })

        userRouter.get('/testing',(req,res)=>{
            res.send('here')
        })

        userRouter.post('/jointeam',(req,res)=>{
           
            const newTeamMember = teamModel({team_name:'Dino Team'})
            newTeamMember.save()
            res.send('saved')    
           
        }) 

        //user joining a team
        userRouter.put('/jointeam/:teamid/:userid',(req,res)=>{
            const teamid = req.params.teamid
            const userid = req.params.userid

            console.log(teamid)
            teamModel.findById({_id:teamid}, async(err,val)=>{
                if(err){
                    console.log(err)
                } else {

                    val.team_members.push(userid)
                    val.save()
                    userModel.findById({_id:userid}, async(err,userVal)=>{
                        if(err){
                            console.log(err)
                        } else {
                            userVal.teamid = teamid
                            userVal.save()
                            res.send('joined a team')
                        }
                    })
                }
            })
        })

        //Getting a single users time 
        userRouter.get('/userdetails/:userid',async (req,res)=>{
            const id = req.params.userid 

            userModel.findById({_id:id}).populate('times').populate('teamid').exec((err,val)=>{
                if(err){
                    return err 
                } 
                res.send(val)
            })
        })

        //regsiter 
        userRouter.post('/register',async(req,res)=>{
            console.log('hit register post')
            const  username = req.body.username
            const  email    = req.body.email
            const  password = req.body.password

            userModel.findOne({username:username},async(err,doc)=>{
                if(err) {
                    console.log('error')
                    throw err; 
                }
                if(doc) {
                    console.log('User Already Exists')
                    res.send('User Already Exists');
                }
                if(!doc) {
                    const hashedPassword = await bcrypt.hash(req.body.password,10);

                    const newUser = new userModel({username:username,email:email,password:hashedPassword})
                    await newUser.save();
                    res.send({login:'user created',auth:true})
                    console.log('user created')
                } 
            })
        })

        //Login 
        userRouter.post('/login',(req,res,next)=>{
            passport.authenticate('local',(err,user,info)=>{
                if(err) throw err; 
                if(!user) res.send(info)
                else {
                    req.login(user,err => {
                        if(err)throw err;
                        userModel.findOneAndUpdate({email:req.body.email},{auth:true},(err,doc)=>{
                            if(err){
                                console.log(err)
                            } else {
                                //console.log(doc)
                            }
                        });
                        res.send({data:'Successfully Authenticated',info:req.user})
                        console.log(req.user)
                    })
                }
            })(req,res,next);
        })

        userRouter.get('/login',(req,res)=>{
           res.send(req.user)
        //    console.log(req.user)
        })
 
        //Logout
        userRouter.get('/logout',(req,res)=>{
            console.log(req.user.id)
            userModel.findByIdAndUpdate(req.user.id,{auth:false},(err,doc)=>{
               if(err){
                   console.log(err)
               } else {
                    console.log('updated')
               }
           })
        })

    }
    // cookies.set('testtoken', {maxAge: 0});
    // cookies.set('testtoken', {expires: });
}

module.exports = {userController, userRouter}