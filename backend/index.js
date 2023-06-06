const express = require ('express')

const bodyParser = require ('body-parser')

require("dotenv").config();

const path = require('path')

const stripe = require('stripe')(process.env.SECRET_KEY)

const mongoose = require('mongoose')


const userRoutes = require('./routes/userRoutes')

const paymentRoutes = require('./routes/paymentRoutes')

const app = express()

app.use(bodyParser.urlencoded({extended:false}))

app.use(bodyParser.json())


app.use("/user", userRoutes)

app.use("/payment", paymentRoutes)






const PORT = process.env.PORT || 3000

// app.get("/", (req, res)=>{
//     res.json({publishableKey:process.env.PUSHLISHABLE_KEY})
// })


app.listen(PORT, ()=>{
    console.log(`App is listening on port ${PORT}`)
})

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("Connected to MongoDB")
}).catch(err=>{
    console.log(err)
})



