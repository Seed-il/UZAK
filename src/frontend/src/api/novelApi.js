import apiClient from "./client";

export const getNovels = (params) => apiClient.get("/novels", { params });

export const getNovel = (novelId) => apiClient.get(`/novels/${novelId}`);

export const createNovel = (payload) => apiClient.post("/novels", payload);
