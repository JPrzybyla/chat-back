const express = require('express');
const hmacsha = require("crypto-js/hmac-sha256");
const salt = require("../secret/secret");

const loginFromToken = require('../scripts/loginFromToken')

const router = express.Router();

router.post('/', async (req, res) => {

    // get sended token and verify the signature
    const token = {
        header: req.body.token.split('.')[0],
        body: req.body.token.split('.')[1],
        signature: req.body.token.split('.')[2],
    }

    const signature = hmacsha(`${token.header}.${token.body}`, salt).toString()

    if(signature===token.signature){
        //if signature is correct chceck for its type
        const type = Buffer.from(token.header, 'base64').toString('utf-8')

        switch (JSON.parse(type).jwtType){
            case 'auth':
                //if it's auth send user further
                res.status(200).send({message: 'authorized'})
                break;
            case 'session':
                //if it's session token try to auth user with credentials inside, if credentials are correct create a auth token for user
                if(await loginFromToken(token.body)!==false){
                    res.status(200).send({jwt: await loginFromToken(token.body)})
                }
                else
                    res.status(400).send({message: 'wrong credentials'})
                break;
            default:
                break;
        }
    }
    else
        res.status(400).send({message: 'unauthorized'})

})

module.exports = router