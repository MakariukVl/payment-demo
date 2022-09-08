// Load enviroment variables from .env
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
// This is public sample test API key.
// Don`t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// Fixing CORS blocking for all requests and origins (by fixing cors policy, and
// adding special headers to all responses)
app.use(cors())
app.use(express.static('public'))
app.use(express.json())

function calculateOrderAmount(items) {
    // Replace this constant with a calculation of the order's amount (in cents)
    // Calculate the order total on the server to prevent
    // people from directly manipulate the (price) amount on the client
    return 699
}

app.post('/create-payment-intent', async (req, res) => {
    const { items } = req.body

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(items),
        // currency: 'usd',
        // automatic_payment_methods: {
        //     enabled: true
        // }
        // test manual pay methods
        currency: 'eur',
        payment_method_types: [
            'card',
            'bancontact',
            'eps',
            'giropay',
            'ideal',
            'p24',
            'sepa_debit',
            'sofort'
        ]
    })

    res.send({
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        clientId: paymentIntent.id,
        currency: paymentIntent.currency,
        clientSecret: paymentIntent.client_secret
    })
})

app.listen(4242, () => console.log('Node server listening on port 4242...'))