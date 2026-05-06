import apiClient from "./client";

export const getChapters = (novelId) =>
  apiClient.get(`/novels/${novelId}/chapters`);

export const getChapter = (chapterId) => apiClient.get(`/chapters/${chapterId}`);

export const createChapter = (novelId, payload) =>
  apiClient.post(`/novels/${novelId}/chapters`, payload);
