const express = require("express");
const path = require("path");
const router = express.Router();
const Post = require("../models/Post");
const Category = require("../models/Category");
const User = require("../models/User");

router.get("/new", (req, res) => {
  if (req.session.userId) {
    Category.find({})
      .lean()
      .then((categories) => {
        return res.render("site/addpost", { categories: categories });
      });
  } else {
    res.redirect("/users/login");
  }
});

router.get("/category/:categoryId", async (req, res) => {
  await Post.find({})
    .populate({ path: "author", model: User })
    .sort({ $natural: -1 })
    .limit(3)
    .lean()
    .then((lastestPosts) => {
      Post.find({ category: req.params.categoryId })
        .populate({ path: "author", model: User })
        .populate({ path: "category", model: Category })
        .lean()
        .then((posts) => {
          Category.aggregate([
            {
              $lookup: {
                from: "posts",
                localField: "_id",
                foreignField: "category",
                as: "posts",
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                num_of_posts: {
                  $size: "$posts",
                },
              },
            },
          ]).then((categories) => {
            res.render("site/blog", {
              posts: posts,
              categories: categories,
              lastestPosts,
              lastestPosts,
            });
          });
        });
    });
});

router.get("/:id", async (req, res) => {
  await Post.find({})
    .populate({ path: "author", model: User })
    .sort({ $natural: -1 })
    .limit(3)
    .lean()
    .then((lastestPosts) => {
      Post.findById(req.params.id)
        .populate({ path: "author", model: User })
        .lean()
        .then((post) => {
          Category.aggregate([
            {
              $lookup: {
                from: "posts",
                localField: "_id",
                foreignField: "category",
                as: "posts",
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                num_of_posts: {
                  $size: "$posts",
                },
              },
            },
          ]).then((categories) => {
            res.render("site/post", {
              post: post,
              categories: categories,
              lastestPosts: lastestPosts,
            });
          });
        });
    });
});

router.post("/test", async (req, res) => {
  let post_image = req.files.post_image;
  post_image.mv(
    path.resolve(__dirname, "../public/img/postimages", post_image.name)
  );

  await Post.create({
    ...req.body,
    post_image: `/img/postimages/${post_image.name}`,
    author: req.session.userId,
  }).then(() => {
    req.session.sessionFlash = {
      type: "alert alert-success",
      message: "Postunuz başarılı bir biçimde yüklendi",
    };
    console.log("geldi");
    res.redirect("/blog");
  });
});

module.exports = router;
