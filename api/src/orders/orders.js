'use strict';

exports = module.exports = (joi, firebaseManager) => {

    // Set firebase
    let fb = new firebaseManager('/orders');

    class Base {
        static root() {
            return { message: 'Echo test world!' }
        }

        static saveData(post) {
            return fb.save(post);
        }

        static list() {
            return new Promise((res, rej) => {
                fb.readByKey(key)
                .then((data) => {
                    res(data);
                })
                .catch((err) => {
                    rej(err);
                });
            })
        }
    }

    return Base;
};

exports['@require'] = ['joi', 'util/firebaseManager'];
exports['@singleton'] = true;
