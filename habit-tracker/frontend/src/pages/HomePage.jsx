import {
    useState,
    useEffect
} from "react";

import Header
from "../components/Header/Header";

import ProfileModal
from "../components/ProfileModal/ProfileModal";

import {
    getProfile
}
from "../api/userApi";

import {
    getGeneralStatistics
}
from "../api/statisticsApi";

import useAuth
from "../hooks/useAuth";

function HomePage() {

    const [user, setUser] =
        useState(null);

    const [statistics,
    setStatistics] =
        useState(null);

    const [showProfile,
    setShowProfile] =
        useState(false);

    const {
        logout
    } =
    useAuth();

    useEffect(() => {

        async function loadData() {

            try {

                const profile =
                    await getProfile();

                const stats =
                    await getGeneralStatistics();

                setUser(
                    profile
                );

                setStatistics(
                    stats
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

        loadData();

    }, []);

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

                showProfile

                &&

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

            <div>

                Home Page

            </div>

        </>

    );

}

export default HomePage;