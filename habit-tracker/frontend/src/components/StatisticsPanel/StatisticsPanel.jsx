import "./StatisticsPanel.css";

function StatisticsPanel({ statistics }) {
    const values = statistics || {
        completedDays: 0,
        currentStreak: 0,
        longestStreak: 0
    };

    return (
        <section className="statistics-panel">
            <div className="statistics-item">
                <strong>{values.completedDays}</strong>
                <span>Всего выполнений</span>
            </div>
            <div className="statistics-item">
                <strong>{values.currentStreak}</strong>
                <span>Текущая серия</span>
            </div>
            <div className="statistics-item">
                <strong>{values.longestStreak}</strong>
                <span>Максимальная серия</span>
            </div>
        </section>
    );
}

export default StatisticsPanel;