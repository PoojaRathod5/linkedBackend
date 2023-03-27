const express = require("express");
const app = express();
const { connection } = require("./db");
const { auth } = require("./middleware/auth.middleware");
const { postRouter } = require("./routes/post.routes");
const { userRouter } = require("./routes/user.routes");
require("dotenv").config();
app.use(express.json());

app.use("/users", userRouter);
app.use(auth);
app.use("/posts",postRouter);

app.listen(process.env.port, async () => {
    try {
        await connection;
        console.log("connected to db");
    } catch (err) {
        console.log("connection to db failed");
        console.log(err);
    }
    console.log(`Server isconnected at port ${process.env.port}`);
})

