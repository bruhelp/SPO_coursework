import { useState, useEffect, useCallback } from "react";
import ProgressBar from "../ProgressBar/ProgressBar";
import { getHabitStatistics } from "../../api/statisticsApi";
import "./HabitCard.css";

function toDateKey(value) {
    const date = new Date(value);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function HabitCard({ habit, categoryName, onComplete, onSelect }) {

    const [statistics, setStatistics] = useState(null);

    const loadStatistics = useCallback(async () => {
        try {
            const data = await getHabitStatistics(habit.id);
            setStatistics(data);
        } catch (error) {
            console.log(error);
        }
    }, [habit.id]);

    useEffect(() => {
        loadStatistics();
    }, [loadStatistics]);

    const hasGoal = habit.goal_type && habit.goal_type !== "none";
    const goalValue = Number(habit.goal_value || 0);
    const completedDays = Number(statistics?.completedDays || 0);

    const completedToday = statistics?.history?.some(item => {
        return toDateKey(item.completed_at) === toDateKey(new Date());
    }) ?? false;

    let progressCurrent = completedDays;
    let progressTarget = goalValue;

    if (habit.goal_type === "date" && habit.goal_date && habit.start_date) {
        const start = new Date(habit.start_date);
        const end = new Date(habit.goal_date);
        const today = new Date();
        const totalDays = Math.max(
            1,
            Math.ceil((end - start) / 86400000)
        );
        progressTarget = totalDays;
        progressCurrent = Math.max(
            0,
            Math.min(totalDays, Math.ceil((today - start) / 86400000))
        );
    }

    async function handleComplete(e) {
        e.stopPropagation();
        await onComplete(habit.id);
        await loadStatistics();
    }

    const goalLabel = (() => {
        if (!hasGoal) {
            return null;
        }

        if (habit.goal_type === "date" && habit.goal_date) {
            return `До ${new Date(habit.goal_date).toLocaleDateString("ru-RU")}`;
        }

        return `${completedDays} / ${goalValue}`;
    })();

    return (
        <div
            className={`habit-card${completedToday ? " habit-card--done" : ""}`}
            onClick={() => onSelect(habit)}
        >
            <div className="habit-accent" style={{ backgroundColor: habit.color_theme || "#4CAF50" }} />
            <div className="habit-header">
                <div className="habit-title">{habit.title}</div>
                <button
                    className={`complete-button${completedToday ? " complete-button--done" : ""}`}
                    onClick={handleComplete}
                    title={completedToday ? "Снять отметку за сегодня" : "Отметить выполнение за сегодня"}
                >
                    {completedToday ? "✓" : "○"}
                </button>
            </div>

            {habit.description && (
                <div className="habit-description">{habit.description}</div>
            )}

            {categoryName && (
                <div className="habit-category">{categoryName}</div>
            )}

            {hasGoal && (
                <div className="habit-goal-block">
                    <div className="habit-goal">{goalLabel}</div>
                    <ProgressBar current={progressCurrent} target={progressTarget} />
                </div>
            )}
        </div>
    );
}

export default HabitCard;
