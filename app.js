const path = require('path')
const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const exhbs = require('express-handlebars')
const dayFormat = require('./helpers/dayFormat');
const app = express()
const port = 3000
const hostName = '127.0.0.1'

mongoose.connect('mongodb://127.0.0.1:27017/nodeblog_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

app.use(fileUpload())

app.use(express.static('public'))

app.engine('handlebars', exhbs.engine({helpers: {dayFormat: dayFormat}}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

const main = require('./routes/main')
app.use('/', main)

const posts = require('./routes/posts');
app.use('/posts', posts)


app.listen(port, hostName, () => {
  console.log(`Server Çalışıyor, http://${hostName}:${port}/`)
})