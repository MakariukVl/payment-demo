const amountElement = document.querySelector('#amount')

// Main Steps in PayPal checkout flow:
// 1) Create order
// 2) Order gets approved
// 3) Capture the order (to finish transaction)
paypal.Buttons({
  createOrder: (data, actions) => {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: amountElement.value
        }
      }]
    })
  },
  onApprove: (data, actions) => {
    return actions.order.capture().then((details) => {
      alert('Transaction completed by ' + details.payer.name.given_name)
    })
  }
}).render('#paypal-button-container') // display payment options on your web page