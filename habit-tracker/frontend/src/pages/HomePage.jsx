import { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import ProfileModal from "../components/ProfileModal/ProfileModal";
import HabitCard from "../components/HabitCard/HabitCard";
import { getProfile } from "../api/userApi";
import { getGeneralStatistics } from "../api/statisticsApi";
import { getHabits, completeHabit } from "../api/habitsApi";
import useAuth from "../hooks/useAuth";
import HabitModal from "../components/HabitModal/HabitModal";
import { getHabitStatistics } from "../api/statisticsApi";
import "./HomePage.css";

function HomePage() {

    const [user, setUser] =
        useState(null);

    const [statistics,
        setStatistics] =
        useState(null);

    const [habits,
        setHabits] =
        useState([]);

    const [showProfile,
        setShowProfile] =
        useState(false);

    const {
        logout
    } =
        useAuth();

    useEffect(() => {

        loadData();

    }, []);

    const [showModal, setShowModal] = useState(false);
    const [selectedHabit, setSelectedHabit] = useState(null);
    const [habitStats, setHabitStats] = useState(null);

    async function loadData() {

        try {

            const profile =
                await getProfile();

            const stats =
                await getGeneralStatistics();

            const habitsData =
                await getHabits();

            setUser(
                profile
            );

            setStatistics(
                stats
            );

            setHabits(
                habitsData
            );

        }
        catch (
        error
        ) {

            console.log(
                error
            );

        }

    }

    async function handleComplete(
        id
    ) {

        try {

            await completeHabit(
                id
            );

            loadData();

        }
        catch (
        error
        ) {

            console.log(
                error
            );

        }

    }

    async function handleSelectHabit(habit) {

        setSelectedHabit(habit);

        try {
            const stats = await getHabitStatistics(habit.id);
            setHabitStats(stats);
        }
        catch (error) {
            console.log(error);
        }

    }

    return (

        <>

            <Header

                statistics={
                    statistics
                }

                onProfileClick={
                    () =>
                        setShowProfile(
                            true
                        )
                }

                onLogout={
                    logout
                }

            />

            {

                showProfile &&

                <ProfileModal

                    user={
                        user
                    }

                    onClose={
                        () =>
                            setShowProfile(
                                false
                            )
                    }

                />

            }

            {showModal && (
                <HabitModal
                    onClose={() => setShowModal(false)}
                    onCreated={loadData}
                />
            )}

            <div className="home-page">

                <div className="habit-list">

                    {

                        habits.map(
                            habit => (
                                <HabitCard
                                    key={habit.id}
                                    habit={habit}
                                    onComplete={handleComplete}
                                    onSelect={handleSelectHabit}
                                />
                            )
                        )
                    }

                    <button
                        onClick={() => setShowModal(true)}
                    >
                        + Новая привычка
                    </button>

                </div>

                <div className="habit-details">

                    {selectedHabit ? (
                        <>
                            <h2>{selectedHabit.title}</h2>

                            <p>{selectedHabit.description}</p>

                            {habitStats && (
                                <>
                                    <p>Выполнено дней: {habitStats.completedDays}</p>
                                    <p>Текущая серия: {habitStats.currentStreak}</p>
                                    <p>Лучшая серия: {habitStats.longestStreak}</p>

                                    <h3>История</h3>

                                    <ul>
                                        {habitStats.history.map(log => (
                                            <li key={log.id}>
                                                {new Date(log.completed_at).toLocaleDateString()}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </>
                    ) : (
                        <p>Выберите привычку</p>
                    )}

                </div>

            </div>

        </>

    );

}

export default HomePage;