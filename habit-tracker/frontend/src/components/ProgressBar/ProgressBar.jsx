import "./ProgressBar.css";

function ProgressBar({ current = 0, target = 0, value }) {
    // Support both (current, target) and legacy (value) prop
    let percent;
    if (value !== undefined) {
        percent = Math.min(100, Math.max(0, value));
    } else {
        percent = target > 0
            ? Math.min(100, Math.floor((current / target) * 100))
            : 0;
    }

    return (
        <div className="progress-bar" title={`${percent}%`}>
            <div
                className="progress-fill"
                style={{ width: `${percent}%` }}
            />
        </div>
    );
}

export default ProgressBar;
