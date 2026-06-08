import {
    useState,
    useEffect
} from "react";

import Header
from "../components/Header/Header";

import ProfileModal
from "../components/ProfileModal/ProfileModal";

import HabitCard
from "../components/HabitCard/HabitCard";

import {
    getProfile
}
from "../api/userApi";

import {
    getGeneralStatistics
}
from "../api/statisticsApi";

import {
    getHabits,
    completeHabit
}
from "../api/habitsApi";

import useAuth
from "../hooks/useAuth";

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

            <div className="home-page">

                <div className="habit-list">

                    {

                        habits.map(
                            habit => (

                                <HabitCard

                                    key={
                                        habit.id
                                    }

                                    habit={
                                        habit
                                    }

                                    onComplete={
                                        handleComplete
                                    }

                                />

                            )
                        )

                    }

                </div>

                <div className="habit-details">

                    <h2>
                        Детали привычки
                    </h2>

                    <p>
                        Будут реализованы
                        на этапе 3.6
                    </p>

                </div>

            </div>

        </>

    );

}

export default HomePage;