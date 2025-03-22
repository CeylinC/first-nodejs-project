const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const Category = require('../models/Category')
const User = require('../models/User')

router.get('/', (req, res) => {
  res.render('site/index');
})

router.get('/about', (req, res) => {
  res.render('site/about');
})

router.get('/blog', (req, res) => {
  Post.find({}).populate({path: 'author', model: User}).sort({$natural: -1}).lean().then((posts) => {
    Category.aggregate([{
      $lookup: {
        from: 'posts',
        localField: '_id',
        foreignField: 'category',
        as: 'posts'
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        num_of_posts: {
          $size: '$posts'
        }
      }
    }]).then((categories) => {
      res.render('site/blog', {posts: posts, categories: categories, lastestPosts: posts.slice(0,3)});
    })
  })
})

router.get('/contact', (req, res) => {
  res.render('site/contact');
})

module.exports = router
