const habitRepository = require("../repositories/habitRepository");
const habitLogRepository = require("../repositories/habitLogRepository");
const calculator = require("../utils/calculateStatistics");

/*
    Общая статистика пользователя.
*/

async function getGeneralStatistics(userId) {

    const habits = await habitRepository.getAllByUser(userId);

    let totalHabits = habits.length;

    let totalCompletions = 0;

    for (
        const habit of habits
    ) {
        const logs = await habitLogRepository.getByHabit(habit.id);
        totalCompletions += logs.length;
    }

    return {
        totalHabits,
        totalCompletions
    };

}

/*
    Статистика конкретной привычки.
*/

async function getHabitStatistics(habitId) {

    const logs =
        await habitLogRepository.getByHabit(habitId);

    const statistics = calculator.calculateStatistics(logs);

    return {
        ...statistics,
        history: logs
    };
}

module.exports = {
    getGeneralStatistics,
    getHabitStatistics
};