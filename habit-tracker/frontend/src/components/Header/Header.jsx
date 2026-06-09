import "./Header.css";

function Header({
    statistics,
    onProfileClick,
    onLogout
}) {
    return (
        <header className="header">
            <div className="header-left">
                Выполнено: {statistics ? statistics.totalCompletions : 0}
            </div>
            <div className="header-title">Трекер привычек</div>
            <div className="header-right">
                <button className="header-avatar" onClick={onProfileClick} aria-label="Профиль">
                    ●
                </button>
                <button className="logout-button" onClick={onLogout}>
                    Выход
                </button>
            </div>
        </header>
    );

}

export default Header;