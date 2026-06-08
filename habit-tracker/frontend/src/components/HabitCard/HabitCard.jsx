import {
    useState,
    useEffect
} from "react";

import ProgressBar
    from "../ProgressBar/ProgressBar";

import {
    getHabitStatistics
}
    from "../../api/statisticsApi";

import "./HabitCard.css";

function HabitCard({

    habit,

    onComplete

}) {

    const [

        statistics,

        setStatistics

    ] = useState(
        null
    );

    useEffect(
        () => {

            loadStatistics();

        },
        []
    );

    async function loadStatistics() {

        try {

            const data =
                await getHabitStatistics(
                    habit.id
                );

            setStatistics(
                data
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

    const hasGoal =

        habit.goal_type !==
        "none";

    let progress = 0;

    if (

        hasGoal
        &&
        statistics

    ) {

        if (

            habit.goal_value > 0

        ) {

            progress =
                Math.min(

                    100,

                    Math.floor(

                        statistics.completedDays

                        /

                        habit.goal_value

                        *

                        100

                    )

                );

        }

    }

    const completedToday =

        statistics &&
        statistics.history.some(
            item => {

                const today =
                    new Date()
                        .toDateString();

                const completed =
                    new Date(
                        item.completed_at
                    ).toDateString();

                return today === completed;

            }
        );

    return (

        <div
            className="habit-card"
        >

            <div
                className="habit-header"
            >

                <div
                    className="habit-title"
                >

                    {habit.title}

                </div>

                <button

                    className=
                    "complete-button"

                    onClick={
                        () =>
                            onComplete(
                                habit.id
                            )
                    }

                >

                    {

                        completedToday
                            ?
                            "✓"
                            :
                            "○"

                    }

                </button>

            </div>

            {

                habit.description
                &&

                <div
                    className="habit-description"
                >

                    {
                        habit.description
                    }

                </div>

            }

            {

                hasGoal
                &&

                <>

                    <div
                        className="habit-goal"
                    >

                        Цель:
                        {" "}

                        {

                            habit.goal_value

                        }

                    </div>

                    <ProgressBar
                        value={
                            progress
                        }
                    />

                </>

            }

        </div>

    );

}

export default HabitCard;