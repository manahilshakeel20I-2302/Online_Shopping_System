const { makePayment,signup, login, updateUser ,deleteUser, forgetPassword, resetPassword } = require ("../controllers/userControllers")

const {DecodeUser, checkSuperAdmin, checkUser} = require('../token')

const userRoutes = require("express").Router();

userRoutes.post("/payments",  makePayment)
 
     userRoutes.post("/signup" , signup)

     userRoutes.patch("/updateUser/:id" , DecodeUser, checkSuperAdmin, updateUser )

     userRoutes.delete("/deleteUser/:id" ,DecodeUser,checkSuperAdmin ,deleteUser )

     userRoutes.get("/login"  ,login)

     userRoutes.post("/forgetPassword", forgetPassword)

     userRoutes.get("/resetPassword", resetPassword)

module.exports = userRoutes;
