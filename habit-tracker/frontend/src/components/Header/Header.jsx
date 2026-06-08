import "./Header.css";

function Header({

    statistics,

    onProfileClick,

    onLogout

}) {

    return (

        <header
            className="header"
        >

            <div
                className="header-left"
            >

                Выполнено:
                {" "}
                {
                    statistics
                    ?
                    statistics.totalCompletions
                    :
                    0
                }

            </div>

            <div
                className="header-title"
            >

                Habit Tracker

            </div>

            <div
                className="header-right"
            >

                <div

                    className=
                    "header-avatar"

                    onClick={
                        onProfileClick
                    }

                >

                    ●

                </div>

                <button

                    className=
                    "logout-button"

                    onClick={
                        onLogout
                    }

                >

                    Выход

                </button>

            </div>

        </header>

    );

}

export default Header;