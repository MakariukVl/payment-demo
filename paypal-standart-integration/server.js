import "dotenv/config"; // loads variables from .env file
import express from "express";
import * as paypalAPI from "./paypal-api.js";

const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index', { clientID: process.env.CLIENT_ID })
})

app.post('/api/orders', async (req, res) => {
    try {
        const order = await paypalAPI.createOrder()
        res.json(order)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

app.post('/api/orders/:orderID/capture', async (req, res) => {
    const { orderID } = req.params
    try {
        const captureData = await paypalAPI.capturePayment(orderID)
        res.json(captureData)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

app.listen(8888, () => console.log('Server listening on port 8888...'));