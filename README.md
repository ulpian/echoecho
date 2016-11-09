# echoecho
Echo test

### Problem & solution
There are 2 folders in this repo; written as a simple test for;

Using Node.js, Firebase and Stripe, to implement a clean and minimal solution that for every new order in the Firebase database creates a new customer & charge on Stripe and updates the order with the customer & charge id returned by the Stripe API.

Order json structure;
```
{
    "O1": {
        "customer": {
            "id": "C1",
            "name": "John Smith",
            "email": "john@smith.com"
        },
        "product": {
            "id": "I1",
            "name": "Item",
            "price": 3.99
        },
        "payment": {
            "type": "card",
            "details": {
                "number": "4000 0566 5566 5556",
                "expiry": "02/2020",
                "cvc": 222
            }
        }
    }
}
```

### Execution
This test is written in 2 parts; 1 as a script to execute upon the test and another as part of a wider IOC-Hapijs api as this proposal has many possible solutions.

*Running script*
`npm start`

*Testing script*
`npm test`

The API was written to provide a more real-world API example of solving the issue.

*Running API*
`npm run api`

*Testing API*
`npm run api-test`

### Note
You will need to set 2 environment variables for firebase and stripe to make this test work;
Open your `~/.profile` or `~/.bashrc` files and export;

```
export FIREBASE_APIKEY=api key
export FIREBASE_ACCOUNT_CRED=account credentials json file.json
export STRIPE_KEY=stripe secret key
```
