import { useState } from 'react';
import { downloadLecture, trackDownload } from '../services/downloadService';
import { saveLectureOffline } from '../utils/indexedDB';
import { useApp } from '../context/AppContext';

const useDownload = () => {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const { incrementDataUsage } = useApp();

  const startDownload = async (lecture, quality) => {
    try {
      setDownloading(true);
      setError(null);
      setProgress(0);

      // Track download on server
      await trackDownload(lecture._id, quality);

      // Download the file
      const blob = await downloadLecture(lecture._id, quality, (progressValue) => {
        setProgress(progressValue);
      });

      // Save to IndexedDB
      await saveLectureOffline({
        id: lecture._id,
        title: lecture.title,
        videoBlob: blob,
        slides: lecture.slides || [],
        transcript: lecture.transcript || '',
        quality,
        instructor: lecture.instructor,
        subject: lecture.subject,
        duration: lecture.duration
      });

      // Update data usage
      incrementDataUsage(blob.size);

      setDownloading(false);
      setProgress(100);
      return true;
    } catch (err) {
      setError(err.message || 'Download failed');
      setDownloading(false);
      return false;
    }
  };

  return { startDownload, downloading, progress, error };
};

export default useDownload;