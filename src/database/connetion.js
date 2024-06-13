require("dotenv").config()
const mongoose = require("mongoose")

mongoose.connect(process.env.DATABASE).then(()=>{
    console.log("Connection Done")
}).catch((e)=>{
    console.log(e)
})





