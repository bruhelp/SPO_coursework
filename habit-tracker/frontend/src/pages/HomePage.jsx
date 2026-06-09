import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import ProfileModal from "../components/ProfileModal/ProfileModal";
import HabitCard from "../components/HabitCard/HabitCard";
import { getProfile } from "../api/userApi";
import { getGeneralStatistics, getHabitStatistics } from "../api/statisticsApi";
import { getHabits, completeHabit } from "../api/habitsApi";
import { getCategories } from "../api/categoriesApi";
import useAuth from "../hooks/useAuth";
import HabitModal from "../components/HabitModal/HabitModal";
import HabitDetails from "../components/HabitDetails/HabitDetails";
import CalendarGrid from "../components/CalendarGrid/CalendarGrid";
import StatisticsPanel from "../components/StatisticsPanel/StatisticsPanel";
import "./HomePage.css";

function HomePage() {
    const [user, setUser] = useState(null);
    const [statistics, setStatistics] = useState(null);
    const [habits, setHabits] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showProfile, setShowProfile] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingHabit, setEditingHabit] = useState(null);
    const [selectedHabitId, setSelectedHabitId] = useState(null);
    const [habitStats, setHabitStats] = useState(null);

    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (!selectedHabitId) {
            setHabitStats(null);
            return;
        }

        let cancelled = false;

        async function loadSelectedHabitStats() {
            try {
                const stats = await getHabitStatistics(selectedHabitId);
                if (!cancelled) {
                    setHabitStats(stats);
                }
            } catch (error) {
                if (!cancelled) {
                    console.log(error);
                    setHabitStats(null);
                }
            }
        }

        loadSelectedHabitStats();

        return () => {
            cancelled = true;
        };
    }, [selectedHabitId]);

    const selectedHabit = useMemo(
        () => habits.find(habit => habit.id === selectedHabitId) || null,
        [habits, selectedHabitId]
    );

    const categoriesById = useMemo(() => {
        return categories.reduce((accumulator, category) => {
            accumulator[category.id] = category.name;
            return accumulator;
        }, {});
    }, [categories]);

    async function loadData() {
        try {
            const [profile, stats, habitsData, categoryData] = await Promise.all([
                getProfile(),
                getGeneralStatistics(),
                getHabits(),
                getCategories()
            ]);
            setUser(profile);
            setStatistics(stats);
            setHabits(habitsData);
            setCategories(categoryData);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleComplete(id, date) {
        try {
            await completeHabit(id, date);
            await loadData();

            if (selectedHabitId === id) {
                const stats = await getHabitStatistics(id);
                setHabitStats(stats);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function handleSelectHabit(habit) {
        setSelectedHabitId(habit.id);
    }

    function handleOpenCreate() {
        setEditingHabit(null);
        setShowModal(true);
    }

    function handleOpenEdit() {
        if (!selectedHabit) {
            return;
        }

        setEditingHabit(selectedHabit);
        setShowModal(true);
    }

    async function handleSaveHabit() {
        setShowModal(false);
        setEditingHabit(null);
        await loadData();
    }

    function handleLogout() {
        logout();
        navigate("/login", { replace: true });
    }

    function handleToggleDate(date) {
        if (!selectedHabit) {
            return;
        }

        handleComplete(selectedHabit.id, date);
    }

    return (
        <>
            <Header
                statistics={statistics}
                onProfileClick={() => setShowProfile(true)}
                onLogout={handleLogout}
            />

            {showProfile && (
                <ProfileModal
                    user={user}
                    onClose={() => setShowProfile(false)}
                    onLogout={handleLogout}
                />
            )}

            {showModal && (
                <HabitModal
                    habit={editingHabit}
                    onClose={() => setShowModal(false)}
                    onCreated={handleSaveHabit}
                    onSaved={handleSaveHabit}
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
                            categoryName={categoriesById[habit.category_id]}
                            onComplete={handleComplete}
                            onSelect={handleSelectHabit}
                        />
                    ))}

                    <button
                        className="add-habit-btn"
                        onClick={handleOpenCreate}
                    >
                        + Новая привычка
                    </button>
                </div>

                <div className="habit-details">
                    {selectedHabit ? (
                        <div className="habit-details-stack">
                            <HabitDetails
                                habit={selectedHabit}
                                categoryName={categoriesById[selectedHabit.category_id]}
                                onEdit={handleOpenEdit}
                            />
                            <CalendarGrid
                                history={habitStats?.history || []}
                                onToggleDate={handleToggleDate}
                            />
                            <StatisticsPanel statistics={habitStats} />
                        </div>
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
