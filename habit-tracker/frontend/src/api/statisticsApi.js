import api from "./axiosInstance";

export async function getGeneralStatistics() {

    const response =
        await api.get(
            "/statistics"
        );

    return response.data;

}

export async function getHabitStatistics(
    habitId
) {

    const response =
        await api.get(
            `/statistics/${habitId}`
        );

    return response.data;

}