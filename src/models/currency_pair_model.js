import mongoose from "mongoose";
const CurrencyPairSchema = new mongoose.Schema({
    currency_pair: {
        type: String,
        required: true,
        trim: true
    },
    currencies_involved: {
        type: String,
        required: true,
        trim: true
    },
    volatility: {
        type: String,
        required: true,
        trim: true,
        enum: ['high', 'medium', 'low']
    },
    liquidity: {
        type: String,
        required: true,
        trim: true,
        enum: ['high', 'medium', 'low']
    },
    open_and_close_time: {
        type: String,
        required: true,
        trim: true
    },
    open_and_close_day: {
        type: String,
        required: true,
        trim: true
    },
    session_and_time: {
        type: [{
            session_name: {
                type: String,
                required: true,
                trim: true,
                enum: ['london', 'new_york', 'tokyo', 'sydney']
            },
            start_to_end_time_gmt: {
                type: String,
                required: true,
                trim: true
            },
            start_to_end_time_bdt: {
                type: String,
                required: true,
                trim: true
            },
        }],
        required: true
    },
    best_session_to_trade: {
        type: String,
        required: true,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    },
}, { timestamps: true })

const CurrencyPairModel = mongoose.model("CurrencyPair", CurrencyPairSchema);
export default CurrencyPairModel