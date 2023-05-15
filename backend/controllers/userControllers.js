const mongoose = require('mongoose')

const userModel = require('../models/userModel')

const stripe = require('stripe')(process.env.SECRET_KEY)

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
    makePayment
}