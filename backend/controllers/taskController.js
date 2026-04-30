const Task = require('../models/Task');
const Notification = require('../models/Notification');
const { calculatePriority } = require('../utils/priorityEngine');

// @desc    Get all tasks for logged in user
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find({ userId: req.user._id });
        
        // Recalculate priority before sending
        let updated = false;
        for (let task of tasks) {
            const newScore = calculatePriority(task);
            if (task.priorityScore !== newScore) {
                task.priorityScore = newScore;
                await task.save();
                updated = true;
            }
        }

        const finalTasks = updated 
            ? await Task.find({ userId: req.user._id }).sort({ priorityScore: -1, createdAt: -1 })
            : tasks.sort((a, b) => b.priorityScore - a.priorityScore || b.createdAt - a.createdAt);

        res.status(200).json({ success: true, count: finalTasks.length, data: finalTasks });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }

        // Make sure user owns task
        if (task.userId.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to access this task');
        }

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
    try {
        req.body.userId = req.user._id;
        
        // Calculate initial priority
        req.body.priorityScore = calculatePriority(req.body);

        const task = await Task.create(req.body);

        // Create notification
        await Notification.create({
            userId: req.user._id,
            title: 'Task Created',
            message: `Task "${task.title}" has been created.`,
            type: 'info'
        });

        // Emit socket event
        const io = req.app.get('io');
        io.to(req.user._id.toString()).emit('taskCreated', task);
        io.to(req.user._id.toString()).emit('statsUpdated');
        io.to(req.user._id.toString()).emit('notification', { title: 'Task Created', message: `Task "${task.title}" has been created.` });

        res.status(201).json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }

        if (task.userId.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this task');
        }

        // Set completedAt if status changed to Completed
        if (req.body.status === 'Completed' && task.status !== 'Completed') {
            req.body.completedAt = new Date();
        } else if (req.body.status && req.body.status !== 'Completed') {
            req.body.completedAt = null;
        }

        // Merge updates to calculate priority
        const tempTask = { ...task._doc, ...req.body };
        req.body.priorityScore = calculatePriority(tempTask);

        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        // Create notification if completed
        if (req.body.status === 'Completed') {
            await Notification.create({
                userId: req.user._id,
                title: 'Task Completed',
                message: `Congratulations! You've completed "${task.title}".`,
                type: 'update'
            });
        }

        // Emit socket event
        const io = req.app.get('io');
        io.to(req.user._id.toString()).emit('taskUpdated', task);
        io.to(req.user._id.toString()).emit('statsUpdated');
        if (req.body.status === 'Completed') {
            io.to(req.user._id.toString()).emit('notification', { title: 'Task Completed', message: `Congratulations! You've completed "${task.title}".` });
        }

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }

        if (task.userId.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to delete this task');
        }

        await task.deleteOne();

        // Emit socket event
        const io = req.app.get('io');
        io.to(req.user._id.toString()).emit('taskDeleted', req.params.id);
        io.to(req.user._id.toString()).emit('statsUpdated');

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

// @desc    Check for upcoming deadlines and overdue tasks
exports.checkDeadlines = async (io) => {
    try {
        const now = new Date();
        const tomorrow = new Date(now.getTime() + (24 * 60 * 60 * 1000));

        // Find overdue tasks
        const overdueTasks = await Task.find({
            status: { $ne: 'Completed' },
            deadline: { $lt: now }
        });

        for (let task of overdueTasks) {
            const notif = await Notification.create({
                userId: task.userId,
                title: 'Task Overdue',
                message: `Attention! Your task "${task.title}" is overdue.`,
                type: 'overdue'
            });
            io.to(task.userId.toString()).emit('notification', notif);
        }

        // Find upcoming deadlines (within 24h)
        const upcomingTasks = await Task.find({
            status: { $ne: 'Completed' },
            deadline: { $gte: now, $lt: tomorrow }
        });

        for (let task of upcomingTasks) {
            const notif = await Notification.create({
                userId: task.userId,
                title: 'Upcoming Deadline',
                message: `Reminder: Task "${task.title}" is due within 24 hours.`,
                type: 'deadline'
            });
            io.to(task.userId.toString()).emit('notification', notif);
        }
    } catch (error) {
        console.error('Deadline check error:', error);
    }
};
