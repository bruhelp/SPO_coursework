import "./ProfileModal.css";

function ProfileModal({

    user,

    onClose

}) {

    if (
        !user
    ) {

        return null;

    }

    return (

        <div
            className="modal-overlay"
        >

            <div
                className="profile-modal"
            >

                <h2>
                    Профиль
                </h2>

                <p>

                    <strong>
                        Имя:
                    </strong>

                    {" "}

                    {user.username}

                </p>

                <p>

                    <strong>
                        Email:
                    </strong>

                    {" "}

                    {user.email}

                </p>

                <button
                    onClick={
                        onClose
                    }
                >

                    Закрыть

                </button>

            </div>

        </div>

    );

}

export default ProfileModal;