const express = require('express')
const path = require('path')
const router = express.Router()
const Post = require('../models/Post')
const Category = require('../models/Category')


router.get('/new', (req, res) => {
  if(req.session.userId) {
    Category.find({}).lean().then((categories) => {
      return res.render('site/addpost', {categories: categories});
    })
  } else {
    res.redirect("/users/login")
  }
})

router.get('/:id', async (req, res) => {
  await Post.findById(req.params.id).lean().then((post) => {
    Category.find({}).lean().then((categories) => {
      res.render('site/post', {post: post, categories: categories})
    })
  })
})

router.post('/test', async (req, res) => {
  let post_image = req.files.post_image
  post_image.mv(path.resolve(__dirname, '../public/img/postimages', post_image.name))

  await Post.create({
    ...req.body,
    post_image: `/img/postimages/${post_image.name}`
  }).then(() => {
    req.session.sessionFlash = {
      type: 'alert alert-success',
      message: 'Postunuz başarılı bir biçimde yüklendi'
    }
    console.log("geldi")
    res.redirect("/blog")
  })
})

module.exports = router
