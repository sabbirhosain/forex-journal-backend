import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const AuthSchema = new mongoose.Schema({
    join_date: {
        type: Date,
        required: true,
        default: Date.now()
    },

    first_name: {
        type: String,
        required: true,
        trim: true
    },

    last_name: {
        type: String,
        required: true,
        trim: true
    },

    full_name: {
        type: String,
        trim: true
    },

    user_name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },

    phone: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },

    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        },
    },

    password: {
        type: String,
        required: true,
        trim: true,
        min: [3, 'password must be greater than 3'],
        set: (value) => bcrypt.hashSync(value, bcrypt.genSaltSync(10))
    },

    address: {
        type: String,
        trim: true,
        default: null
    },

    attachment: {
        type: String,
        default: null
    },

}, { timestamps: true })

const AuthModel = mongoose.model("Authentication", AuthSchema);
export default AuthModel