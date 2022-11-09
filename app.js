require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// My routes
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/order");

mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("DB CONNECTED");
    }
    );

app.use("/api", authRoutes);
app.use("/api", orderRoutes);
app.use("/", (req, res) => {
    res.send("Welcome to Voosh backend API server");
});

app.listen(port, () => {
    console.log(`App is running at ${port}`);
});

