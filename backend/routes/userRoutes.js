const { signup, login, updateUser ,deleteUser, forgetPassword, resetPassword, displayUsers } = require ("../controllers/userControllers")

const {DecodeUser, checkSuperAdmin, checkUser} = require('../token')

const userRoutes = require("express").Router();

 
     userRoutes.post("/signup" , signup)

     userRoutes.patch("/updateUser/:id" , DecodeUser, checkSuperAdmin, updateUser )

     userRoutes.delete("/deleteUser/:id" ,DecodeUser,checkSuperAdmin ,deleteUser )

     userRoutes.get("/login"  ,login)

     userRoutes.post("/forgetPassword", forgetPassword)

     userRoutes.get("/resetPassword", resetPassword)

     userRoutes.get("/displayAllUsers", DecodeUser, checkSuperAdmin, displayUsers)

module.exports = userRoutes;
