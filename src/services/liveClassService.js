import api from './api';

export const getAllLiveClasses = async (params = {}) => {
  try {
    const response = await api.get('/live-classes', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getLiveClassById = async (id) => {
  try {
    const response = await api.get(`/live-classes/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createLiveClass = async (data) => {
  try {
    const response = await api.post('/live-classes', data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const startLiveClass = async (id) => {
  try {
    const response = await api.post(`/live-classes/${id}/start`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const endLiveClass = async (id) => {
  try {
    const response = await api.post(`/live-classes/${id}/end`);
    return response;
  } catch (error) {
    throw error;
  }
};