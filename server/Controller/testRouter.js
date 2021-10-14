const testRouter = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { $where } = require('../Models/testSchema');
const testModel = require('../Models/testSchema')
const testBookModel = require('../Models/testBooks')
const authPage = require('../Middleware/Authentication/jwtAuth');
const testUser = require('../Models/testUserSchema');
const saltRounds = 10;

class testController {
    constructor(){
        this.initRouteGet()
    }

    initRouteGet(){
    //    //Gettting all the times in the userdb
       testRouter.post('/insert',async (req,res)=>{
        const foodName = req.body.foodName
        const days = req.body.days   
        // const foodName = 'Apple'
        // const days = 10   
        const test = new testModel({foodName: foodName, days:days})

        try {
         await test.save();
         res.send('inserted data')
        } catch (err){
             console.log(err)
        }
     })

     testRouter.get('/testing',(req,res)=>{
        res.send('here')
    })

     testRouter.get('/read', async(req,res)=>{
        testModel.find({},(err,result)=> {
             if(err) {
                 res.send(err)
             }
             res.send(result)
         })
     })

     testRouter.put('/update', async(req,res)=>{
        const newFood = req.body.newFood
        const id = req.body.id

        try{
           await testModel.findById(id, async(err,updatedFood)=>{
                updatedFood.foodName = newFood
                await updatedFood.save();
                res.send('updated')
            })
        } catch (err) {
            
        }
    })

     testRouter.delete('/delete/:id', async(req,res)=>{
      const id = req.params.id 
      try {
        await testModel.findByIdAndRemove(id).exec();
        res.send('deleted')
      } catch (err) {
      
      }
    })

    testRouter.get('/new',async(req,res)=>{
        const newtest = new testModel({
            foodName:'yannick',
            days:21
        })

        try {
            newtest.save((err)=>{
                if(err) {
                    return err
                }

                const story = new testBookModel({owner:'Bob Smith',ownedBy:newtest._id})
                story.save((err)=>{
                    if(err){
                        return err
                    } 
                })
            })
            res.send('success')
        } catch (err) {
            console.log(err)
        }
    })

        testRouter.get('/pop',async(req,res)=>{
            testBookModel.find({owner:'Bob Smith'}).populate('ownedBy').exec((err,val)=>{
                if(err){
                    return err
                }
                res.send(val[0].ownedBy.foodName)
            })
        })

        // testRouter.get('/auth',authPage(['teacher','admin','access']),async(req,res)=>{
        //     res.send('signed in')
        // })

        testRouter.post('/register',async(req,res)=>{
            const username = req.body.username
            const password = req.body.password 

            bcrypt.hash(password,saltRounds,(err,hash) => {
                if(err){
                    console.log(err)
                }
                const newTestUser = new testUser({username:username,password:hash})
                newTestUser.save((err,val)=>{
                    if(err){
                        return err
                    } else {
                        res.send({message:'user created'})
                    }
                });
            })
            
        })

        const verifyJwt = (req,res,next) => {
            const token = req.headers['x-access-token']

            if(!token){
                res.send('You, we need a token')
            } else {
                jwt.verify(token,'jwtSecret',(err,decoded)=>{
                    if(err){
                        res.json({auth:false,message:'failed to authenticate'})
                    } else {
                        console.log('here')
                        req.userId = decoded.id
                        next()
                    }
                })
            }
        }

        testRouter.get('/isUserAuth',verifyJwt,(req,res)=>{
            res.send('You are authenticated congrats')
        })

        testRouter.get('/login',(req,res)=>{
            if(req.session.user){
                res.send({loggedIn:true, user:req.session.user})
            } else {
                res.send({loggedIn:false})
            }
        })

        testRouter.post('/login',(req,res)=>{

            const username = req.body.username
            const password = req.body.password 

            testUser.find({username:username},(err,val)=>{
                if(err){
                    console.log({error:err})
                    res.send({error:err})
                } 
                  
                if(val.length > 0){
                    bcrypt.compare(password,val[0].password,(err,result)=>{
                        if(result){                            
                            const id = val[0]._id
                            const token = jwt.sign({id},'jwtSecret',{
                                expiresIn:300, // 5 minutes
                            })
                            req.session.user = val

                            res.json({auth:true,token:token,result:val})
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

module.exports = {testController,testRouter}