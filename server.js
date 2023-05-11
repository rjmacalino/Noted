require ('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3500
const path = require('path')
const { logger, logEvents} = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')

const connectDb = require('./config/dbConn')
const mongoose = require('mongoose')

connectDb()


console.log(`${process.env.NODE_ENV} mode`)

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

app.use(express.static(path.join(__dirname, '/public')))

app.use('/', require('./routes/root'))

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
        return;
    }
    else if (req.accepts('json')) {
        res.json({ message: '404 Not found' })
        return;
    }
    else {
        res.type('txt').send('404 Not found')
    }
});

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`)
    })
})

mongoose.connection.on('error', (err) => {
    console.log(err)
    // log using logEvents function - error.no error.code tab error.syscall tab error.hostname in mongoErrorLog.log
    logEvents(`${err.name}:${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrorLog.log');

})


