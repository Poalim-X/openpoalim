const request = require('request-promise-native');
const https = require('https');
const fs = require ('fs');

const subscriptionKey = process.env.SUBSCRIPTION_KEY;
const clientId = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

async function auth() {
    try {
        var response = await request({
            url: 'https://api.pre.bankhapoalim.co.il/bank/auth/clients/token',
            method: 'POST',
            key: fs.readFileSync('zappreopenapi.pem'),
            cert: fs.readFileSync('zappreopenapi.crt'),
            passphrase: '123-abcd',
            headers: {
                'Ocp-Apim-Subscription-Key': subscriptionKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: {
                'Client_id': clientId,
                'Client_secret': clientSecret,
                'response_type': 'token',
                'Scope': 'public'
            }
        });

        console.log ("!! " + JSON.parse(response).access_token);
        return JSON.parse(response).access_token;

    } catch (error) {
        console.error("failed calling auth API", error);
    }
}

async function getBranchInfo(access_token, branch_id) {
    try {
        var response = await request({
            url: 'https://api.pre.bankhapoalim.co.il/public/obs/open-data/v1/banks/12/branches/' + branch_id,
            method: 'GET',
            key: fs.readFileSync('zappreopenapi.pem'),
            cert: fs.readFileSync('zappreopenapi.crt'),
            passphrase: '123-abcd',
            headers: {
                'Ocp-Apim-Subscription-Key': subscriptionKey,
                'Authorization' : 'Bearer ' + access_token
            }
        });

        console.log (response);
        return response;

    } catch (error) {
        console.error("failed calling auth API", error);
    }
}


module.exports.auth = auth;
module.exports.getBranchInfo = getBranchInfo;