const repository = require("../repositories/habitRepository"); const logRepository = require("../repositories/habitLogRepository"); const auditService = require("./auditService");
const statisticsService = require("./statisticsService");
const validators = require("../utils/validators");
const createError = require("../utils/createError");

async function getAll(userId) {
    return await
        repository
            .getAllByUser(userId);
}

async function getAllIncludingArchived(userId) {
    return await repository.getAllByUser(userId, true);
}

async function create(
    habit,
    ipAddress
) {
    if (
        validators.isEmpty(habit.title)
    ) {
        throw createError("Title required.");
    }

    if (
        !validators.isValidFrequency(habit.frequencyType)
    ) {
        throw createError("Invalid frequency.");
    }

    if (
        !validators.isValidGoal(habit.goalType)
    ) {
        throw createError("Invalid goal.");
    }

    const createdHabit = await repository.create(habit);

    await auditService
        .writeLog(
            habit.userId,
            "create",
            "habit",
            createdHabit.id,
            ipAddress
        );

    return createdHabit;
}

async function update(
    id,
    habit,
    ipAddress
) {
    const updatedHabit = await repository.update(id, habit);

    await auditService
        .writeLog(
            habit.userId,
            "update",
            "habit",
            id,
            ipAddress
        );

    return updatedHabit;
}

async function remove(
    id,
    userId,
    ipAddress
) {

    await repository.remove(id);

    await auditService
        .writeLog(
            userId,
            "delete",
            "habit",
            id,
            ipAddress
        );
}

async function archive(
    id,
    userId,
    ipAddress
) {

    await repository.archive(id);

    await auditService
        .writeLog(
            userId,
            "archive",
            "habit",
            id,
            ipAddress
        );

}

/*
    Пользователь может отметить привычку за любую дату,
    как описано в правом блоке главной страницы.
*/
async function complete(habitId, date, userId, ipAddress) {
    const completedAt = date ? new Date(date) : new Date();

    const habit = await repository.getById(habitId);
    if (!habit) {
        throw createError("Habit not found.", 404);
    }

    const logs =
        await logRepository
            .getByHabit(
                habitId
            );

    const alreadyCompleted =
        logs.some(
            log => {

                return (
                    new Date(
                        log.completed_at
                    ).toDateString()

                    ===

                    completedAt
                        .toDateString()

                );

            }
        );

    if (alreadyCompleted) {
        await logRepository.removeByHabitAndDate(habitId, completedAt);
    } else {
        await logRepository.add(habitId, completedAt);
    }

    // Автоматическое завершение привычки при достижении цели (тип "total")
    if (habit.goal_type === "total") {
        const statistics = await statisticsService.getHabitStatistics(habitId);
        if (statistics.completedDays >= habit.goal_value) {
            await repository.update(habitId, { status: "completed" });
        }
    }

    await auditService.writeLog(userId, "complete", "habit", habitId, ipAddress);
    return true;
}

module.exports = {
    getAll,
    getAllIncludingArchived,
    create,
    update,
    remove,
    archive,
    complete
};