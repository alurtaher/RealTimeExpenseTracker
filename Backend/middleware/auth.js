const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticate = (req, res, next) => {
  try {
    const token = req.header("authorization");
    console.log(token);
    const user = jwt.verify(token, "secretKey");
    console.log("userID >>>>>>>>>",user.userId)
    User.findByPk(user.userId)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        throw new Error(err);
      });
    } 
  catch (error) {
    console.log(error)
    return res.status(401).json({success :false})
  }
};


module.exports = {
    authenticate
}