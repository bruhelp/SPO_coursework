function calculateStatistics(logs) {

    const completedDays = logs.length;
    const currentStreak = completedDays;
    const longestStreak = completedDays;

    return {
        completedDays,
        currentStreak,
        longestStreak
    };

}

module.exports = { calculateStatistics };