import api from './api';
import { API_URL } from '../utils/constants';

export const createLecture = async (formData) => {
  try {
    // Use fetch instead of axios for file upload progress tracking
    const response = await fetch(`${API_URL}/lectures`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary
    });
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// Rest of the exports remain the same
export const getAllLectures = async (params = {}) => {
  try {
    const response = await api.get('/lectures', { params });
    return response;
  } catch (error) {
    throw error;
  }
};