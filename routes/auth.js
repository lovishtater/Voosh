const router = require('express').Router();

// Importing the controllers
const {
  signup,
  signin,
  signout,
  userSignupValidator,
  userSigninValidator,
} = require("../controllers/auth");


// Routes
router.post("/addUser", userSignupValidator,  signup);
router.post("/loginUser", userSigninValidator,  signin);
router.get("/signout", signout);

module.exports = router;