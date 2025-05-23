import mongoose from "mongoose";

const WithdrawStatementSchema = new mongoose.Schema({
    date_and_time: {
        type: Date,
        required: true,
        default: Date.now()
    },

    date_and_time_format: {
        type: String,
        required: true,
        trim: true,
    },

    broker_name: {
        type: String,
        required: true,
        trim: true,
    },

    withdraw_method: {
        type: String,
        required: true,
        trim: true,
    },

    withdraw_amount: {
        type: Number,
        required: true,
        trim: true,
    },

    withdraw_balance_type: {
        type: String,
        required: true,
        trim: true,
        enum: ['usd', 'bdt']
    },

    notes: {
        type: String,
        required: true,
        trim: true,
    },

    attachment: {
        type: String,
        default: null
    },

}, { timestamps: true })

const WithdrawStatementModel = mongoose.model("WithdrawStatement", WithdrawStatementSchema);
export default WithdrawStatementModel