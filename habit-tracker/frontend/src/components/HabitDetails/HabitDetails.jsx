import "./HabitDetails.css";

function HabitDetails({ habit, categoryName, onEdit }) {
    if (!habit) {
        return null;
    }

    const goalLabel = (() => {
        if (habit.goal_type === "date" && habit.goal_date) {
            return `До ${new Date(habit.goal_date).toLocaleDateString("ru-RU")}`;
        }

        if (habit.goal_type === "streak") {
            return `Серия: ${habit.goal_value || 0} дней`;
        }

        if (habit.goal_type === "total") {
            return `Всего: ${habit.goal_value || 0} выполнений`;
        }

        return "Без цели";
    })();

    return (
        <div className="habit-details-header">
            <div className="habit-details-title-row">
                <h2>{habit.title}</h2>
                <button className="habit-edit-button" onClick={onEdit}>Редактировать</button>
            </div>

            {habit.description && <p className="habit-details-description">{habit.description}</p>}

            <div className="habit-details-meta">
                {categoryName && <span>{categoryName}</span>}
                <span>{goalLabel}</span>
            </div>
        </div>
    );
}

export default HabitDetails;