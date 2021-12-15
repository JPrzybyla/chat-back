const express = require('express');
const router = express.Router();

const mysql = require("mysql2/promise");

router.post('/', async (req, res) => {
    const data = req.body

    //insert users credentials
    try{
        const connection = await mysql.createConnection({host:'localhost', user: 'root', database: 'chat'});

        //check if user with that login and id already exists
        const [rows, fields] = await connection.execute('SELECT * FROM users WHERE login=? OR id=?', [data.login, data.id])

        //if yes throw error
        if(rows.length>0)
            res.status(200).send({message: "user with that login already registered"})
        else{
            try{
                //if not try to insert
                await connection.execute("INSERT INTO `users`(`login`, `password`, `name`, `pin`, `public_key`, `id`) VALUES (?,?,?,?,?,?)", [
                    data.login,
                    data.password,
                    data.name,
                    data.pin,
                    data.rsaPublicKey,
                    data.id
                ]);
                res.status(201).send({message: 'user registered'})
            }
            catch (error){
                switch (error.errno){
                    case -4078:
                        res.status(500).send({message: 'db down'})
                        break;
                    default:
                        res.status(500).send({message: 'db down'})
                        break;
                }
            }
        }
        await connection.end()
    }
    catch (error){
        switch (error.errno){
            case -4078:
                res.status(500).send({message: 'db down'})
                break;
            default:
                res.status(500).send({message: 'db down'})
                break;
        }
    }


})

module.exports = router;