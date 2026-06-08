function isEmpty(value) {
    return (
        value === undefined
        ||
        value === null
        ||
        String(value).trim() === ""
    );
}

function isPositiveInteger(value) {
    return (
        Number.isInteger(value) && value > 0
    );
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function isValidFrequency(type) {
    return [
        "day",
        "week",
        "month"
    ].includes(type);
}

function isValidGoal(type) {
    return [
        "none",
        "date",
        "streak",
        "total"
    ].includes(type);
}

module.exports = {
    isEmpty,
    isPositiveInteger,
    isValidEmail,
    isValidFrequency,
    isValidGoal
};