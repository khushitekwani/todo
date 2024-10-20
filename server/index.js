const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;
require('dotenv').config
// Task Schema
const taskSchema = mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
}, {
    timestamps: true
});

const Task = mongoose.model("Task", taskSchema);

// Get all tasks
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find({});
    res.json({ success: true, data: tasks });
});

// Create a new task
app.post("/tasks", async (req, res) => {
    const task = new Task(req.body);
    await task.save();
    res.json({ success: true, message: "Task added successfully" });
});

// Update a task
app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;
    try {
        const updatedTask = await Task.findByIdAndUpdate(id, { title, completed }, { new: true });
        if (updatedTask) {
            res.json({ success: true, message: 'Task updated successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update task' });
    }
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Task.findByIdAndDelete(id);
        res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete task' });
    }
});

// Get task details by ID
app.get('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findById(id);
        if (task) {
            res.json({ success: true, data: task });
        } else {
            res.status(404).json({ success: false, message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch task details' });
    }
});


// Mark task as completed
app.patch('/tasks/:id/complete', async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findById(id);
        if (task) {
            task.completed = !task.completed; // Toggle completion
            await task.save();
            res.json({ success: true, message: 'Task completion status updated' });
        } else {
            res.status(404).json({ success: false, message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update task' });
    }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to DB");
        app.listen(PORT, () => console.log("Server is running"));
    })
    .catch((err) => console.log(err));

    
