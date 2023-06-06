const mongoose = require('mongoose')

const userModel = require('../models/userModels')

require("dotenv").config();

const jwt = require('jsonwebtoken')

const randomstring = require('randomstring')

const nodemailer = require('nodemailer')

const stripe = require('stripe')(process.env.SECRET_KEY)

let signup = (req , res)=>{
    let {name,email, password, phone, address, role } = req.body;

    let user = new userModel({
        name,
        email,
        password,
        phone,
        address,
        role
     
    })

    user.save().then((user)=>{
        res.status(200).json({"Message": "New " +user.role+" Created" , user:user})
        res.send("signup successful")
    }).catch(err=>{
        res.status(500).json({"Message": user.role + " Not Created" , err:err})
    })

}
let login =(req,res)=>{ 
    let {email, password}=req.body;
 
 userModel.findOne({email:email}).then(founduser=>{
     if(!founduser){
         res.status(404).send({"Message":"user not found"});
     }
     else{
         if(password == founduser.password){
             let token = jwt.sign({
                 id:founduser._id,
                 role:founduser.role
             } ,process.env.SECRET , {
                 expiresIn:'24h'
             })
             res.status(200).send({founduser,token})
         }else
         res.status(403).send({"Message":"Invalid Password"})
     }
 })
 
 }

 let deleteUser = async (req, res) =>{
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({error: 'User not found'})
    }
     const User = await userModel.findOneAndDelete({_id : id})
         if(!User){
          return res.status(404).json({error: 'User not found'})
         }
      res.status(200).send({"Message":"User deleted Succesfully!"})
    }

 
let updateUser = async (req, res) =>{
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({error: 'User not found'})
    }
    const User = await userModel.findByIdAndUpdate({ _id: id }, req.body, { new: true });
      res.status(200).send({"Message":"User updated successfully!"}).json(User)
    }

  let sendResetMail = async(name, email, token)=>{
    try{
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
          clientId: process.env.OAUTH_CLIENTID,
          clientSecret: process.env.OAUTH_CLIENT_SECRET,
          refreshToken: process.env.OAUTH_REFRESH_TOKEN
        }
      });
      // const transporter = nodemailer.createTransport({
      //   host:'smtp.gmail.com',
      //   port:587,
      //   secure:false,
      //   requireTLS: true,
      //   auth:{
      //     user:'i202302@nu.edu.pk',
      //     password: 'mateen1013'
      //   }
      //   // tls: {
          
      //   //   minVersion: 'TLSv1.2'
      //   // }
      // })
      // const mailOptions = {
      //   from: 'i202302@nu.edu.pk',
      //   to: email,
      //   subject: 'Reset Password',
      //   html: '<p> Hello'+name+'<a href="http://localhost:3000/user/resetPassword?token='+token+'">Click this link to reset your password. Thank You!'
        
      // }
      let mailOptions = {
        from: process.env.MAIL_USERNAME,
        to: email,
        subject: 'Reset Password',
        html: '<p> Hello'+name+'<a href="http://localhost:3000/user/resetPassword?token='+token+'">Click this link to reset your password. Thank You!'

      };
      transporter.sendMail(mailOptions, function(error, info){
        if(error){
          console.log(error)

        }
        else{
          console.log("Mail has been sent to you", info.response)
        }
      })
      // transporter.verify(function (error, success) {
      //   if (error) {
      //     console.log(error);
      //   } else {
      //     console.log("Server is ready to take our messages");
      //   }
      // });
    }
    catch(error){
      res.status(400).send({msg:error.message})
      console.log(error)

    }
  }

let forgetPassword = async(req,res)=>{
  try{
      const email = req.body.email 
      const userData = await userModel.findOne({email:email})
      if(userData){
        const rand= randomstring.generate()
        await userModel.updateOne({email:email}, {$set:{token:rand}})
        sendResetMail(userData.name, userData.email, rand);
        res.status(200).send({"Message":"We have sent you an email, follow ths instructios to reset your password!"})

      }
      else{
        res.status(400).json({error: 'This email does not exists!'})
      }
       
  }
  catch(error){
      res.status(400).json({error: error.msg})
      console.log(error)
  }
}

let resetPassword = async(req,res)=>{
  try{
    const token = req.query.token
    const tokenData = await userModel.findOne({token:token})
    if(tokenData){
       const password =  req.body.password;
       const userData = await userModel.findByIdAndUpdate({_id:tokenData._id},{$set:{password:password, token:''}}, {new:true})
       res.status(400).send({success:true, msg:"Your Password has been reset!", data:userData})
    }
    else{
      res.status(400).send({success:true, msg:"This Link has been expired!"})
    }

  }
  catch(error){
    res.status(400).send({success:fasle, msg:error})
  }
}
let makePayment = (req, res)=>{
    const userEmail = req.body.stripeEmail;

  userModel.findOne({ email: userEmail })
    .then((user) => {
      if (!user) {
        return res.status(404).send('User not found');
      }
       const customerDetails = {
        email: userEmail,
        source: req.body.stripeToken,
        name: user.name,
        address: {
          line1: user.address.line1,
          postal_code: user.address.postal_code,
          city: user.address.city,
          state: user.address.state,
          country: user.address.country,
        },
      };

      stripe.customers.create(customerDetails)
        .then((customer) => {
          const chargeDetails = {
            amount: 7000,
            description: 'Web product',
            currency: 'USD',
            customer: customer.id,
          };

          stripe.charges.create(chargeDetails)
            .then((charge) => {
              console.log(charge);
              res.send('Success');
            })
            .catch((err) => {
              res.send(err);
            });
        })
        .catch((err) => {
          res.send(err);
        });
    })
    .catch((err) => {
      res.send(err);
    });
}


module.exports={
  makePayment, signup, login, updateUser, deleteUser, forgetPassword, resetPassword
}