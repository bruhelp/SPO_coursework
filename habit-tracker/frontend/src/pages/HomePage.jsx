import { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import ProfileModal from "../components/ProfileModal/ProfileModal";
import HabitCard from "../components/HabitCard/HabitCard";
import { getProfile } from "../api/userApi";
import { getGeneralStatistics, getHabitStatistics } from "../api/statisticsApi";
import { getHabits, completeHabit } from "../api/habitsApi";
import useAuth from "../hooks/useAuth";
import HabitModal from "../components/HabitModal/HabitModal";
import "./HomePage.css";

function HomePage() {
    const [user, setUser] = useState(null);
    const [statistics, setStatistics] = useState(null);
    const [habits, setHabits] = useState([]);
    const [showProfile, setShowProfile] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedHabit, setSelectedHabit] = useState(null);
    const [habitStats, setHabitStats] = useState(null);

    const { logout } = useAuth();

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [profile, stats, habitsData] = await Promise.all([
                getProfile(),
                getGeneralStatistics(),
                getHabits()
            ]);
            setUser(profile);
            setStatistics(stats);
            setHabits(habitsData);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleComplete(id) {
        try {
            await completeHabit(id);
            // Refresh general stats silently; HabitCard refreshes itself
            const stats = await getGeneralStatistics();
            setStatistics(stats);
            // If this habit is selected, refresh its detail stats too
            if (selectedHabit?.id === id) {
                const hs = await getHabitStatistics(id);
                setHabitStats(hs);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function handleSelectHabit(habit) {
        setSelectedHabit(habit);
        try {
            const stats = await getHabitStatistics(habit.id);
            setHabitStats(stats);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Header
                statistics={statistics}
                onProfileClick={() => setShowProfile(true)}
                onLogout={logout}
            />

            {showProfile && (
                <ProfileModal
                    user={user}
                    onClose={() => setShowProfile(false)}
                />
            )}

            {showModal && (
                <HabitModal
                    onClose={() => setShowModal(false)}
                    onCreated={loadData}
                />
            )}

            <div className="home-page">

                <div className="habit-list">
                    {habits.length === 0 && (
                        <div className="habit-list-empty">
                            У вас пока нет привычек
                        </div>
                    )}

                    {habits.map(habit => (
                        <HabitCard
                            key={habit.id}
                            habit={habit}
                            onComplete={handleComplete}
                            onSelect={handleSelectHabit}
                        />
                    ))}

                    <button
                        className="add-habit-btn"
                        onClick={() => setShowModal(true)}
                    >
                        + Новая привычка
                    </button>
                </div>

                <div className="habit-details">
                    {selectedHabit ? (
                        <>
                            <h2>{selectedHabit.title}</h2>

                            {selectedHabit.description && (
                                <p style={{ color: "#666", marginTop: 0 }}>
                                    {selectedHabit.description}
                                </p>
                            )}

                            {habitStats && (
                                <>
                                    <div className="stat-row">
                                        <div className="stat-item">
                                            <strong>{habitStats.completedDays}</strong>
                                            <span>Выполнено дней</span>
                                        </div>
                                        <div className="stat-item">
                                            <strong>{habitStats.currentStreak}</strong>
                                            <span>Текущая серия</span>
                                        </div>
                                        <div className="stat-item">
                                            <strong>{habitStats.longestStreak}</strong>
                                            <span>Лучшая серия</span>
                                        </div>
                                    </div>

                                    {habitStats.history?.length > 0 && (
                                        <>
                                            <h3>История</h3>
                                            <ul className="history-list">
                                                {habitStats.history.map(log => (
                                                    <li key={log.id}>
                                                        {new Date(log.completed_at).toLocaleDateString("ru-RU", {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric"
                                                        })}
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <div className="habit-details-empty">
                            <div className="habit-details-empty-icon">📋</div>
                            <span>Выберите привычку из списка</span>
                        </div>
                    )}
                </div>

            </div>
        </>
    );
}

export default HomePage;
