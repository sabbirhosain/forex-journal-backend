import mongoose from "mongoose";
import CurrencyPairModel from "../models/currency_pair_model.js";

export const create = async (req, res) => {
    try {
        const { currency_pair, currencies_involved, volatility, liquidity, open_and_close_time, open_and_close_day, session_and_time, best_session_to_trade, notes } = req.body;

        const requiredFields = ['currency_pair', 'currencies_involved', 'volatility', 'liquidity', 'open_and_close_time', 'open_and_close_day', 'best_session_to_trade'];

        for (let field of requiredFields) {
            if (!req.body[field]) {
                return res.json({
                    [field]: 'Field is required', //for backend
                    message: `${field} Field is required` //for frontend
                });
            }
        }

        // Validate session_and_time array
        if (!Array.isArray(session_and_time) || session_and_time.length === 0) {
            return res.json({ session_and_time: "must be array and object [{}]" });
        }

        // Validate each session object and check for duplicate session_name
        const sessionNames = new Set();

        for (let i = 0; i < session_and_time.length; i++) {
            const session = session_and_time[i];
            if (!session.session_name) {
                return res.json({ session_name: "Field is required" });
            }
            if (!session.start_to_end_time_gmt) {
                return res.json({ start_to_end_time_gmt: "Field is required" });
            }
            if (!session.start_to_end_time_bdt) {
                return res.status(400).json({ start_to_end_time_bdt: "Field is required" });
            }

            if (sessionNames.has(session.session_name)) {
                return res.status(400).json({
                    success: false,
                    message: `Session name already exist`
                });
            }
            sessionNames.add(session.session_name);
        }

        // existing data chack
        const existing = await CurrencyPairModel.exists({ currency_pair: currency_pair });
        if (existing) {
            return res.json({
                success: false,
                message: "Currency Pair name is already exist. Please use a different name"
            });
        }

        // store the trade value
        const result = await new CurrencyPairModel({
            currency_pair: currency_pair,
            currencies_involved: currencies_involved,
            volatility: volatility,
            liquidity: liquidity,
            session_and_time: session_and_time,
            open_and_close_time: open_and_close_time,
            open_and_close_day: open_and_close_day,
            best_session_to_trade: best_session_to_trade,
            notes: notes
        }).save();

        if (result) {
            return res.json({
                success: true,
                message: 'Create Success',
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
        const { volatility = "", liquidity = "", session = "" } = req.query;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const searchQuery = new RegExp('.*' + search + '.*', 'i');

        // Add search filter
        const dataFilter = {
            $or: [
                { currency_pair: { $regex: searchQuery } },
                { currencies_involved: { $regex: searchQuery } },
                { notes: { $regex: searchQuery } },
            ]
        }

        // Apply filters only if they have a meaningful value
        if (volatility && volatility !== "" && volatility !== "null" && volatility !== "undefind") {
            dataFilter.volatility = volatility;
        }
        if (liquidity && liquidity !== "" && liquidity !== "null" && liquidity !== "undefind") {
            dataFilter.liquidity = liquidity;
        }
        if (session && session !== "" && session !== "null" && session !== "undefind") {
            dataFilter.session_name = session;
        }

        const result = await CurrencyPairModel.find(dataFilter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit)

        const count = await CurrencyPairModel.find(dataFilter).countDocuments();

        // Check not found
        if (result.length === 0) {
            return res.json({
                success: true,
                message: "No Data found"
            });
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
        const result = await CurrencyPairModel.findById(id);

        // Validate the mongoose id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.json({ success: false, message: "Invalid ID format" });
        }

        // Check not found
        if (!result) {
            return res.json({
                success: false,
                message: "Data not found"
            });
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
        const { currency_pair, currencies_involved, volatility, liquidity, open_and_close_time, open_and_close_day, session_and_time, best_session_to_trade, notes } = req.body;

        // Validate the mongoose id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.json({ success: false, message: "Invalid ID format" });
        }

        // check exist data
        const findOne = await CurrencyPairModel.findById(id);
        if (!findOne) {
            return res.json({ massage: "Not found" });
        }

        const requiredFields = ['currency_pair', 'currencies_involved', 'volatility', 'liquidity', 'open_and_close_time', 'open_and_close_day', 'best_session_to_trade'];

        for (let field of requiredFields) {
            const value = req.body[field];
            if (!value || value.trim() === '') {
                return res.status(400).json({ [field]: 'is required and cannot be empty' });
            }
        }

        // Validate session_and_time
        if (!Array.isArray(session_and_time) || session_and_time.length === 0) {
            return res.status(400).json({ session_and_time: "Must be a non-empty array of objects." });
        }

        // Validate each session object and check for duplicate session_name
        const sessionNames = new Set();

        for (let i = 0; i < session_and_time.length; i++) {
            const session = session_and_time[i];
            if (!session.session_name) {
                return res.status(400).json({ session_name: "Field is required in session_and_time" });
            }
            if (!session.start_to_end_time_gmt) {
                return res.status(400).json({ start_to_end_time_gmt: "Field is required in session_and_time" });
            }
            if (!session.start_to_end_time_bdt) {
                return res.status(400).json({ start_to_end_time_bdt: "Field is required in session_and_time" });
            }

            if (sessionNames.has(session.session_name)) {
                return res.status(400).json({
                    success: false,
                    message: `Session name already exist`
                });
            }
            sessionNames.add(session.session_name);
        }

        // existing date chack
        const existData = await CurrencyPairModel.exists({ currency_pair: currency_pair });
        if (existData && existData._id.toString() !== id) {
            return res.json({ message: 'Date is already exists' });
        }

        // update
        const result = await CurrencyPairModel.findByIdAndUpdate(id, {
            currency_pair: currency_pair,
            currencies_involved: currencies_involved,
            volatility: volatility,
            liquidity: liquidity,
            session_and_time: session_and_time,
            open_and_close_time: open_and_close_time,
            open_and_close_day: open_and_close_day,
            best_session_to_trade: best_session_to_trade,
            notes: notes
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

        const result = await CurrencyPairModel.findByIdAndDelete(id);

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