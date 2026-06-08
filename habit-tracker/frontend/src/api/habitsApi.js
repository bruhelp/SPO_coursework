import axiosInstance from "./axiosInstance";

export async function getHabits() {

    const response =
        await axiosInstance.get(
            "/habits"
        );

    return response.data;

}

export async function completeHabit(
    id
) {

    const response =
        await axiosInstance.patch(
            `/habits/${id}/complete`
        );

    return response.data;

}