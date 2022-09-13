// Load environment variables from .env
require('dotenv').config()
const express = require('express')
const app = express()
// This is public sample test API key.
// Don`t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const bodyParser = require('body-parser')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const priceBookDefault = {
    currency: 'USD',
    units: 'IN_CENTS',
    items: {
        'book-10448': {
            name: 'Stubborn Attachments, T.Cowen',
            price: 2000
        }
    }
}

app.post('/create-checkout-session', async (req, res) => {
    let bodyItems = JSON.parse(req.body.items)
    const session = await stripe.checkout.sessions.create({
        // Provide the exact Price ID (for example, pr_1234) or the product you want to sell
        line_items: bodyItems.map(item => {
            serverSideItem = priceBookDefault.items[item.id]
            return {
                price_data: {
                    currency: priceBookDefault.currency,
                    product_data: {
                        name: serverSideItem.name
                    },
                    unit_amount: serverSideItem.price
                },
                quantity: item.qty
            }
        }),
        mode: 'payment',
        success_url: `${process.env.DOMAIN}/success.html`,
        cancel_url: `${process.env.DOMAIN}/cancel.html`
    })

    res.redirect(303, session.url)
})

app.listen(4242, () => console.log('Node server listening on port 4242...'))