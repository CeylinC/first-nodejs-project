const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  date: {type: Date, default: Date.now},
  category: {type: Schema.Types.ObjectId, ref: 'Category'},
  post_image: {type: String, require: true}
})

module.exports = mongoose.model('Post', PostSchema)