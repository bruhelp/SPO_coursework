import { useMemo, useState } from "react";
import "./CalendarGrid.css";

function toDateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function toDateTimeValue(date) {
    return `${toDateKey(date)}T12:00:00`;
}

function CalendarGrid({ history = [], onToggleDate }) {
    const [cursor, setCursor] = useState(() => new Date());

    const completedKeys = useMemo(() => {
        return new Set(history.map(item => toDateKey(new Date(item.completed_at))));
    }, [history]);

    const monthDays = useMemo(() => {
        const year = cursor.getFullYear();
        const month = cursor.getMonth();
        const firstDay = new Date(year, month, 1);
        const startOffset = (firstDay.getDay() + 6) % 7;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const cells = [];

        for (let index = 0; index < startOffset; index += 1) {
            cells.push(null);
        }

        for (let day = 1; day <= daysInMonth; day += 1) {
            cells.push(new Date(year, month, day));
        }

        while (cells.length % 7 !== 0) {
            cells.push(null);
        }

        return cells;
    }, [cursor]);

    const monthLabel = cursor.toLocaleDateString("ru-RU", {
        month: "long",
        year: "numeric"
    });

    function handleDayClick(day) {
        if (!day || !onToggleDate) {
            return;
        }

        onToggleDate(toDateTimeValue(day));
    }

    return (
        <section className="calendar-grid-panel">
            <div className="calendar-grid-header">
                <button onClick={() => setCursor(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}>←</button>
                <h3>{monthLabel}</h3>
                <button onClick={() => setCursor(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}>→</button>
            </div>

            <div className="calendar-grid-weekdays">
                {[
                    "Пн",
                    "Вт",
                    "Ср",
                    "Чт",
                    "Пт",
                    "Сб",
                    "Вс"
                ].map(day => (
                    <span key={day}>{day}</span>
                ))}
            </div>

            <div className="calendar-grid-days">
                {monthDays.map((day, index) => {
                    if (!day) {
                        return <span key={`empty-${index}`} className="calendar-grid-empty" />;
                    }

                    const key = toDateKey(day);
                    const isDone = completedKeys.has(key);

                    return (
                        <button
                            key={key}
                            className={`calendar-grid-day${isDone ? " is-done" : ""}`}
                            onClick={() => handleDayClick(day)}
                            title={isDone ? "Отметка есть, нажмите чтобы снять" : "Нажмите чтобы отметить"}
                        >
                            <span>{day.getDate()}</span>
                            <strong>{isDone ? "✓" : "○"}</strong>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

export default CalendarGrid;