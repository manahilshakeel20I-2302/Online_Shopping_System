const {makePayment, signup, login, update,deleteUser } = require ('../models/userModel')

const {DecodeUser, checkSuperAdmin, checkUser} = require('../token')

const userRoutes = require("express").Router();

userRoutes.post("/payments", DecodeUser, makePayment)

userRoutes.post("/signup" , signup)

userRoutes.patch("/updateUser/:id" , DecodeUser , checkSuperAdmin, update )

userRoutes.patch("/deleteUser/:id" , DecodeUser , checkSuperAdmin ,deleteUser )


userRoutes.get("/login" , DecodeUser ,login)

module.exports={
    userRoutes
}