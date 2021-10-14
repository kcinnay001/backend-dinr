const userRouter = require('express').Router();
const userModel = require('../Models/UserSchema')
const teamModel = require('../Models/TeamSchema')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const e = require('express');
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
            const  username = req.body.username
            const  email    = req.body.email
            const  password = req.body.password

            bcrypt.hash(password,saltRounds,(err,hash)=>{
                if(err){
                    console.log(err)
                }
                const newUser = new userModel({username:username,email:email,password:hash})
                newUser.save((err,val)=>{
                    if(err){
                        return err
                   } else {
                       res.send({message:'user created'})
                   }
                })
            }) 
        })

        //Login 
        userRouter.post('/login',(req,res)=>{
            const email = req.body.email 
            const password = req.body.password

            userModel.find({email:email},(err,val)=>{
                if(err){
                    console.log(err)
                    res.send({error:err})
                }

                if(val.length > 0){
                    bcrypt.compare(password,val[0].password,(err,result)=>{
                        if(result){
                            const id = val[0]._id
                            const token = jwt.sign({id}, 'jwtSecret',{
                                expiresIn:300 // 5 minutes
                            })
                            req.session.user = val

                            res.json({auth:true,token,result:val})
                        } else {
                            res.json({auth:false,message:'wrong username password combination'})
                        }
                    })
                } else {
                    res.json({auth:false, message:'no user exists'})
                }
            })
        })


    }
}

module.exports = {userController, userRouter}