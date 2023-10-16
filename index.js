const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config({
    path:'.env'
});

const app = express();
const authRouter = require('./routes/authRouter')

app.use(express.json())
app.use(morgan('dev'))

app.use('/api/v1/auth' ,authRouter)

const port  = 8000
app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});

//DB
mongoose.connect(process.env.MONGODB_URI ).then(()=>{
    console.log("connecting to database successfully");
})
