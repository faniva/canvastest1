const express = require('express')
const debug = require('debug')('http')
const logger = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

const port = process.env.port
console.log(port)

app.use(bodyParser.json())
app.use(cors({origin: '*'}))
app.use(logger('dev'))
app.use('/public', express.static(__dirname + '/public'))
app.set('view engine', 'ejs')

app.get('/', (req,res,next) => {
    res.render('index', { title: 'Canvas Controls'})
})

app.listen(port, function(){
    debug('app listening on port', port)
})