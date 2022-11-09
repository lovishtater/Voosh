const {
    createOrder,
    getOrder,
} = require('../controllers/order');

const express = require('express');
const router = express.Router();
router.param("userId", (req, res, next, userId) => {
    req.userId = userId;
    next();
});
router.post('/add-order', createOrder);
router.get('/get-order/:userId', getOrder);

module.exports = router;