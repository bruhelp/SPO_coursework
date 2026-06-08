import ProgressBar
    from "../ProgressBar/ProgressBar";

import "./HabitCard.css";

function HabitCard({

    habit,
    onComplete

}) {

    return (

        <div className="habit-card">

            <div className="habit-card-header">

                <div
                    className="habit-title"
                >
                    {habit.title}
                </div>

                <button
                    className="habit-complete"

                    onClick={() =>
                        onComplete(
                            habit.id
                        )
                    }
                >
                    ○
                </button>

            </div>

            {
                habit.goal_type !== "none"
                &&

                (
                    <>
                        <div className="habit-goal">
                            Цель: {habit.goal_value}
                        </div>

                        <ProgressBar
                            value={
                                habit.completed_days || 0
                            }
                            max={
                                habit.goal_value || 1
                            }
                        />
                    </>
                )
            }

            <div className="habit-description">

                {habit.description}

            </div>

        </div>

    );

}

export default HabitCard;