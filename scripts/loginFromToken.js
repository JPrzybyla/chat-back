const rsaPrivateKey = require('../secret/rsaPrivate')
const NodeRSA = require("node-rsa");
const queryAsync = require('../db/connectAsync')
const jwtCreate = require("../scripts/jwtCreate");

const loginFromToken = async (credentials) => {

    const rawCredentials = JSON.parse(Buffer.from(credentials, 'base64').toString('utf-8'))
    //create a key pair and decrypt login and password hash
    const key = new NodeRSA();
    key.importKey(rsaPrivateKey, 'pkcs8-private')

    const fixedCredentials = {
        login: key.decrypt(rawCredentials.login, 'utf-8'),
        password: key.decrypt(rawCredentials.password, 'utf-8')
    }
    const queryResult = await queryAsync(`SELECT * FROM users WHERE login='${fixedCredentials.login}' AND password='${fixedCredentials.password}';`)
    if(queryResult.length>0){
        return jwtCreate(queryResult[0])
    }
    else
        return false
}

module.exports = loginFromToken