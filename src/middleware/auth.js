const async = require("hbs/lib/async")
const Registration = require("../models/models")
const jwt = require("jsonwebtoken")


const auth = async (req,res,next)=>{

    
    try {
        
        const token = req.cookies.login
        console.log(token)
        const verifyUser = jwt.verify(token,process.env.SECRET_KEY)
        console.log(verifyUser)

    } catch (error) {
        
        res.status(401).send(error)


    }    
}


module.exports = auth