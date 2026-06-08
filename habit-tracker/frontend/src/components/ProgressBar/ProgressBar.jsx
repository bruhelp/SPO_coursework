import "./ProgressBar.css";

function ProgressBar({
    value = 0,
    max = 1
}) {

    const percent =
        Math.min(
            100,
            Math.round(
                (value / max) * 100
            )
        );

    return (

        <div className="progress-bar">

            <div
                className="progress-fill"
                style={{
                    width:
                    `${percent}%`
                }}
            />

        </div>

    );

}

export default ProgressBar;