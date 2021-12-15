const NodeRSA = require('node-rsa');
const rsaPublicKey = require('../secret/rsaPublic')
const getDate = require("./date");
const hmacsha = require('crypto-js/hmac-sha256');
const salt = require('../secret/secret')

const sessionToken = (login, password) => {
    const key = new NodeRSA();
    key.importKey(rsaPublicKey, 'pkcs8-public')

    //hashing with rsa credentials in case somebody stole hashes form sessionHash token (so they are double encrypted so it means they're usless)
    const loginHash = key.encrypt(login, 'base64', 'utf-8')
    const passwordHash = key.encrypt(password, 'base64', 'utf-8')

    const header = {
        alg: 'hs256',
        typ: 'jwt',
        jwtType: 'session'
    }
    const body = {
        login: loginHash,
        password: passwordHash,
        timeStamp: getDate(0),
        expires: getDate(30)
    }

    const headerBase64 = Buffer.from(JSON.stringify(header), 'binary').toString('base64')
    const bodyBase64 = Buffer.from(JSON.stringify(body), 'binary').toString('base64')

    const signature = hmacsha(`${headerBase64}.${bodyBase64}`, salt).toString()

    const sessionToken = `${headerBase64}.${bodyBase64}.${signature}`

    return sessionToken
}

module.exports = sessionToken
