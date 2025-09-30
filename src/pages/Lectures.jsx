import React, { useState, useEffect } from 'react';
import { getAllLectures } from '../services/lectureService';
import LectureList from '../components/lecture/LectureList';
import VideoPlayer from '../components/lecture/VideoPlayer';
import { Search, Filter } from 'lucide-react';
import { SUBJECTS } from '../utils/constants';
import { useNetwork } from '../context/NetworkContext';

const Lectures = () => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const { isOnline } = useNetwork();

  useEffect(() => {
    fetchLectures();
  }, [selectedSubject]);

  const fetchLectures = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedSubject) params.subject = selectedSubject;
      
      const response = await getAllLectures(params);
      setLectures(response.data.lectures || []);
    } catch (error) {
      console.error('Error fetching lectures:', error);
      // Show mock data if offline or error
      setLectures([
        {
          _id: '1',
          title: 'Introduction to Artificial Intelligence',
          instructor: 'Dr. Sharma',
          subject: 'Artificial Intelligence',
          duration: 45,
          thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=225&fit=crop',
          fileSize: 81920000,
          description: 'Learn the basics of AI and machine learning'
        },
        {
          _id: '2',
          title: 'VLSI Design Fundamentals',
          instructor: 'Prof. Kumar',
          subject: 'VLSI',
          duration: 60,
          thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=225&fit=crop',
          fileSize: 96468992,
          description: 'Understanding VLSI design principles'
        },
        {
          _id: '3',
          title: 'Solar Energy Systems',
          instructor: 'Dr. Patel',
          subject: 'Renewable Energy',
          duration: 50,
          thumbnail: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=225&fit=crop',
          fileSize: 68157440,
          description: 'Exploring solar power generation'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLectures = lectures.filter(lecture => {
    const matchesSearch = lecture.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lecture.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Lectures</h2>
        <p className="text-gray-600">
          {isOnline 
            ? 'Browse and download lectures to watch offline' 
            : 'You are offline. Only downloaded lectures are available.'}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search lectures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Subject Filter */}
        <div className="md:w-64 relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
          >
            <option value="">All Subjects</option>
            {SUBJECTS.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lecture List */}
      <LectureList
        lectures={filteredLectures}
        loading={loading}
        onWatch={setSelectedLecture}
      />

      {/* Video Player Modal */}
      {selectedLecture && (
        <VideoPlayer
          lecture={selectedLecture}
          onClose={() => setSelectedLecture(null)}
        />
      )}
    </div>
  );
};

export default Lectures;