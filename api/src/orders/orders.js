'use strict';

const config = require('config');
const joi = require('joi');
const firebaseManager = require('../util/firebaseManager')(config);
const Stripe = require('../util/stripeManager')(config);

module.exports = () => {

    // Set firebase
    let fb = new firebaseManager('echo');
    let stripe = new Stripe();

    class Orders {
        static feed() {
            return fb.crs('orders');
        }

        static child(key) {
            fdb.crs('orders')
            let child = fdb.setChild(key)
            return child;
        }
    }

    return Orders;
};
