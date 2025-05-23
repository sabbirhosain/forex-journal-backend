import mongoose from "mongoose";

const TradeJournalSchema = new mongoose.Schema({
    date_and_time: {
        type: String,
        required: true,
    },

    date_and_time_format: {
        type: String,
        trim: true,
    },

    day_of_the_week: {
        type: String,
        required: true,
        trim: true,
        enum: ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    },

    time_of_day: {
        type: String,
        required: true,
        trim: true,
        enum: ['day', 'night']
    },

    forex_pair_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CurrencyPair",
        required: true,
    },

    forex_pair: {
        type: String,
        trim: true,
    },

    chart_time: {
        type: String,
        required: true,
        trim: true,
        enum: ['1m', '5m', '15m', '30m', '45m', '1h', '2h', '4h', '1d', '1w']
    },

    chart_analysis: {
        type: String,
        required: true,
        trim: true,
        enum: ['smc', 'mmc']
    },

    trading_statagy: {
        type: String,
        required: true,
        trim: true,
    },

    market_trand: {
        type: String,
        required: true,
        trim: true,
        enum: ['up_trand', 'down_trand', 'side_wadge']
    },

    market_session: {
        type: String,
        required: true,
        trim: true,
        enum: ['london', 'new_york', 'tokyo', 'sydney']
    },

    broker_name: {
        type: String,
        required: true,
        trim: true,
        default: 'exness'
    },

    broker_account_type: {
        type: String,
        required: true,
        trim: true,
        enum: ['real', 'demo']
    },

    trading_type: {
        type: String,
        required: true,
        trim: true,
        enum: ['scalping_trading', 'reversal_trading', 'breakout_trading', 'news_trading', 'swing_trading', 'position_trading', 'intraday_trading', 'market_trend', 'other']
    },

    lot_size: {
        type: String,
        required: true,
        trim: true,
        min: 0.01
    },

    buy_or_sell: {
        type: String,
        required: true,
        trim: true,
        enum: ['buy', 'sell']
    },

    risk_to_rewards: {
        type: String,
        required: true,
        trim: true,
        min: '1:1'
    },

    sl_or_tp_amounts: {
        type: String,
        required: true,
        trim: true,
    },

    trading_status: {
        type: String,
        required: true,
        trim: true,
        enum: ['profit', 'loss']
    },

    trade_close_by: {
        type: String,
        required: true,
        trim: true,
        enum: ['stop_loss', 'take_profit', 'close_manually', 'stop_loss_by_tralling']
    },

    notes: {
        type: String,
        trim: true,
    },

    attachment: {
        type: String,
        default: null
    },

}, { timestamps: true })

const TradeJournalModel = mongoose.model("TradeJournal", TradeJournalSchema);
export default TradeJournalModel