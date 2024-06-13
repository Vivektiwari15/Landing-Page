require("dotenv").config()
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const registrationSchema = new mongoose.Schema({

    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    mobileno:{
        type:Number,
        required:true,
        unique:true,
        min:9
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

})

registrationSchema.methods.generateToken = async function(){
    try {
        const tokenz = jwt.sign({_id:this._id},process.env.SECRET_KEY)
        this.tokens=this.tokens.concat({token:tokenz})
        await this.save()
        return tokenz
    } catch (e) {
        console.log(e)
    } 
}



registrationSchema.pre("save",async function(next){

    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,12)
        this.confirmpassword = await bcrypt.hash(this.password,12)

    }
    next();
})


const Registration = new mongoose.model("Registration",registrationSchema)

module.exports = Registration