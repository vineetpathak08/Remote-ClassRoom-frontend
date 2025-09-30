import { useState, useEffect } from 'react';
import {
  getAllOfflineLectures,
  getLectureOffline,
  deleteOfflineLecture,
  saveProgress,
  getProgress
} from '../utils/indexedDB';

const useIndexedDB = () => {
  const [offlineLectures, setOfflineLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOfflineLectures = async () => {
    try {
      setLoading(true);
      const lectures = await getAllOfflineLectures();
      setOfflineLectures(lectures);
    } catch (error) {
      console.error('Error loading offline lectures:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOfflineLectures();
  }, []);

  const getOfflineLecture = async (lectureId) => {
    try {
      const lecture = await getLectureOffline(lectureId);
      return lecture;
    } catch (error) {
      console.error('Error getting offline lecture:', error);
      return null;
    }
  };

  const deleteOffline = async (lectureId) => {
    try {
      await deleteOfflineLecture(lectureId);
      await loadOfflineLectures(); // Reload the list
      return true;
    } catch (error) {
      console.error('Error deleting offline lecture:', error);
      return false;
    }
  };

  const updateProgress = async (lectureId, currentTime, completed = false) => {
    try {
      await saveProgress(lectureId, currentTime, completed);
      return true;
    } catch (error) {
      console.error('Error updating progress:', error);
      return false;
    }
  };

  const fetchProgress = async (lectureId) => {
    try {
      const progress = await getProgress(lectureId);
      return progress;
    } catch (error) {
      console.error('Error fetching progress:', error);
      return { currentTime: 0, completed: false };
    }
  };

  return {
    offlineLectures,
    loading,
    loadOfflineLectures,
    getOfflineLecture,
    deleteOffline,
    updateProgress,
    fetchProgress
  };
};

export default useIndexedDB;