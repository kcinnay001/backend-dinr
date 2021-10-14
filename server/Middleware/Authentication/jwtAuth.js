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

module.exports = verifyJwt;