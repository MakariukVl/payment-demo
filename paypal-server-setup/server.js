// Load enviroment variables from .env
require('dotenv').config()
const express = require('express')

const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json())

const paypal = require('@paypal/checkout-server-sdk')
const e = require('express')
const Environment = process.env.ENVIRONMENT === 'production'
    ? paypal.core.LiveEnvironment
    : paypal.core.SandboxEnvironment
const paypalClient = new paypal.core.PayPalHttpClient(new Environment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_APP_SECRET
))

const storeItems = new Map([
    [1, { price: 10, name: "6th ball" }],
    [2, { price: 20, name: "teeth spike" }],
    [3, { price: 30, name: "premium bald haircut" }],
    [4, { price: 40, name: "necessary thing" }]
])

app.get('/', (req, res) => {
    res.render('checkout', { paypalClientID: process.env.PAYPAL_CLIENT_ID })
})

app.post('/create-order', async (req, res) => {
    const request = new paypal.orders.OrdersCreateRequest()
    const total = req.body.items.reduce((sum, item) => {
        const { id, quantity } = item
        return sum + storeItems.get(id).price * quantity
    }, 0)
    request.prefer('return=representation')
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
            {
                amount: {
                    currency_code: 'USD',
                    value: total,
                    // breakdown - is detailed bill with all units cost summary
                    breakdown: {
                        item_total: {
                            currency_code: 'USD',
                            value: total
                        }
                    }
                },
                items: req.body.items.map(item => {
                    const storeItem = storeItems.get(item.id)
                    return {
                        name: storeItem.name,
                        // HOW MUCH EACH ITEM COST
                        unit_amount: {
                            currency_code: 'USD',
                            value: storeItem.price
                        },
                        quantity: item.quantity
                    }
                })
            }
        ]
    })

    try {
        const order = await paypalClient.execute(request)
        res.json({ id: order.result.id })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.listen(3000, () => console.log('Node server listening on port 3000...'))