import fetch from "node-fetch";

const { CLIENT_ID, APP_SECRET } = process.env
const origin = 'https://api-m.sandbox.paypal.com'

const handleResponse = async res => {
    if (res.status === 200 || res.status === 201) return res.json()

    const errorMessage = await res.text()
    throw new Error(errorMessage)
}

export async function createOrder() {
    const accessToken = await this.generateAccessToken()
    const url = `${origin}/v2/checkout/orders`
    const response = await fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [
                { amount: { currency_code: 'USD', value: '100.00' }}
            ]
        })
    })

    return handleResponse(response)
}

export async function capturePayment(orderID) {
    const accessToken = await this.generateAccessToken()
    const url = `${origin}/v2/checkout/orders/${orderID}/capture`
    const response = await fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        }
    })

    return handleResponse(response)
}

export async function generateAccessToken() {
    const auth = Buffer.from(CLIENT_ID + ':' + APP_SECRET).toString('base64')
    const response = await fetch(`${origin}/v1/oauth2/token`, {
        method: 'post',
        body: 'grant_type=client_credentials',
        headers: {
            Authorization: `Basic ${auth}`
        }
    })

    const jsonData = await handleResponse(response)
    return jsonData.access_token
}
