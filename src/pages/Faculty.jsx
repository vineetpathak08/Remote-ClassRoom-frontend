// import React, { useState } from 'react';
// import { Upload, Video, FileText, Send, Plus, CheckCircle, AlertCircle } from 'lucide-react';
// import { createLecture } from '../services/lectureService';
// import { createLiveClass } from '../services/liveClassService';
// import { SUBJECTS } from '../utils/constants';

// const Faculty = () => {
//   const [activeTab, setActiveTab] = useState('upload');
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [message, setMessage] = useState({ type: '', text: '' });
  
//   const [lectureData, setLectureData] = useState({
//     title: '',
//     description: '',
//     instructor: '',
//     subject: '',
//     duration: ''
//   });
  
//   const [liveClassData, setLiveClassData] = useState({
//     title: '',
//     instructor: '',
//     subject: '',
//     scheduledTime: '',
//     duration: ''
//   });
  
//   const [files, setFiles] = useState({
//     video: null,
//     thumbnail: null,
//     slides: []
//   });

//   const handleLectureInputChange = (e) => {
//     setLectureData({
//       ...lectureData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleLiveClassInputChange = (e) => {
//     setLiveClassData({
//       ...liveClassData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleFileChange = (e) => {
//     const { name, files: selectedFiles } = e.target;
//     if (name === 'slides') {
//       setFiles({ ...files, [name]: Array.from(selectedFiles) });
//     } else {
//       setFiles({ ...files, [name]: selectedFiles[0] });
//     }
//   };

//   const handleUploadLecture = async (e) => {
//     e.preventDefault();
    
//     if (!files.video) {
//       setMessage({ type: 'error', text: 'Please select a video file' });
//       return;
//     }

//     const uploadData = new FormData();
//     Object.keys(lectureData).forEach(key => {
//       uploadData.append(key, lectureData[key]);
//     });
    
//     if (files.video) uploadData.append('video', files.video);
//     if (files.thumbnail) uploadData.append('thumbnail', files.thumbnail);
//     files.slides.forEach(slide => {
//       uploadData.append('slides', slide);
//     });

//     try {
//       setUploading(true);
//       setUploadProgress(0);
      
//       // Simulate upload progress
//       const progressInterval = setInterval(() => {
//         setUploadProgress(prev => {
//           if (prev >= 90) {
//             clearInterval(progressInterval);
//             return prev;
//           }
//           return prev + 10;
//         });
//       }, 500);

//       await createLecture(uploadData);
      
//       clearInterval(progressInterval);
//       setUploadProgress(100);
      
//       setMessage({ type: 'success', text: 'Lecture uploaded successfully!' });
      
//       // Reset form
//       setLectureData({ title: '', description: '', instructor: '', subject: '', duration: '' });
//       setFiles({ video: null, thumbnail: null, slides: [] });
      
//       // Reset file inputs
//       document.getElementById('video-upload').value = '';
//       document.getElementById('thumbnail-upload').value = '';
//       document.getElementById('slides-upload').value = '';
      
//       setTimeout(() => {
//         setUploadProgress(0);
//         setMessage({ type: '', text: '' });
//       }, 3000);
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Error uploading lecture: ' + (error.message || 'Unknown error') });
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleScheduleLiveClass = async (e) => {
//     e.preventDefault();
    
//     try {
//       await createLiveClass(liveClassData);
//       setMessage({ type: 'success', text: 'Live class scheduled successfully!' });
//       setLiveClassData({ title: '', instructor: '', subject: '', scheduledTime: '', duration: '' });
      
//       setTimeout(() => {
//         setMessage({ type: '', text: '' });
//       }, 3000);
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Error scheduling live class: ' + (error.message || 'Unknown error') });
//     }
//   };

//   return (
//     <div>
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">Faculty Dashboard</h2>
//         <p className="text-gray-600">Upload lectures and manage live classes</p>
//       </div>

//       {/* Alert Messages */}
//       {message.text && (
//         <div className={`mb-6 p-4 rounded-lg flex items-center ${
//           message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
//         }`}>
//           {message.type === 'success' ? (
//             <CheckCircle className="w-5 h-5 mr-3" />
//           ) : (
//             <AlertCircle className="w-5 h-5 mr-3" />
//           )}
//           <span>{message.text}</span>
//         </div>
//       )}

//       {/* Tabs */}
//       <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
//         <div className="flex border-b">
//           <button
//             onClick={() => setActiveTab('upload')}
//             className={`flex-1 py-3 px-4 font-medium text-sm flex items-center justify-center ${
//               activeTab === 'upload'
//                 ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
//                 : 'text-gray-600 hover:bg-gray-50'
//             }`}
//           >
//             <Upload className="w-4 h-4 mr-2" />
//             Upload Lecture
//           </button>
//           <button
//             onClick={() => setActiveTab('schedule')}
//             className={`flex-1 py-3 px-4 font-medium text-sm flex items-center justify-center ${
//               activeTab === 'schedule'
//                 ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
//                 : 'text-gray-600 hover:bg-gray-50'
//             }`}
//           >
//             <Video className="w-4 h-4 mr-2" />
//             Schedule Live Class
//           </button>
//         </div>

//         <div className="p-6">
//           {/* Upload Lecture Form */}
//           {activeTab === 'upload' && (
//             <form onSubmit={handleUploadLecture} className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Lecture Title *
//                 </label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={lectureData.title}
//                   onChange={handleLectureInputChange}
//                   required
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="e.g., Introduction to Machine Learning"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Description
//                 </label>
//                 <textarea
//                   name="description"
//                   value={lectureData.description}
//                   onChange={handleLectureInputChange}
//                   rows={4}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Brief description of the lecture content..."
//                 />
//               </div>

//               <div className="grid md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Instructor Name *
//                   </label>
//                   <input
//                     type="text"
//                     name="instructor"
//                     value={lectureData.instructor}
//                     onChange={handleLectureInputChange}
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="Dr. John Doe"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Subject *
//                   </label>
//                   <select
//                     name="subject"
//                     value={lectureData.subject}
//                     onChange={handleLectureInputChange}
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select Subject</option>
//                     {SUBJECTS.map(subject => (
//                       <option key={subject} value={subject}>{subject}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Duration (minutes) *
//                   </label>
//                   <input
//                     type="number"
//                     name="duration"
//                     value={lectureData.duration}
//                     onChange={handleLectureInputChange}
//                     required
//                     min="1"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="45"
//                   />
//                 </div>
//               </div>

//               {/* File Uploads */}
//               <div className="border-t pt-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Files</h3>
                
//                 <div className="space-y-4">
//                   {/* Video Upload */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Video File * (MP4, AVI, MOV)
//                     </label>
//                     <div className="flex items-center space-x-4">
//                       <label className="flex-1 flex items-center justify-center px-4 py-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-500 transition">
//                         <div className="text-center">
//                           <Video className="mx-auto h-12 w-12 text-gray-400" />
//                           <p className="mt-2 text-sm text-gray-600">
//                             {files.video ? files.video.name : 'Click to upload video'}
//                           </p>
//                           <p className="text-xs text-gray-500 mt-1">Max size: 500 MB</p>
//                         </div>
//                         <input
//                           id="video-upload"
//                           type="file"
//                           name="video"
//                           onChange={handleFileChange}
//                           accept="video/mp4,video/avi,video/mov"
//                           className="hidden"
//                         />
//                       </label>
//                     </div>
//                   </div>

//                   {/* Thumbnail Upload */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Thumbnail Image (Optional)
//                     </label>
//                     <div className="flex items-center space-x-4">
//                       <label className="flex-1 flex items-center justify-center px-4 py-4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-500 transition">
//                         <div className="text-center">
//                           <FileText className="mx-auto h-8 w-8 text-gray-400" />
//                           <p className="mt-1 text-sm text-gray-600">
//                             {files.thumbnail ? files.thumbnail.name : 'Upload thumbnail'}
//                           </p>
//                         </div>
//                         <input
//                           id="thumbnail-upload"
//                           type="file"
//                           name="thumbnail"
//                           onChange={handleFileChange}
//                           accept="image/*"
//                           className="hidden"
//                         />
//                       </label>
//                     </div>
//                   </div>

//                   {/* Slides Upload */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Slides (Optional, PDF/PPT)
//                     </label>
//                     <div className="flex items-center space-x-4">
//                       <label className="flex-1 flex items-center justify-center px-4 py-4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-500 transition">
//                         <div className="text-center">
//                           <FileText className="mx-auto h-8 w-8 text-gray-400" />
//                           <p className="mt-1 text-sm text-gray-600">
//                             {files.slides.length > 0 ? `${files.slides.length} file(s) selected` : 'Upload slides'}
//                           </p>
//                         </div>
//                         <input
//                           id="slides-upload"
//                           type="file"
//                           name="slides"
//                           onChange={handleFileChange}
//                           accept=".pdf,.ppt,.pptx"
//                           multiple
//                           className="hidden"
//                         />
//                       </label>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Upload Progress */}
//               {uploading && (
//                 <div className="border-t pt-6">
//                   <div className="mb-2 flex justify-between text-sm">
//                     <span className="font-medium text-gray-700">Uploading...</span>
//                     <span className="text-gray-600">{uploadProgress}%</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-3">
//                     <div
//                       className="bg-blue-600 h-3 rounded-full transition-all duration-300"
//                       style={{ width: `${uploadProgress}%` }}
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* Submit Button */}
//               <div className="flex justify-end space-x-4 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setLectureData({ title: '', description: '', instructor: '', subject: '', duration: '' });
//                     setFiles({ video: null, thumbnail: null, slides: [] });
//                   }}
//                   className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
//                 >
//                   Reset
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={uploading}
//                   className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
//                 >
//                   <Upload className="w-4 h-4 mr-2" />
//                   {uploading ? 'Uploading...' : 'Upload Lecture'}
//                 </button>
//               </div>
//             </form>
//           )}

//           {/* Schedule Live Class Form */}
//           {activeTab === 'schedule' && (
//             <form onSubmit={handleScheduleLiveClass} className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Class Title *
//                 </label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={liveClassData.title}
//                   onChange={handleLiveClassInputChange}
//                   required
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="e.g., Neural Networks Deep Dive"
//                 />
//               </div>

//               <div className="grid md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Instructor Name *
//                   </label>
//                   <input
//                     type="text"
//                     name="instructor"
//                     value={liveClassData.instructor}
//                     onChange={handleLiveClassInputChange}
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="Dr. John Doe"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Subject *
//                   </label>
//                   <select
//                     name="subject"
//                     value={liveClassData.subject}
//                     onChange={handleLiveClassInputChange}
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select Subject</option>
//                     {SUBJECTS.map(subject => (
//                       <option key={subject} value={subject}>{subject}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="grid md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Scheduled Date & Time *
//                   </label>
//                   <input
//                     type="datetime-local"
//                     name="scheduledTime"
//                     value={liveClassData.scheduledTime}
//                     onChange={handleLiveClassInputChange}
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Duration (minutes) *
//                   </label>
//                   <input
//                     type="number"
//                     name="duration"
//                     value={liveClassData.duration}
//                     onChange={handleLiveClassInputChange}
//                     required
//                     min="1"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="60"
//                   />
//                 </div>
//               </div>

//               {/* Info Box */}
//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                 <div className="flex">
//                   <div className="flex-shrink-0">
//                     <Video className="h-5 w-5 text-blue-600" />
//                   </div>
//                   <div className="ml-3">
//                     <h3 className="text-sm font-medium text-blue-800">Live Class Features</h3>
//                     <div className="mt-2 text-sm text-blue-700">
//                       <ul className="list-disc pl-5 space-y-1">
//                         <li>Audio-first streaming for low bandwidth</li>
//                         <li>Real-time chat and Q&A</li>
//                         <li>Screen sharing and slides</li>
//                         <li>Automatic recording for later viewing</li>
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <div className="flex justify-end space-x-4">
//                 <button
//                   type="button"
//                   onClick={() => setLiveClassData({ title: '', instructor: '', subject: '', scheduledTime: '', duration: '' })}
//                   className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
//                 >
//                   Reset
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center"
//                 >
//                   <Send className="w-4 h-4 mr-2" />
//                   Schedule Class
//                 </button>
//               </div>
//             </form>
//           )}
//         </div>
//       </div>

//       {/* Tips Section */}
//       <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
//         <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
//           <FileText className="w-5 h-5 mr-2 text-blue-600" />
//           Tips for Better Learning Experience
//         </h3>
//         <ul className="space-y-2 text-sm text-gray-700">
//           <li className="flex items-start">
//             <span className="text-blue-600 mr-2">•</span>
//             <span>Keep video files under 500 MB for faster uploads</span>
//           </li>
//           <li className="flex items-start">
//             <span className="text-blue-600 mr-2">•</span>
//             <span>Use clear audio quality - students may use audio-only mode on low bandwidth</span>
//           </li>
//           <li className="flex items-start">
//             <span className="text-blue-600 mr-2">•</span>
//             <span>Include timestamps in descriptions for easy navigation</span>
//           </li>
//           <li className="flex items-start">
//             <span className="text-blue-600 mr-2">•</span>
//             <span>Upload slides separately for students with very limited data</span>
//           </li>
//           <li className="flex items-start">
//             <span className="text-blue-600 mr-2">•</span>
//             <span>Schedule live classes during off-peak hours when data is cheaper</span>
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Faculty;




import React, { useState } from 'react';
import { Upload, Video, Calendar, Play, Mic } from 'lucide-react';

const Faculty = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    instructor: '',
    subject: '',
    duration: '',
    video: null,
    thumbnail: null,
    slides: []
  });
  const [liveClassForm, setLiveClassForm] = useState({
    title: '',
    instructor: '',
    subject: '',
    scheduledTime: '',
    duration: 60,
    audioOnly: false
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const SUBJECTS = [
    'Artificial Intelligence',
    'VLSI',
    'Renewable Energy',
    'Machine Learning',
    'Data Science',
    'IoT',
    'Blockchain',
    'Cybersecurity'
  ];

  const handleUploadChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      if (name === 'slides') {
        setUploadForm(prev => ({ ...prev, [name]: Array.from(files) }));
      } else {
        setUploadForm(prev => ({ ...prev, [name]: files[0] }));
      }
    } else {
      setUploadForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLectureUpload = async () => {
    if (!uploadForm.title || !uploadForm.instructor || !uploadForm.subject || !uploadForm.duration) {
      alert('Please fill in all required fields');
      return;
    }

    setUploading(true);
    
    const formData = new FormData();
    formData.append('title', uploadForm.title);
    formData.append('description', uploadForm.description);
    formData.append('instructor', uploadForm.instructor);
    formData.append('subject', uploadForm.subject);
    formData.append('duration', uploadForm.duration);
    
    if (uploadForm.video) formData.append('video', uploadForm.video);
    if (uploadForm.thumbnail) formData.append('thumbnail', uploadForm.thumbnail);
    uploadForm.slides.forEach(slide => formData.append('slides', slide));

    try {
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      alert('Lecture uploaded successfully!');
      setUploadForm({
        title: '',
        description: '',
        instructor: '',
        subject: '',
        duration: '',
        video: null,
        thumbnail: null,
        slides: []
      });
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleStartInstantClass = () => {
    if (!liveClassForm.title || !liveClassForm.instructor) {
      alert('Please fill in title and instructor name');
      return;
    }
    alert('Starting instant live class with ' + (liveClassForm.audioOnly ? 'audio-only mode' : 'video mode'));
  };

  const handleScheduleClass = () => {
    if (!liveClassForm.title || !liveClassForm.instructor || !liveClassForm.scheduledTime) {
      alert('Please fill in all required fields');
      return;
    }

    alert('Class scheduled successfully!');
    setLiveClassForm({
      title: '',
      instructor: '',
      subject: '',
      scheduledTime: '',
      duration: 60,
      audioOnly: false
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Faculty Dashboard</h2>
        <p className="text-gray-600">Upload lectures or start live classes</p>
      </div>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition ${
            activeTab === 'upload'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Upload Lecture
        </button>
        <button
          onClick={() => setActiveTab('live')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition ${
            activeTab === 'live'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Video className="w-4 h-4 inline mr-2" />
          Live Class
        </button>
      </div>

      {activeTab === 'upload' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lecture Title *
              </label>
              <input
                type="text"
                name="title"
                value={uploadForm.title}
                onChange={handleUploadChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Introduction to Machine Learning"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={uploadForm.description}
                onChange={handleUploadChange}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Brief description of the lecture content..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructor Name *
                </label>
                <input
                  type="text"
                  name="instructor"
                  value={uploadForm.instructor}
                  onChange={handleUploadChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Dr. Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <select
                  name="subject"
                  value={uploadForm.subject}
                  onChange={handleUploadChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select Subject</option>
                  {SUBJECTS.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes) *
              </label>
              <input
                type="number"
                name="duration"
                value={uploadForm.duration}
                onChange={handleUploadChange}
                min="1"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="45"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video File * (MP4, AVI, MOV)
              </label>
              <input
                type="file"
                name="video"
                onChange={handleUploadChange}
                accept="video/*"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Max file size: 500 MB</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thumbnail Image
              </label>
              <input
                type="file"
                name="thumbnail"
                onChange={handleUploadChange}
                accept="image/*"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slides (PDFs/PPTs)
              </label>
              <input
                type="file"
                name="slides"
                onChange={handleUploadChange}
                accept=".pdf,.ppt,.pptx"
                multiple
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {uploading && (
              <div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-center text-gray-600">{uploadProgress}%</p>
              </div>
            )}

            <button
              onClick={handleLectureUpload}
              disabled={uploading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center"
            >
              <Upload className="w-5 h-5 mr-2" />
              {uploading ? `Uploading... ${uploadProgress}%` : 'Upload Lecture'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'live' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Start Instant Class</h3>
                <p className="text-sm text-gray-600">Begin teaching immediately</p>
              </div>
              <label className="flex items-center text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={liveClassForm.audioOnly}
                  onChange={(e) => setLiveClassForm(prev => ({ ...prev, audioOnly: e.target.checked }))}
                  className="mr-2"
                />
                <Mic className="w-4 h-4 mr-1" />
                Audio-Only Mode
              </label>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Class Title *"
                value={liveClassForm.title}
                onChange={(e) => setLiveClassForm(prev => ({ ...prev, title: e.target.value }))}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Instructor Name *"
                value={liveClassForm.instructor}
                onChange={(e) => setLiveClassForm(prev => ({ ...prev, instructor: e.target.value }))}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleStartInstantClass}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 flex items-center justify-center"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Live Class Now
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Schedule Future Class</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class Title *
                </label>
                <input
                  type="text"
                  value={liveClassForm.title}
                  onChange={(e) => setLiveClassForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Advanced Neural Networks"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instructor *
                  </label>
                  <input
                    type="text"
                    value={liveClassForm.instructor}
                    onChange={(e) => setLiveClassForm(prev => ({ ...prev, instructor: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Dr. Kumar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <select
                    value={liveClassForm.subject}
                    onChange={(e) => setLiveClassForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select Subject</option>
                    {SUBJECTS.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={liveClassForm.scheduledTime}
                    onChange={(e) => setLiveClassForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    value={liveClassForm.duration}
                    onChange={(e) => setLiveClassForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                    min="15"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleScheduleClass}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Class
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Faculty;