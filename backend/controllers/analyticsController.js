const Task = require('../models/Task');

// @desc    Get analytics overview
// @route   GET /api/analytics/overview
// @access  Private
exports.getOverview = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user._id });
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
    
    const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        completionPercentage
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get daily analytics
// @route   GET /api/analytics/daily
// @access  Private
exports.getDaily = async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const completedToday = await Task.countDocuments({
      userId: req.user._id,
      status: 'Completed',
      completedAt: { $gte: startOfDay }
    });

    res.status(200).json({
      success: true,
      data: {
        completedToday
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get category distribution
// @route   GET /api/analytics/categories
// @access  Private
exports.getCategories = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user._id });
    
    const categoryCounts = {};
    tasks.forEach(t => {
      categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
    });

    let mostActiveCategory = 'None';
    let maxCount = 0;

    const data = [];
    for (const [key, value] of Object.entries(categoryCounts)) {
      data.push({ name: key, value });
      if (value > maxCount) {
        maxCount = value;
        mostActiveCategory = key;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        categories: data,
        mostActiveCategory
      }
    });
  } catch (err) {
    next(err);
  }
};
