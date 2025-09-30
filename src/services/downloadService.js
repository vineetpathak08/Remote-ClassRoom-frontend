import api from './api';
import { API_URL } from '../utils/constants';

export const trackDownload = async (lectureId, quality) => {
  try {
    const response = await api.post('/downloads/track', { lectureId, quality });
    return response;
  } catch (error) {
    throw error;
  }
};

export const downloadLecture = async (lectureId, quality, onProgress) => {
  try {
    const response = await fetch(`${API_URL}/downloads/lecture/${lectureId}?quality=${quality}`);
    
    if (!response.ok) {
      throw new Error('Download failed');
    }

    const contentLength = response.headers.get('content-length');
    const total = parseInt(contentLength, 10);
    let loaded = 0;

    const reader = response.body.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      chunks.push(value);
      loaded += value.length;
      
      if (onProgress) {
        const progress = (loaded / total) * 100;
        onProgress(progress);
      }
    }

    const blob = new Blob(chunks);
    return blob;
  } catch (error) {
    throw error;
  }
};

export const getDownloadStats = async () => {
  try {
    const response = await api.get('/downloads/stats');
    return response;
  } catch (error) {
    throw error;
  }
};