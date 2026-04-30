exports.calculatePriority = (task) => {
  let score = 0;
  const now = new Date();
  const deadline = new Date(task.deadline);
  
  // Status logic
  if (task.status === 'Completed') {
    return 0; // Completed tasks have lowest priority
  } else if (task.status === 'Pending') {
    score += 10;
  } else if (task.status === 'In Progress') {
    score += 5;
  }

  // Time difference in milliseconds
  const timeDiff = deadline.getTime() - now.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  if (daysDiff < 0) {
    score += 100; // Overdue
  } else if (daysDiff <= 1) {
    score += 50; // Within 24h
  } else if (daysDiff <= 3) {
    score += 30; // Within 3 days
  } else if (daysDiff <= 7) {
    score += 15; // Within 7 days
  }

  return score;
};
