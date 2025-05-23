import mongoose from "mongoose";
import BankStatementModel from "../models/bank_statement_model.js";
import { formatDateTime } from "../utils/helper.js";

export const create = async (req, res) => {
    try {
        const { date_and_time, transfer_from, transfer_to, transfer_amount, transfer_balance_type, transfer_regsion } = req.body;

        const requiredFields = ['date_and_time', 'transfer_from', 'transfer_to', 'transfer_amount', 'transfer_balance_type', 'transfer_regsion'];

        for (let field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ [field]: 'Field is required' });
            }
        }

        // existing data chack
        const existing = await BankStatementModel.exists({ date_and_time: date_and_time });
        if (existing) {
            return res.json({
                success: false,
                message: "Date and time is already exist."
            });
        }

        // store data
        const result = await new BankStatementModel({
            date_and_time: date_and_time,
            date_and_time_format: formatDateTime(date_and_time),
            transfer_from: transfer_from,
            transfer_to: transfer_to,
            transfer_amount: transfer_amount,
            transfer_balance_type: transfer_balance_type,
            transfer_regsion: transfer_regsion
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
        const { from_date = "", to_date = "", transfer_from = "", transfer_to = "", balance_type = "" } = req.query;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const searchQuery = new RegExp('.*' + search + '.*', 'i');

        // Add search filter
        const dataFilter = {
            $or: [
                { transfer_regsion: { $regex: searchQuery } },
                { transfer_amount: { $regex: searchQuery } },
            ]
        }

        // Add date filter
        if (from_date || to_date) {
            dataFilter.date_and_time = {};
            if (from_date) { dataFilter.date_and_time.$gte = new Date(from_date + 'T00:00:00.000Z') }
            if (to_date) { dataFilter.date_and_time.$lte = new Date(to_date + 'T23:59:59.999Z') }
        }

        if (transfer_from) dataFilter.transfer_from = transfer_from;
        if (transfer_to) dataFilter.transfer_to = transfer_to;
        if (balance_type) dataFilter.transfer_balance_type = balance_type;

        const result = await BankStatementModel.find(dataFilter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit)

        const count = await BankStatementModel.find(dataFilter).countDocuments();

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
        const result = await BankStatementModel.findById(id);

        // Validate the mongoose id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.json({ success: false, message: "Invalid ID format" });
        }

        // Check not found
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
        const { date_and_time, transfer_from, transfer_to, transfer_amount, transfer_balance_type, transfer_regsion } = req.body;

        // Validate the mongoose id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.json({ success: false, message: "Invalid ID format" });
        }

        // check exist data
        const findOne = await BankStatementModel.findById(id);
        if (!findOne) {
            return res.json({ massage: "User not found" });
        }

        const requiredFields = ['date_and_time', 'transfer_from', 'transfer_to', 'transfer_amount', 'transfer_balance_type', 'transfer_regsion'];

        for (let field of requiredFields) {
            const value = req.body[field];
            if (!value || value.trim() === '') {
                return res.status(400).json({ [field]: 'is required and cannot be empty' });
            }
        }

        // attachment upload
        // let attachment = findOne.attachment;
        // if (req.file && req.file.filename) { attachment = req.file.filename }

        // existing date chack
        const existData = await BankStatementModel.exists({ date_and_time: date_and_time });
        if (existData && existData._id.toString() !== id) {
            return res.json({ message: 'Date is already exists' });
        }

        // update
        const result = await BankStatementModel.findByIdAndUpdate(id, {
            date_and_time: date_and_time,
            date_and_time_format: formatDateTime(date_and_time),
            transfer_from: transfer_from,
            transfer_to: transfer_to,
            transfer_amount: transfer_amount,
            transfer_balance_type: transfer_balance_type,
            transfer_regsion: transfer_regsion

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

        const result = await BankStatementModel.findByIdAndDelete(id);

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