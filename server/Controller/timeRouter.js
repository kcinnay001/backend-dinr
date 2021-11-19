const timeRouter = require('express').Router();
const e = require('express');
const TimeModel = require('../Models/TimeSchema');
const UserModel = require('../Models/UserSchema');

class timeController {
    constructor(){
        this.initRouteGet()
    }

    initRouteGet(){ 
        timeRouter.get('/test',(req,res)=>{
            res.send('here')
        })

        timeRouter.get('/:id',async (req,res)=>{
            const id = req.params.id
            UserModel.findById(id).populate('times').exec((err,val)=>{
                if(err){
                    return err
                }
                res.send(val.times)
            })
        })

        timeRouter.put('/usertime/:userId/:id',(req,res)=>{
            const timeId = req.params.id
            const id = req.params.userId

            console.log(timeId)
            console.log(id)
            
            UserModel.findById({_id:id},async(err,val)=>{
                if(err){
                    console.log(err)
                } else {  
                    const newTime = await TimeModel.findByIdAndUpdate({_id:timeId},{status:false})
                    await newTime.save()
                    val.save()
                    res.send('updated to false')
                }
            })
             
        })

        timeRouter.delete('/deletetime/:userId/:id',(req,res)=>{
            const timeId = req.params.id
            const id = req.params.userId

            console.log(timeId)
            console.log(id)
            
            UserModel.findById({_id:id},async(err,val)=>{
                if(err){
                    console.log('hitting error')
                    console.log(err)
                } else {  
                    const newTime = await TimeModel.findByIdAndRemove({_id:timeId})
                    val.save()
                    res.send('delete user')
                }
            })
             
        })
        
        timeRouter.put('/set',(req,res)=>{
            const id = req.body.id 
            const date = req.body.date // todays date
            const duration = req.body.duration //30minutes
            const finalTime = req.body.finalTime //579 minutes
            const status = req.body.status // started

            console.log(date)

             UserModel.findById({_id:id},async(err,val)=>{
                if(err){
                    console.log(err)
                } else {
                    const newTime = await TimeModel({duration:duration,User:val._id,date:date,finalTime:finalTime,status:status})
                    await newTime.save()
                    val.times.push(newTime._id)
                    val.save()
                    res.send('updated')
                }
            })
        })
    }
}

module.exports = {timeController,timeRouter}  