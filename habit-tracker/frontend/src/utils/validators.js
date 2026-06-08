export function isEmpty(value) {
    return value === undefined || value === null || String(value).trim() === "";
}

export function isPositiveInteger(value) {
    return Number.isInteger(value) && value > 0;
}

export function isValidGoalType(type) {
    return ["none", "date", "streak", "total"].includes(type);
}

export function isValidFrequency(type) {
    return ["day", "week", "month"].includes(type);
}