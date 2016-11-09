'use strict';

const firebase = require('firebase');

module.exports = (config) => {

    class Firebase {
        constructor(ref) {
            let fb = firebase.initializeApp(config.Base.firebase);
            this.db = fb.database();
            this.ref = this.db.ref(ref);
            this.dbinfo = {
                ref: ref
            }
        }

        crs(node) {
            this.ref = this.db.ref(this.dbinfo.ref + '/' + node)
            return this.ref
        }

        setChild(child) {
            return this.child = this.ref.child(child);
        }

        save(data) {
            let newObj = this.ref.push();
            newObj.set(data)
            return newObj.key;
        }

        readByKey(key) {
            let dataList = [];
            return new Promise((res, rej) => {
                let readObj = this.ref.orderByKey().equalTo(key)
                .once("value", (snapshot) => {
                    snapshot.forEach((data) => {
                        dataList.push(data.val());
                    })

                    res(dataList);
                })
            })
        }
    }

    return Firebase;
};
