const hmacsha = require('crypto-js/hmac-sha256');
const getDate = require('./date');
const salt = require('../secret/secret')

const jwtCreate = (queryResult) => {

    const header = {
        alg: 'hs256',
        typ: 'jwt',
        jwtType: 'auth'
    }
    const body = {
        isAuth: 'true',
        name: queryResult.name,
        id: queryResult.id,
        timeStamp: getDate(0),
        expires: getDate(1)
    }

    const headerBase64 = Buffer.from(JSON.stringify(header), 'binary').toString('base64')
    const bodyBase64 = Buffer.from(JSON.stringify(body), 'binary').toString('base64')

    const signature = hmacsha(`${headerBase64}.${bodyBase64}`, salt).toString()

    const jwt = `${headerBase64}.${bodyBase64}.${signature}`

    return jwt

}

module.exports = jwtCreate