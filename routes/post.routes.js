const { query } = require("express");
const express = require("express");
const postRouter = express.Router();
const jwt = require("jsonwebtoken");
const { PostModel } = require("../model/post.model");

// get all posts
postRouter.get("/", async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "masai");

    try {
        if (decoded) {
            const filters = { "userID": decoded.userID };
            if (req.query.user) {
                filters.userID = req.query.user;          // added a query for userID based filtering
            }
            if (req.query.minComments && req.query.maxComments) {
                query.comments = { $gte: Number(req.query.minComments), $lte: Number(req.query.maxComments) }; //added  filer for minimum comments
            }


            const count = await PostModel.countDocuments(filters);
            const posts = await PostModel.find(filters).skip((Number(req.query.page) - 1) * 3).limit(3);
            res.status(200).send(posts);




        }
    } catch (err) {
        res.status(400).send(err.message);
    }
})

//add a new post
postRouter.post("/add", async (req, res) => {
    try {
        const post = new PostModel(req.body);
        await post.save();
        res.status(200).send({ "msg": "A new post has been added" })
    } catch (err) {
        res.status(400).send(err.message);
    }
})

//top3
postRouter.get("/top", async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "masai");
    try {
        if (decoded) {
            const posts = await PostModel.aggregate([
                { $match: decoded.userID },
                { $sort: { comments: -1 } },
                { $limit: 3 }
            ]);
            res.status(200).send(posts);
        }
    } catch (err) {
        res.status(400).send(err.message);
    }
})

//update post
postRouter.patch("/update/:postID", async (req, res) => {
    const payload = req.body;
    const postID = req.params.postID;
    try {
        await PostModel.findByIdAndUpdate({ _id: postID }, payload);
        res.status(200).send({ "msg": "Post has been updated" })
    } catch (err) {
        res.status(400).send(err.message);
    }
})

//delete a post
postRouter.delete("/delete/:postID", async (req, res) => {
    const postID = req.params.postID;
    try {
        const deletedPost = await PostModel.findByIdAndDelete({ _id: postID });
        if (!deletedPost) {
            return res.status(400).send({ "msg": "Post not found" })
        }
        res.status(200).send({ "msg": "Post deleted succesfully" })
    } catch (err) {
        res.status(400).send(err.message);
    }
})

module.exports = {
    postRouter
}
