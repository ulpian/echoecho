'use strict';

exports = module.exports = (joi, orders) => {
    // Set routes array for Hapi
    let routes = [];

    routes.push({
        method: 'GET',
        path: '/orders/list',

        config: {
            description: 'List all orders coming in.',
            notes: 'Long polling on new orders - returns JSON object of order',
            tags: ['orders']
        },

        handler: (request, reply) => {
            let someData = orders.list()
            .then((data) => {
                reply({ data: data });
            })
            .catch((err) => {
                reply({ error: err })
            })
        }
    })

    return routes;
};

exports['@require'] = ['joi', 'orders/orders'];
exports['@singleton'] = true;
