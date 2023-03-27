const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    if (token) {
        const decoded = jwt.verify(token, "masai");
        if (decoded) {
            // console.log(decoded);
            req.body.userID = decoded.userID;
            next();
        } else {
            res.status(400).send({ "msg": "Please login First" });
        }
    } else {
        res.status(400).send({ "msg": "Please login First" });;
    }
}

module.exports = {
    auth
}