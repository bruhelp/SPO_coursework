import api from "./axiosInstance";

export async function getProfile() {

    const response =
        await api.get(
            "/user/profile"
        );

    return response.data;

}