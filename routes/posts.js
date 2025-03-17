const express = require('express')
const path = require('path')
const router = express.Router()
const Post = require('../models/Post')

router.get('/new', (req, res) => {
  res.render('site/addpost');
})

router.get('/:id', async (req, res) => {
  await Post.findById(req.params.id).lean().then((post) => {
    res.render('site/post', {post: post})
  })
})

router.post('/test', async (req, res) => {
  let post_image = req.files.post_image
  post_image.mv(path.resolve(__dirname, '../public/img/postimages', post_image.name))

  await Post.create({
    ...req.body,
    post_image: `/img/postimages/${post_image.name}`
  }).then(() => {
    res.redirect("/")
  })
})

module.exports = router
