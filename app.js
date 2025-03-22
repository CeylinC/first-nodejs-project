const methodOverride = require('method-override')
const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const exphbs = require('express-handlebars')
const expressSession = require('express-session')
const MongoStore = require('connect-mongo');
const helpers = require('./helpers/hbs');
const app = express()
const port = 3000
const hostName = '127.0.0.1'

mongoose.connect('mongodb://127.0.0.1:27017/nodeblog_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

app.use(fileUpload())
app.use(methodOverride('_method'))
app.use(expressSession({
  secret: "testio",
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: 'mongodb://127.0.0.1:27017/nodeblog_db',
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60
  })
}))

app.use(express.static('public'))

const hbs = exphbs.create({
  helpers: helpers
});

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//Edit Links
app.use((req, res, next) => {
  const {userId} = req.session

  if(userId) {
    res.locals = {
      displayLink: true
    }
  } else {
    res.locals = {
      displayLink: false
    }
  }
  next()
})

//Flash Card
app.use((req, res, next) => {
  res.locals.sessionFlash = req.session.sessionFlash
  delete req.session.sessionFlash
  next()
})

const main = require('./routes/main')
const users = require('./routes/users')
const posts = require('./routes/posts')
const admin = require('./routes/admin/index')

app.use('/', main)
app.use('/posts', posts)
app.use('/users', users)
app.use('/admin', admin)


app.listen(port, hostName, () => {
  console.log(`Server Çalışıyor, http://${hostName}:${port}/`)
})