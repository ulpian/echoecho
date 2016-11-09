'use strict';

const stripe = require('stripe');

module.exports = (config) => {

    class Stripe {
        constructor(order) {
            this.stripe = stripe(config.Base.stripeKey);
        }

        setOrder(order) {
            this.order = order;
        }

        saveCustomer(order) {
            return new Promise((res, rej) => {
                // Expiry data clean
                let expiry = order.payment.details.expiry.split('/');

                this.stripe.create({
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
                        rej(err);
                    }
                    order.customer.id = customer.id;

                    res(order);
                });
            });
        }

        charge(order) {
            return new Promise((res, rej) => {
                this.stripe.create({
                    amount: parseFloat(order.product.price) * 100,
                    currency: 'gbp',
                    description: order.product.name,
                    receipt_email: order.customer.email,
                    customer: order.customer.id,
                    statement_descriptor: `EchoHealth - for ${order.product.name}`
                }, (err, charge) => {
                    if (err) {
                        rej(err);
                    }
                    res(charge);
                });
            });
        }
    }

    return Stripe;
};
