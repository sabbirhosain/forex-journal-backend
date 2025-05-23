import mongoose from "mongoose";

const BankStatementSchema = new mongoose.Schema({
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

    transfer_from: {
        type: String,
        required: true,
        trim: true,
    },

    transfer_to: {
        type: String,
        required: true,
        trim: true,
    },

    transfer_amount: {
        type: Number,
        required: true,
        trim: true,
    },

    transfer_balance_type: {
        type: String,
        required: true,
        trim: true,
        enum: ['usd', 'bdt']
    },

    transfer_regsion: {
        type: String,
        required: true,
        trim: true,
    },

    attachment: {
        type: String,
        default: null
    },

}, { timestamps: true })

const BankStatementModel = mongoose.model("BankStatement", BankStatementSchema);
export default BankStatementModel