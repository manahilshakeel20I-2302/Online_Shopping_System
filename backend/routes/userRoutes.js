const {makePayment} = require ('../models/userModel')

const userRoutes = require("express").Router();

userRoutes.post("/payments", makePayment)

module.exports={
    userRoutes
}