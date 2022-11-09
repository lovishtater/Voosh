const Order = require("../models/orderSchema");

exports.createOrder = (req, res, next) => {
    const order = new Order({
        user_id: req.body.user_id,
        sub_type: req.body.sub_type,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address
    });
    order
        .save()
        .then(result => {
        res.status(201).json({
            message: "Order created successfully",
            order: result
        });
        })
        .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
        });
    };

exports.getOrder = (req, res, next) => {
    console.log("req.userId", req.userId, req.params.userId);
    const userId = req.params.userId;
    Order.find({ user_id: userId })
        .then(order => {
        if (!order) {
            const error = new Error("Could not find order.");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: "Order fetched", order: order });
        })
        .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
        });
    };
