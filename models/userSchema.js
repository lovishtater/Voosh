const moongoose = require('mongoose');
const uuidv1 = require("uuid").v1;
const crypto = require("crypto");
const userSchema = new moongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 64
    },
    phoneNumber: {
        type: String,
        trim: true,
        maxlength: 32
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    salt: {
        type: String,
        required: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    orders: [
        {
            type: moongoose.Schema.Types.ObjectId,
            ref: "Order"
        }
    ]
}, { timestamps: true });

// Virtual field
userSchema.virtual("password")
    .set(function (password) {
        this._password = password;
        this.salt = uuidv1();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

userSchema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    // Encrypt password
    encryptPassword: function (password) {
        if (!password) return "";
        try {
            return crypto
                .createHmac("sha1", this.salt)
                .update(password)
                .digest("hex");
        } catch (err) {
            return "";
        }
    }
}; 

module.exports = moongoose.model("User", userSchema);

