import Dexie from 'dexie';

const db = new Dexie('VirtualClassroomDB');

db.version(1).stores({
  lectures: '++id, lectureId, title, videoBlob, slides, transcript, downloadedAt',
  progress: '++id, lectureId, currentTime, completed'
});

export const openDB = async () => {
  await db.open();
  return db;
};

export const saveLectureOffline = async (lectureData) => {
  try {
    await db.lectures.add({
      lectureId: lectureData.id,
      title: lectureData.title,
      videoBlob: lectureData.videoBlob,
      slides: lectureData.slides,
      transcript: lectureData.transcript,
      downloadedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error saving lecture offline:', error);
    return false;
  }
};

export const getLectureOffline = async (lectureId) => {
  try {
    const lecture = await db.lectures.where('lectureId').equals(lectureId).first();
    return lecture;
  } catch (error) {
    console.error('Error getting lecture offline:', error);
    return null;
  }
};

export const getAllOfflineLectures = async () => {
  try {
    const lectures = await db.lectures.toArray();
    return lectures;
  } catch (error) {
    console.error('Error getting all offline lectures:', error);
    return [];
  }
};

export const deleteOfflineLecture = async (lectureId) => {
  try {
    await db.lectures.where('lectureId').equals(lectureId).delete();
    return true;
  } catch (error) {
    console.error('Error deleting offline lecture:', error);
    return false;
  }
};

export const saveProgress = async (lectureId, currentTime, completed = false) => {
  try {
    const existing = await db.progress.where('lectureId').equals(lectureId).first();
    
    if (existing) {
      await db.progress.update(existing.id, { currentTime, completed });
    } else {
      await db.progress.add({ lectureId, currentTime, completed });
    }
    return true;
  } catch (error) {
    console.error('Error saving progress:', error);
    return false;
  }
};

export const getProgress = async (lectureId) => {
  try {
    const progress = await db.progress.where('lectureId').equals(lectureId).first();
    return progress || { currentTime: 0, completed: false };
  } catch (error) {
    console.error('Error getting progress:', error);
    return { currentTime: 0, completed: false };
  }
};

export default db;