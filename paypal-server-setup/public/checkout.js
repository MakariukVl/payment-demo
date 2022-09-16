// Main Steps in PayPal checkout flow:
// 1) Create order
// 2) Order gets approved
// 3) Capture the order (to finish transaction)
paypal.Buttons({
  // Order is created on the server and the order id is returned
  createOrder: () => {
    return fetch('/create-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // use the "body" param to optionally pass additional order information
        // like product ids or amount
        body: JSON.stringify({
            items: [
                { id: 1, quantity: 2},
                { id: 2, quantity: 3}
            ]
        })
    }).then(res => {
        if (res.ok) return res.json()
        return res.json().then(json => Promise.reject(json))
    }).then(({id}) => id)
    .catch(e => console.error(e.error))
  },
  // Finalize the transaction on the server after payer approval
  onApprove: (data, actions) => {
    return actions.order.capture().then((details) => {
      alert('Transaction completed by ' + details.payer.name.given_name)
    })
  }
}).render('#paypal-button-container') // display payment options on your web page