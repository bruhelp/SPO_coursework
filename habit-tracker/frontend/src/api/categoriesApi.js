import axiosInstance from "./axiosInstance";

export async function getCategories() {
    const response = await axiosInstance.get("/categories");
    return response.data;
}