import mongoose from "mongoose";

const DepositStatementSchema = new mongoose.Schema({
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

    deposit_method: {
        type: String,
        required: true,
        trim: true
    },

    broker_name: {
        type: String,
        required: true,
        trim: true
    },

    deposit_amount: {
        type: Number,
        required: true,
        trim: true,
    },

    deposit_balance_type: {
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

const DepositStatementModel = mongoose.model("DepositStatement", DepositStatementSchema);
export default DepositStatementModel