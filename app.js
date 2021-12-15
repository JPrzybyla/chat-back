const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(8080);


const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const veriyfyToken = require('./routes/verifyToken')

app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/verifyToken', veriyfyToken)
