const { Types } = require("mongoose");
const Expense = require("../models/Expense");
const { sendExcel } = require("../utils/excel");

// Add Expense Source
exports.addExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const {icon, category, amount, date} = req.body;

        if (!category || !amount || !date) {
            return res.status(400).json({message: "All fields are required"});
        }

        const newExpense = new Expense({
            userId,
            icon, 
            category,
            amount,
            date: new Date(date)
        });

        await newExpense.save();
        res.status(200).json(newExpense);
    } catch (err) {
        res.status(500).json({message: "Server Error"});
    }
};

// Get All Expense Source
exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({userId}).sort({date: -1});
        res.json(expense);
    } catch (err) {
        res.status(500).json({message: "Server Error"});
    }
};

// Delete Expense Source
exports.deleteExpense = async (req, res) => {

    if (!Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({message: "Expense not found"});
    }

    try {
        // Only delete if it belongs to the logged-in user
        const deleted = await Expense.findOneAndDelete({_id: req.params.id, userId: req.user.id});
        if (!deleted) {
            return res.status(404).json({message: "Expense not found"});
        }
        res.status(200).json({message: "Expense deleted successfully"});
    } catch (err) {
        res.status(500).json({message: "Server Error"});
    }
};

// Download Excel
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await Expense.find({userId}).sort({date: -1});

        const data = expense.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date,
        }));

        sendExcel(res, data, "Expense", "expense_details.xlsx");
    } catch (err) {
        res.status(500).json({message: "Server Error"});
    }
};