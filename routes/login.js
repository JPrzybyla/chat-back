const express = require('express');
const router = express.Router();

const connectAsync = require('../db/connectAsync');
const jwtCreate = require('../scripts/jwtCreate');
const sessionToken = require('../scripts/sessionJwtCreate');
const mysql = require("mysql2/promise");


router.post('/', async (req, res) => {

    const data = req.body;

    if(data.login===''||data.password===''){
        res.status(400).send({message: 'bad credentials'});
    }
    else{
        try{
            const connection = await mysql.createConnection({host:'localhost', user: 'root', database: 'chat'});
            const [rows, fields] = await connection.execute("SELECT * FROM users WHERE login= ? AND password= ?;", [
                data.login,
                data.password
            ]);
            await connection.end()
            if(rows.length>0)
                res.status(200).send({jwt: jwtCreate(rows[0]), session: sessionToken(data.login, data.password)})
            else
                res.status(401).send({message: "wrong credential"})
        }
        catch (error){
            console.log(error)
            switch (error.errno){
                case -4078:
                    res.status(500).send({message: 'db down'})
                    break;
            }
        }
    }
})

module.exports = router;