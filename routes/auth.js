const router = require('express').Router();

// Importing the controllers
const {
  signup,
  signin,
  signout,
  userSignupValidator,
  userSigninValidator,
  runValidation,
} = require("../controllers/auth");


// Routes
router.post("/addUser", userSignupValidator, runValidation, signup);
router.post("/loginUser", userSigninValidator, runValidation, signin);
router.get("/signout", signout);

module.exports = router;