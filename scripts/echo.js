'use strict';

const config = require('config');
// Get firebase
const firebase = require('./firebase_manager')(config);
const fdb = new firebase('echo');
// Stripe
const stripe = require('stripe')(config.Base.stripeKey);

// Simulate orders
setInterval(() => {
    fdb.crs('orders');
    fdb.save(require('./order.json'));
}, 3000);

// Listen to orders
fdb.crs('orders').on('child_added', (snap) => {
    let order = snap.val();

    // Expiry data clean
    let expiry = order.payment.details.expiry.split('/');

    // Create stripe customer
    stripe.customers.create({
        email: order.customer.email,
        metadata: {
            name: order.customer.name
        },
        source: {
            name: order.customer.name,
            object: "card",
            number: order.payment.details.number,
            exp_month: expiry[0],
            exp_year: expiry[1],
            cvc: order.payment.details.cvc,
            currency: "gbp"
        }
    }, (err, customer) => {
        if (err) {
            console.error(err);
        }

        // Update customer object
        fdb.crs('orders')
        let child = fdb.setChild(snap.key)
        child.update({ "customer/id": customer.id })

        console.log(`Customer, ${order.customer.name} created and set with Stripe id: ${customer.id}`)

        // Create a charge
        stripe.charges.create({
            amount: parseFloat(order.product.price) * 100,
            currency: 'gbp',
            description: order.product.name,
            receipt_email: order.customer.email,
            customer: customer.id,
            statement_descriptor: `EchoHealth - for ${order.product.name}`
        }, (err, charge) => {
            if (err) {
                console.error(err);
            }

            // Update customer object
            fdb.crs('orders')
            let child = fdb.setChild(snap.key)
            child.update({ "product/id": charge.id })

            console.log(`Charge ${charge.id} made`);
        })
    });
});
