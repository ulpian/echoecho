'use strict';

exports = module.exports = (joi, config) => {
    // Set routes array for Hapi
    let routes = [];
    let orders = require('../src/orders/orders')();
    let fdb = require('../util/firebaseManager')(config);
    let Stripe = require('../util/stripeManager')(config);

    routes.push({
        method: 'GET',
        path: '/orders/feed',

        config: {
            description: 'List all orders coming in.',
            notes: 'Long polling on new orders - returns JSON object of order',
            tags: ['orders']
        },

        handler: (request, reply) => {
            let stream = require('stream').Readable();
            stream._read = (size) => {
                orders.feed().on('child_added', (orderSnap) => {
                    // Customer creation
                    Stripe.saveCustomer(orderSnap.val())
                    .then((order) => {

                        // Update customer object
                        orders.child(orderSnap.key)
                        .update({ "customer/id": order.customer.id })

                        console.log(`Customer, ${order.customer.name} created and set with Stripe id: ${order.customer.id}`)

                        // Charge made
                        Stripe.charge(order)
                        .then((charge) => {
                            // Update customer object
                            orders.child(orderSnap.key)
                            .update({ "product/id": charge.id })
                        })
                        .catch((err) => {
                            console.error(err);
                        })
                    })
                    .catch((err) => {
                        console.error(err);
                    });
                    stream.push(JSON.stringify(order.val()));
                });
            };
            reply(stream);
        }
    });

    return routes;
};

exports['@require'] = ['joi', 'config'];
exports['@singleton'] = true;
