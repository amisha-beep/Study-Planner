const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    text: String,
    date: String,
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Low"
    },
    completed: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Task", taskSchema);