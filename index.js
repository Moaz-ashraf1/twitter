const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config({
    path: '.env'
});

const app = express();
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRouter')

const { globalErrorHandler } = require("./middleware/errorMiddleware")

app.use(express.json())
app.use(morgan('dev'))

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)


const port = 8000
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

//DB
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("connecting to database successfully");
})


app.use(globalErrorHandler)