const bcrypt = require('bcrypt')
const localStrategy = require('passport-local').Strategy;
const User = require('../../Models/UserSchema');

module.exports = function(passport){
    passport.use(
        new localStrategy({
            usernameField:'email',
            passwordField:'password'
        },(email,password,done)=>{
            
            User.findOne({email:email}, (err,user)=>{
                if(err) throw err;
                if(!user) return done(null,false);
                bcrypt.compare(password, user.password ,(err,result)=>{
                    if(err) throw err; 
                    if(result === true) {
                        return done(null, user)
                    } else {
                        return done(null,false)
                    }
                })
            })
        })
    )

    //stores a cookie inside the browser, the user is the user found and passed to the done function
    passport.serializeUser((user,cb)=>{
        // console.log(user._id)
        // console.log(user.id)
        cb(null,user._id)
    })

    // gets the cookie that is passed to the front end finds the cookie and unravels it to send through a user
    passport.deserializeUser((id,cb)=>{
        User.findOne({_id:id}, (err,user)=>{
            // the cb returns the function to the start
            // this is the user that will be sent to the front end
            cb(err,user)
        })
    })

}
