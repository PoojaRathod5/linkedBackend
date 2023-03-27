//creatin model for declaring schema of Posts
const mongoose = require("mongoose");

const postSchema= mongoose.Schema({
    title: String,
    body: String,
    device: String,
    no_of_comments: Number,
    userID: String
},{
    versionKey: false
})

//delcaring model
const PostModel= mongoose.model("post",postSchema);

module.exports = {
    PostModel
}