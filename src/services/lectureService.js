import api from './api';

export const getAllLectures = async (params = {}) => {
  try {
    const response = await api.get('/lectures', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getLectureById = async (id) => {
  try {
    const response = await api.get(`/lectures/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createLecture = async (formData) => {
  try {
    const response = await api.post('/lectures', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateLecture = async (id, data) => {
  try {
    const response = await api.put(`/lectures/${id}`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteLecture = async (id) => {
  try {
    const response = await api.delete(`/lectures/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getStreamUrl = async (id, quality) => {
  try {
    const response = await api.get(`/lectures/${id}/stream`, {
      params: { quality }
    });
    return response;
  } catch (error) {
    throw error;
  }
};