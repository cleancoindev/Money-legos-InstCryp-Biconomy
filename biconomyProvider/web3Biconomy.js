const Web3 = require('web3');
import Biconomy from "@biconomy/mexa";

let web3Biconomy;
let provider;
let biconomy;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    provider = window.web3.currentProvider;

} else {
    // we are in the server and matamask is not using by user
    provider = new Web3.providers.HttpProvider (
        'https://kovan.infura.io/v3/944f5399c18049d9920b3bc9c60583de'
    );
}

// Kovan
biconomy = new Biconomy(provider,
    {
        dappId: '5e8cbe20f64c16288c945059', 
        // apiKey: 'qWHGmIDMd.9dddd0c2-cee2-476f-a60b-6d7b42dde2b2'
        apiKey: '7szR3RE8l.fb67b322-1f4e-40b5-91fd-b9a036962a13',
        debug:true
    });
web3Biconomy = new Web3(biconomy);

module.exports = web3Biconomy



