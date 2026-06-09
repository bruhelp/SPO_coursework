import "./ProfileModal.css";

function ProfileModal({ user, onClose, onLogout }) {
    if (!user) {
        return null;
    }

    const createdAt = user.created_at
        ? new Date(user.created_at).toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric"
        })
        : "—";

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="profile-modal" onClick={e => e.stopPropagation()}>
                <h2>Профиль</h2>
                <p><strong>Имя:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Дата регистрации:</strong> {createdAt}</p>
                <div className="profile-modal-actions">
                    <button className="profile-modal-logout" onClick={onLogout}>Logout</button>
                    <button className="profile-modal-close" onClick={onClose}>Закрыть</button>
                </div>
            </div>
        </div>
    );
}

export default ProfileModal;