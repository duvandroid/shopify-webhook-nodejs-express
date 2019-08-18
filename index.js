console.log("\n");
console.log("### Shopify WebHook (NodeJS/Express) ###");
console.log("\n");

const express = require('express');
const bodyParser = require('body-parser');
const getRawBody = require('raw-body');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(bodyParser.text()); // Get Row Data
app.use(bodyParser.urlencoded({extended: true}));

const SECRET = process.env.SECRET;

async function checkWebHookIntegrity(req) {
    return await new Promise(resolve => {
        const a = getRawBody(req);
        return resolve(a)
    });
}

app.post('/webhook', (req, res) => {
    checkWebHookIntegrity(req)
        .then(raw => {
            const digest = crypto.createHmac('sha256', SECRET)
                .update(raw)
                .digest('base64');
            if (digest === req.headers['x-shopify-hmac-sha256']) {
                req.body = JSON.parse(raw.toString('utf-8'));
                console.log("Integrity is validated!", req.body);
                // process webhook payload
                return res.status(200).send(req.body);
            } else {
                console.log('Error with request', req.body);
                return res.status(401).send();
            }
        })
        .catch(err => {
            console.log(e);
            return res.status(500).send();
        });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});