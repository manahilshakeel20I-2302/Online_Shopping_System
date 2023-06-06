const express = require('express');

const payment_route = express();

const { createCustomer, createCharges, addNewCard } = require ('../controllers/paymentController')

const {DecodeUser} = require('../token')



const bodyParser = require('body-parser');
payment_route.use(bodyParser.json());
payment_route.use(bodyParser.urlencoded({ extended:false }));


payment_route.post('/createStripeCustomer', DecodeUser, createCustomer);
payment_route.post('/addCard', DecodeUser,  addNewCard);
payment_route.post('/createCharge',DecodeUser, createCharges);

module.exports = payment_route;