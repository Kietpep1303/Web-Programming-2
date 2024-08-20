const mongoose = require('mongoose');
const Task = mongoose.model('Task');

exports.list_all_tasks = async function(req, res) {
    try {
        const tasks = await Task.find({});
        res.json(tasks);
    } catch (err) {
        res.send(err);
    }
};

exports.create_a_task = async function(req, res) {
    try {
        const new_task = new Task(req.body);
        const task = await new_task.save();
        res.json(task);
    } catch (err) {
        res.send(err);
    }
};

exports.read_a_task = async function(req, res) {
    try {
        const task = await Task.findById(req.params.taskId);
        res.json(task);
    } catch (err) {
        res.send(err);
    }
};

exports.update_a_task = async function(req, res) {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.taskId },
            req.body,
            { new: true }
        );
        res.json(task);
    } catch (err) {
        res.send(err);
    }
};

exports.delete_a_task = async function(req, res) {
    try {
        await Task.remove({ _id: req.params.taskId });
        res.json({ message: 'Task successfully deleted' });
    } catch (err) {
        res.send(err);
    }
};