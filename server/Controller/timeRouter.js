const timeRouter = require('express').Router();
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

        timeRouter.put('/set',(req,res)=>{
            const id = req.body.id
            const date = req.body.date
            const duration = req.body.duration

             UserModel.findById({_id:id},async(err,val)=>{
                if(err){
                    console.log(err)
                } else {
                    const newTime = await TimeModel({duration:duration,User:val._id,date:date})
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