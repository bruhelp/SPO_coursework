import axiosInstance from "./axiosInstance";

export async function getHabits(options = {}) {
    const params = {};

    if (options.includeArchived) {
        params.includeArchived = "true";
    }

    const response = await axiosInstance.get("/habits", { params });
    return response.data;
}

export async function completeHabit(id, date) {
    const payload = date ? { date } : undefined;
    const response = await axiosInstance.patch(`/habits/${id}/complete`, payload);
    return response.data;
}

export async function createHabit(data) {
    const response = await axiosInstance.post("/habits", data);
    return response.data;
}

export async function updateHabit(id, data) {
    const response = await axiosInstance.put(`/habits/${id}`, data);
    return response.data;
}

export async function archiveHabit(id) {
    const response = await axiosInstance.patch(`/habits/${id}/archive`);
    return response.data;
}