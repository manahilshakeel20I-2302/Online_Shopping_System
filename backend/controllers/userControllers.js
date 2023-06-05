const mongoose = require('mongoose')

const userModel = require('../models/userModels')

require("dotenv").config();

const jwt = require('jsonwebtoken')

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
  makePayment, signup, login, updateUser, deleteUser
}