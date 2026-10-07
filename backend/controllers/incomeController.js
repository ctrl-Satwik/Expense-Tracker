const { Types } = require("mongoose");
const Income = require("../models/Income");
const { sendExcel } = require("../utils/excel");

// Add Income Source
exports.addIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const {icon, source, amount, date} = req.body;

        if (!source || !amount || !date) {
            return res.status(400).json({message: "All fields are required"});
        }

        const newIncome = new Income({
            userId,
            icon, 
            source,
            amount,
            date: new Date(date)
        });

        await newIncome.save();
        res.status(200).json(newIncome);
    } catch (err) {
        res.status(500).json({message: "Server Error"});
    }
};

// Get All Income Source
exports.getAllIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const income = await Income.find({userId}).sort({date: -1});
        res.json(income);
    } catch (err) {
        res.status(500).json({message: "Server Error"});
    }
};

// Delete Income Source
exports.deleteIncome = async (req, res) => {

    if (!Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({message: "Income not found"});
    }

    try {
        // Only delete if it belongs to the logged-in user
        const deleted = await Income.findOneAndDelete({_id: req.params.id, userId: req.user.id});
        if (!deleted) {
            return res.status(404).json({message: "Income not found"});
        }
        res.status(200).json({message: "Income deleted successfully"});
    } catch (err) {
        res.status(500).json({message: "Server Error"});
    }
};

// Download Excel
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const income = await Income.find({userId}).sort({date: -1});

        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date,
        }));

        sendExcel(res, data, "Income", "income_details.xlsx");
    } catch (err) {
        res.status(500).json({message: "Server Error"});
    }
};