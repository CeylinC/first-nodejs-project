const express = require("express");
const router = express.Router();
const Category = require("../../models/Category");

router.get("/", (req, res) => {
  res.render("admin/admin");
});

router.get("/categories", (req, res) => {
  Category.find({}).sort({$natural: -1})
    .lean()
    .then((categories) => {
      res.render("admin/categories", { categories: categories });
    });
});

router.post("/categories", (req, res) => {
  Category.create(req.body).then((category, error) => {
    if (!error) {
      res.redirect("categories");
    }
  });
});

router.delete("/categories/:id", (req, res) => {
  Category.findByIdAndDelete(req.params.id).then((category, error) => {
    if (!error) {
      res.redirect("/admin/categories");
    }
  });
});

module.exports = router;
