require("./database/connetion")
const express = require("express")
const app = express()
const port = process.env.PORT || 1100
const path = require("path")
const hbs = require("hbs")
const Registration = require("./models/models")
const bcrypt = require("bcryptjs")
const cookieParser = require("cookie-parser")
const auth = require("./middleware/auth")

const templatepath = path.join(__dirname,'../templates/views')
const partialspath = path.join(__dirname,'../templates/partials')

app.set("view engine","hbs")
app.set("views",templatepath)
hbs.registerPartials(partialspath)
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())

app.get("/",(req,res)=>{
    res.render("index")
})

app.get("/secret",auth,(req,res)=>{

    console.log(req.cookies.login)
    res.render("secret")
})


app.get("/registration",(req,res)=>{
    res.render("registration")
})

app.post("/registration",async(req,res)=>{

    try {

        const password = req.body.password
        const confirmpassword = req.body.confirmpassword
        
        if(password===confirmpassword){

            const Register = new Registration({

             firstname : req.body.firstname,
             lastname : req.body.lastname,
             mobileno : req.body.mobileno,
             email : req.body.email,
             password : password,
             confirmpassword : confirmpassword
            })

            const token = await Register.generateToken()     

            res.cookie("jwt",token,{
                httpOnly:true
            })
            console.log("hello",cookie)

            const save  = await Register.save()
            res.render("login")
        }else{

            res.send("Password Did'nt match")
        }

    } catch (e) {
        res.status(404).send(e)
    }


    
})


app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/login",async(req,res)=>{
    
    try {

        const email = req.body.email
        const password = req.body.password
       

        const login  = await Registration.findOne({email:email})
        const isMatch =await bcrypt.compare(password,login.password)
        const token = await login.generateToken()  
      
        
        res.cookie("login",token,{
            httpOnly:true,
            expires:new Date(Date.now()+100000)
        })

        if(isMatch){
            res.render("index")
        }else{
            res.status(404).send("Invalid Password")
        }


        
    } catch (e) {
        res.status(400).send("Invalid User")
    }





})

app.listen(port)