import mongoose from 'mongoose';

const PersonalExpenseSchema = new mongoose.Schema({
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

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Authentication',
        required: true,
        index: true, // Index this field for faster queries
    },

    payment_amount: {
        type: Number,
        required: true,
        trim: true,
    },
    payment_method: {
        type: String,
        required: true,
        trim: true
    },
    payment_method_type: {
        type: String,
        required: true,
        trim: true,
        enum: ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Mobile Payment', 'Other'],
    },
    notes: {
        type: String,
        trim: true,
    },
    attachment: {
        type: String,
        trim: true,
    },

}, { timestamps: true });

const PersonalExpenseModel = mongoose.model('PersonalExpense', PersonalExpenseSchema);
export default PersonalExpenseModel;
