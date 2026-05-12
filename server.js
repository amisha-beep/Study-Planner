const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Task = require("./Task");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/planner")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// test route
app.get("/", (req, res) => {
    res.send("Server is working");
});

// add task
app.post("/add-task", async (req, res) => {
    const { text, date } = req.body;

    const newTask = new Task({ text, date });
    await newTask.save();

    res.send("Task saved");
});

// get all tasks
app.get("/tasks", async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// simple login (test)
app.post("/add-task", async (req, res) => {
    try {
        const { text, date, priority } = req.body;

        const newTask = new Task({ text, date, priority });
        await newTask.save();

        res.send("Task saved");
    } catch (err) {
        res.status(500).send("Error saving task");
    }
});
app.delete("/delete-task/:id", async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.send("Task deleted");
});
app.put("/update-task/:id", async (req, res) => {
    const { text, date } = req.body;

    await Task.findByIdAndUpdate(req.params.id, { text, date });
    res.send("Task updated");
});app.put("/toggle-task/:id", async (req, res) => {
    const task = await Task.findById(req.params.id);
    task.completed = !task.completed;
    await task.save();

    res.send("Task updated");
});
app.put("/toggle-task/:id", async (req, res) => {
    const task = await Task.findById(req.params.id);
    task.completed = !task.completed;
    await task.save();

    res.send("Task updated");
});

// start server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});