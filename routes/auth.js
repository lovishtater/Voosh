const router = require('express').Router();

// Importing the controllers
const {
  signup,
  signin,
  signout,
  isSignedIn,
  userSignupValidator,
  userSigninValidator,
} = require("../controllers/auth");


// Routes
router.post("/addUser",  userSignupValidator, signup);
router.post("/login", userSigninValidator, signin);
router.get("/signout", signout);
router.get("/testroute", isSignedIn, (req, res) => {
  res.send("A protected route");
});
module.exports = router;