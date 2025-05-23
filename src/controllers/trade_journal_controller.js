import mongoose from "mongoose";
import TradeJournalModel from "../models/trade_journal_model.js";
import CurrencyPairModel from "../models/currency_pair_model.js";
import { formatDateTime } from "../utils/helper.js";

export const create = async (req, res) => {
    try {
        const { date_and_time, day_of_the_week, time_of_day, forex_pair_id, chart_time, chart_analysis, trading_statagy, market_trand, market_session, broker_name, broker_account_type, trading_type, lot_size, buy_or_sell, risk_to_rewards, sl_or_tp_amounts, trading_status, trade_close_by, notes } = req.body;
        console.log(date_and_time);

        const requiredFields = ['date_and_time', 'day_of_the_week', 'time_of_day', 'forex_pair_id', 'chart_time', 'chart_analysis', 'trading_statagy', 'market_trand', 'market_session', 'broker_name', 'broker_account_type', 'trading_type', 'lot_size', 'buy_or_sell', 'risk_to_rewards', 'sl_or_tp_amounts', 'trading_status', 'trade_close_by'];

        for (let field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ [field]: 'Field is required' });
            }
        }

        // Validate the mongoose id
        if (!mongoose.Types.ObjectId.isValid(forex_pair_id)) {
            return res.json({ success: false, message: "Invalid ID format" });
        }

        // check currency pair exist or not
        const findOne = await CurrencyPairModel.findById(forex_pair_id);
        if (!findOne) {
            return res.json({ message: "Item not found" });
        }

        // existing data chack
        const existing = await TradeJournalModel.exists({ date_and_time: date_and_time });
        if (existing) {
            return res.json({
                success: false,
                message: "Date and time is already exist."
            });
        }

        // store the trade value
        const result = await new TradeJournalModel({
            date_and_time: date_and_time,
            date_and_time_format: formatDateTime(date_and_time),
            day_of_the_week: day_of_the_week,
            time_of_day: time_of_day,
            forex_pair_id: findOne._id,
            forex_pair: findOne.currency_pair,
            chart_time: chart_time,
            market_session: market_session,
            broker_name: broker_name,
            trading_type: trading_type,
            broker_account_type: broker_account_type,
            lot_size: lot_size,
            sl_or_tp_amounts: sl_or_tp_amounts,
            buy_or_sell: buy_or_sell,
            risk_to_rewards: risk_to_rewards,
            trading_status: trading_status,
            trade_close_by: trade_close_by,
            chart_analysis: chart_analysis,
            trading_statagy: trading_statagy,
            market_trand: market_trand,
            notes: notes
        }).save();

        if (result) {
            return res.json({
                success: true,
                massage: 'Create Success',
                payload: result
            });
        }

    } catch (error) {
        return res.json({
            success: false,
            error: error.message || 'Internal Server Error'
        });
    }
}

export const show = async (req, res) => {
    try {
        const search = req.query.search || "";
        const { from_date = "", to_date = "", day_of_week = "", time_of_day = "", forex_pair = "", chart_time = "", chart_analysis = "", market_trand = "", market_session = "", broker_account_type = "", trading_type = "", buy_or_sell = "", trading_status = "", trade_close_by = "" } = req.query;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const searchQuery = new RegExp('.*' + search + '.*', 'i');

        // Add search filter
        const dataFilter = {
            $or: [
                { broker_name: { $regex: searchQuery } },
                { risk_to_rewards: { $regex: searchQuery } },
                { sl_or_tp_amounts: { $regex: searchQuery } },
                { notes: { $regex: searchQuery } },
            ]
        }

        // Add date filter
        if (from_date || to_date) {
            dataFilter.date_and_time = {};
            if (from_date) { dataFilter.date_and_time.$gte = new Date(from_date + 'T00:00:00.000Z') }
            if (to_date) { dataFilter.date_and_time.$lte = new Date(to_date + 'T23:59:59.999Z') }
        }

        if (day_of_week) dataFilter.day_of_the_week = day_of_week;
        if (time_of_day) dataFilter.time_of_day = time_of_day;
        if (forex_pair) dataFilter.forex_pair = forex_pair;
        if (chart_time) dataFilter.chart_time = chart_time;
        if (chart_analysis) dataFilter.chart_analysis = chart_analysis;
        if (market_trand) dataFilter.market_trand = market_trand;
        if (market_session) dataFilter.market_session = market_session;
        if (broker_account_type) dataFilter.broker_account_type = broker_account_type;
        if (trading_type) dataFilter.trading_type = trading_type;
        if (buy_or_sell) dataFilter.buy_or_sell = buy_or_sell;
        if (trading_status) dataFilter.trading_status = trading_status;
        if (trade_close_by) dataFilter.trade_close_by = trade_close_by;

        const result = await TradeJournalModel.find(dataFilter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit)

        const count = await TradeJournalModel.find(dataFilter).countDocuments();

        // Check not found
        if (result.length === 0) {
            return res.json({ message: "No Data found" });
        } else {
            return res.json({
                success: true,
                massage: 'Item Show Success',
                pagination: {
                    per_page: limit,
                    current_page: page,
                    total_data: count,
                    total_page: Math.ceil(count / limit),
                    previous: page - 1 > 0 ? page - 1 : null,
                    next: page + 1 <= Math.ceil(count / limit) ? page + 1 : null
                },
                payload: result,
            });
        }
    } catch (error) {
        return res.json({
            success: false,
            error: error.message || 'Internal Server Error'
        });
    }
}

export const single = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate the mongoose id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.json({ success: false, message: "Invalid ID format" });
        }

        // Check not found
        const result = await TradeJournalModel.findById(id);
        if (!result) {
            return res.json({ message: "Data not found" });
        } else {
            return res.json({
                success: true,
                massage: 'Item Show Success',
                payload: result
            });
        }

    } catch (error) {
        return res.json({
            success: false,
            error: error.message || 'Internal Server Error'
        });
    }
}

export const update = async (req, res) => {
    try {
        const { id } = req.params
        const { date_and_time, day_of_the_week, time_of_day, forex_pair, chart_time, chart_analysis, trading_statagy, market_trand, market_session, broker_name, broker_account_type, trading_type, lot_size, buy_or_sell, risk_to_rewards, sl_or_tp_amounts, trading_status, trade_close_by, notes } = req.body;

        // Validate the mongoose id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.json({ success: false, message: "Invalid ID format" });
        }

        // check exist data
        const findOne = await TradeJournalModel.findById(id);
        if (!findOne) {
            return res.json({ massage: "Item not found" });
        }

        const requiredFields = ['date_and_time', 'day_of_the_week', 'time_of_day', 'forex_pair', 'chart_time', 'chart_analysis', 'trading_statagy', 'market_trand', 'market_session', 'broker_name', 'broker_account_type', 'trading_type', 'lot_size', 'buy_or_sell', 'risk_to_rewards', 'sl_or_tp_amounts', 'trading_status', 'trade_close_by'];

        for (let field of requiredFields) {
            const value = req.body[field];
            if (!value || value.trim() === '') {
                return res.status(400).json({ [field]: 'is required and cannot be empty' });
            }
        }

        // attachment upload
        let attachment = findOne.attachment;
        if (req.file && req.file.filename) { attachment = req.file.filename }

        // existing date chack
        const existData = await TradeJournalModel.exists({ date_and_time: date_and_time });
        if (existData && existData._id.toString() !== id) {
            return res.json({ message: 'Date is already exists' });
        }

        // update
        const result = await TradeJournalModel.findByIdAndUpdate(id, {
            date_and_time: date_and_time,
            date_and_time_format: formatDateTime(date_and_time),
            day_of_the_week: day_of_the_week,
            time_of_day: time_of_day,
            forex_pair: forex_pair,
            chart_time: chart_time,
            market_session: market_session,
            broker_name: broker_name,
            trading_type: trading_type,
            broker_account_type: broker_account_type,
            lot_size: lot_size,
            sl_or_tp_amounts: sl_or_tp_amounts,
            buy_or_sell: buy_or_sell,
            risk_to_rewards: risk_to_rewards,
            trading_status: trading_status,
            trade_close_by: trade_close_by,
            chart_analysis: chart_analysis,
            trading_statagy: trading_statagy,
            market_trand: market_trand,
            notes: notes,
            attachment: attachment
        }, { new: true })

        if (result) {
            return res.json({
                success: true,
                massage: 'Item Update Success',
                payload: result
            });
        }

    } catch (error) {
        return res.json({
            success: false,
            error: error.message || 'Internal Server Error'
        });
    }
}

export const destroy = async (req, res) => {
    try {
        const { id } = req.params

        // Validate the mongoose id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.json({ success: false, message: "Invalid ID format" });
        }

        const result = await TradeJournalModel.findByIdAndDelete(id);

        // Check not found
        if (!result) {
            return res.json({ message: "Data not found" });
        } else {
            return res.json({
                success: true,
                massage: 'Item Destroy Success',
            });
        }

    } catch (error) {
        return res.json({
            success: false,
            error: error.message || 'Internal Server Error'
        });
    }
}