const express = require('express')
const router = express.Router()
const User = require('../models/User')


router.get('/signup', (req, res) => {
  res.render('site/signup');
})

router.post('/signup', (req, res) => {
  User.create(req.body).then((user, error) => {
    req.session.sessionFlash = {
      type: 'alert alert-success',
      message: 'Kullanıcı Başarılı bir şekilde kayıt oldu.'
    }
    res.redirect("/users/login")
  })
})

router.get('/login', (req, res) => {
  res.render('site/login');
})

router.post('/login', (req, res) => {
  const {email, password} = req.body;

  User.findOne({email}).then((user, error) => {
    if (user){
      if(user.password === password) {
        req.session.userId = user._id
        res.redirect("/")
      } else {
        res.redirect("/users/login")
      }
    } else {
      console.log(error)
      res.redirect("/users/signup")
    }
  })
})

module.exports = router