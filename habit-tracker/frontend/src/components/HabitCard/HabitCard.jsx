import { useState, useEffect, useCallback } from "react";
import ProgressBar from "../ProgressBar/ProgressBar";
import { getHabitStatistics } from "../../api/statisticsApi";
import "./HabitCard.css";

function HabitCard({ habit, onComplete, onSelect }) {

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

    const completedToday = statistics?.history?.some(item => {
        const today = new Date().toDateString();
        const completed = new Date(item.completed_at).toDateString();
        return today === completed;
    }) ?? false;

    let progress = 0;
    if (hasGoal && statistics && habit.goal_value > 0) {
        progress = Math.min(
            100,
            Math.floor((statistics.completedDays / habit.goal_value) * 100)
        );
    }

    async function handleComplete(e) {
        e.stopPropagation();
        await onComplete(habit.id);
        await loadStatistics();
    }

    return (
        <div
            className={`habit-card${completedToday ? " habit-card--done" : ""}`}
            onClick={() => onSelect(habit)}
        >
            <div className="habit-header">
                <div className="habit-title">{habit.title}</div>
                <button
                    className={`complete-button${completedToday ? " complete-button--done" : ""}`}
                    onClick={handleComplete}
                    title={completedToday ? "Выполнено сегодня" : "Отметить выполнение"}
                >
                    {completedToday ? "✓" : "○"}
                </button>
            </div>

            {habit.description && (
                <div className="habit-description">{habit.description}</div>
            )}

            {habit.category_id && (
                <div className="habit-category">Категория #{habit.category_id}</div>
            )}

            {hasGoal && (
                <div className="habit-goal-block">
                    <div className="habit-goal">
                        Цель: {statistics?.completedDays ?? 0} / {habit.goal_value}
                    </div>
                    <ProgressBar current={statistics?.completedDays ?? 0} target={habit.goal_value} />
                </div>
            )}
        </div>
    );
}

export default HabitCard;
