require("dotenv").config();

const stripe = require('stripe')(process.env.SECRET_KEY)

const userModel = require('../models/userModels')
const createCustomer = async (req, res) => {
    try {
      const allCustomers = await stripe.customers.list();
      const existingCustomer = allCustomers.data.find(
        (customer) => customer.email === req.body.email
      );
  
      let customer;
  
      if (existingCustomer) {
        customer = existingCustomer;
        res.status(200).send({"Message":"Customer Already exists in stripe!"})
      } else {
        customer = await stripe.customers.create({
          name: req.body.name,
          email: req.body.email,
        });
      }
  
      res.status(200).send(customer);
    } catch (error) {
      res.status(400).send({ success: false, msg: error.message });
    }
  };
  

const addNewCard = async(req,res)=>{

    try {


        const {
            customer_id,
            card_Name,
            card_ExpYear,
            card_ExpMonth,
            card_Number,
            card_CVC,
        } = req.body;

        const card_token = await stripe.tokens.create({
            card:{
                name: card_Name,
                number: card_Number,
                exp_year: card_ExpYear,
                exp_month: card_ExpMonth,
                cvc: card_CVC
            }
        });

        const card = await stripe.customers.createSource(customer_id, {
            source: `${card_token.id}`
        });

        res.status(200).send({ card: card.id });

    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }

}

const createCharges = async(req,res)=>{

    try {

        const createCharge = await stripe.charges.create({
            receipt_email: 'i202302@nu.edu.pk',
            amount: parseInt(req.body.amount)*100, //amount*100 beacuse originally in cents
            currency:'USD',
            card: req.body.card_id,
            customer: req.body.customer_id
        });

        res.status(200).send(createCharge);

    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }

}


module.exports = {
    createCustomer,
    addNewCard,
    createCharges
}