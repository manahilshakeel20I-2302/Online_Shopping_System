const { makePayment,signup, login, updateUser ,deleteUser } = require ("../controllers/userControllers")

const {DecodeUser, checkSuperAdmin, checkUser} = require('../token')

const userRoutes = require("express").Router();

userRoutes.post("/payments",  makePayment)
 
     userRoutes.post("/signup" , signup)

     userRoutes.patch("/updateUser/:id" , DecodeUser, checkSuperAdmin, updateUser )

     userRoutes.delete("/deleteUser/:id" ,DecodeUser,checkSuperAdmin ,deleteUser )

     userRoutes.get("/login"  ,login)

module.exports = userRoutes;
