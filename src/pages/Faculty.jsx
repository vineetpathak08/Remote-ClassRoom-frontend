
// import React, { useState } from 'react';
// import { Upload, Video, Calendar, Play, Mic } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { createLiveClass, startLiveClass } from '../services/liveClassService';

// const Faculty = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('upload');
//   const [uploadForm, setUploadForm] = useState({
//     title: '',
//     description: '',
//     instructor: '',
//     subject: '',
//     duration: '',
//     video: null,
//     thumbnail: null,
//     slides: []
//   });
//   const [liveClassForm, setLiveClassForm] = useState({
//     title: '',
//     instructor: '',
//     subject: '',
//     scheduledTime: '',
//     duration: 60,
//     audioOnly: false
//   });
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);

//   const SUBJECTS = [
//     'Artificial Intelligence',
//     'VLSI',
//     'Renewable Energy',
//     'Machine Learning',
//     'Data Science',
//     'IoT',
//     'Blockchain',
//     'Cybersecurity'
//   ];

//   const handleUploadChange = (e) => {
//     const { name, value, files } = e.target;
//     if (files) {
//       if (name === 'slides') {
//         setUploadForm(prev => ({ ...prev, [name]: Array.from(files) }));
//       } else {
//         setUploadForm(prev => ({ ...prev, [name]: files[0] }));
//       }
//     } else {
//       setUploadForm(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleLectureUpload = async () => {
//     if (!uploadForm.title || !uploadForm.instructor || !uploadForm.subject || !uploadForm.duration) {
//       alert('Please fill in all required fields');
//       return;
//     }

//     setUploading(true);
    
//     const formData = new FormData();
//     formData.append('title', uploadForm.title);
//     formData.append('description', uploadForm.description);
//     formData.append('instructor', uploadForm.instructor);
//     formData.append('subject', uploadForm.subject);
//     formData.append('duration', uploadForm.duration);
    
//     if (uploadForm.video) formData.append('video', uploadForm.video);
//     if (uploadForm.thumbnail) formData.append('thumbnail', uploadForm.thumbnail);
//     uploadForm.slides.forEach(slide => formData.append('slides', slide));

//     try {
//       for (let i = 0; i <= 100; i += 10) {
//         setUploadProgress(i);
//         await new Promise(resolve => setTimeout(resolve, 500));
//       }
      
//       alert('Lecture uploaded successfully!');
//       setUploadForm({
//         title: '',
//         description: '',
//         instructor: '',
//         subject: '',
//         duration: '',
//         video: null,
//         thumbnail: null,
//         slides: []
//       });
//     } catch (error) {
//       alert('Upload failed: ' + error.message);
//     } finally {
//       setUploading(false);
//       setUploadProgress(0);
//     }
//   };

//   const handleStartInstantClass = async () => {
//     if (!liveClassForm.title || !liveClassForm.instructor) {
//       alert('Please fill in title and instructor name');
//       return;
//     }

//     try {
//       const payload = {
//         title: liveClassForm.title,
//         instructor: liveClassForm.instructor,
//         subject: liveClassForm.subject || 'General',
//         scheduledTime: new Date().toISOString(),
//         duration: liveClassForm.duration || 60,
//       };

//       const createdRes = await createLiveClass(payload);
//       const created = createdRes.data?.data || createdRes.data;

//       const startedRes = await startLiveClass(created._id);
//       const started = startedRes.data?.data || startedRes.data;

//       navigate('/live-classes', { state: { instant: true, liveClass: started, role: 'instructor', audioOnly: liveClassForm.audioOnly } });
//     } catch (err) {
//       alert('Failed to start live class: ' + (err?.message || 'Unknown error'));
//     }
//   };

//   const handleScheduleClass = () => {
//     if (!liveClassForm.title || !liveClassForm.instructor || !liveClassForm.scheduledTime) {
//       alert('Please fill in all required fields');
//       return;
//     }

//     alert('Class scheduled successfully!');
//     setLiveClassForm({
//       title: '',
//       instructor: '',
//       subject: '',
//       scheduledTime: '',
//       duration: 60,
//       audioOnly: false
//     });
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-4">
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">Faculty Dashboard</h2>
//         <p className="text-gray-600">Upload lectures or start live classes</p>
//       </div>

//       <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
//         <button
//           onClick={() => setActiveTab('upload')}
//           className={`flex-1 py-2 px-4 rounded-md font-medium transition ${
//             activeTab === 'upload'
//               ? 'bg-white text-blue-600 shadow-sm'
//               : 'text-gray-600 hover:text-gray-900'
//           }`}
//         >
//           <Upload className="w-4 h-4 inline mr-2" />
//           Upload Lecture
//         </button>
//         <button
//           onClick={() => setActiveTab('live')}
//           className={`flex-1 py-2 px-4 rounded-md font-medium transition ${
//             activeTab === 'live'
//               ? 'bg-white text-blue-600 shadow-sm'
//               : 'text-gray-600 hover:text-gray-900'
//           }`}
//         >
//           <Video className="w-4 h-4 inline mr-2" />
//           Live Class
//         </button>
//       </div>

//       {activeTab === 'upload' && (
//         <div className="bg-white rounded-lg shadow-sm border p-6">
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Lecture Title *
//               </label>
//               <input
//                 type="text"
//                 name="title"
//                 value={uploadForm.title}
//                 onChange={handleUploadChange}
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 placeholder="Introduction to Machine Learning"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 value={uploadForm.description}
//                 onChange={handleUploadChange}
//                 rows={3}
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 placeholder="Brief description of the lecture content..."
//               />
//             </div>

//             <div className="grid md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Instructor Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="instructor"
//                   value={uploadForm.instructor}
//                   onChange={handleUploadChange}
//                   className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                   placeholder="Dr. Smith"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Subject *
//                 </label>
//                 <select
//                   name="subject"
//                   value={uploadForm.subject}
//                   onChange={handleUploadChange}
//                   className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 >
//                   <option value="">Select Subject</option>
//                   {SUBJECTS.map(subject => (
//                     <option key={subject} value={subject}>{subject}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Duration (minutes) *
//               </label>
//               <input
//                 type="number"
//                 name="duration"
//                 value={uploadForm.duration}
//                 onChange={handleUploadChange}
//                 min="1"
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 placeholder="45"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Video File * (MP4, AVI, MOV)
//               </label>
//               <input
//                 type="file"
//                 name="video"
//                 onChange={handleUploadChange}
//                 accept="video/*"
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//               />
//               <p className="text-xs text-gray-500 mt-1">Max file size: 500 MB</p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Thumbnail Image
//               </label>
//               <input
//                 type="file"
//                 name="thumbnail"
//                 onChange={handleUploadChange}
//                 accept="image/*"
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Slides (PDFs/PPTs)
//               </label>
//               <input
//                 type="file"
//                 name="slides"
//                 onChange={handleUploadChange}
//                 accept=".pdf,.ppt,.pptx"
//                 multiple
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//               />
//             </div>

//             {uploading && (
//               <div>
//                 <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
//                   <div
//                     className="bg-blue-600 h-3 rounded-full transition-all"
//                     style={{ width: `${uploadProgress}%` }}
//                   />
//                 </div>
//                 <p className="text-sm text-center text-gray-600">{uploadProgress}%</p>
//               </div>
//             )}

//             <button
//               onClick={handleLectureUpload}
//               disabled={uploading}
//               className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center"
//             >
//               <Upload className="w-5 h-5 mr-2" />
//               {uploading ? `Uploading... ${uploadProgress}%` : 'Upload Lecture'}
//             </button>
//           </div>
//         </div>
//       )}

//       {activeTab === 'live' && (
//         <div className="space-y-6">
//           <div className="bg-white rounded-lg shadow-sm border p-6">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <h3 className="text-lg font-bold text-gray-900">Start Instant Class</h3>
//                 <p className="text-sm text-gray-600">Begin teaching immediately</p>
//               </div>
//               <label className="flex items-center text-sm cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={liveClassForm.audioOnly}
//                   onChange={(e) => setLiveClassForm(prev => ({ ...prev, audioOnly: e.target.checked }))}
//                   className="mr-2"
//                 />
//                 <Mic className="w-4 h-4 mr-1" />
//                 Audio-Only Mode
//               </label>
//             </div>

//             <div className="grid md:grid-cols-2 gap-4 mb-4">
//               <input
//                 type="text"
//                 placeholder="Class Title *"
//                 value={liveClassForm.title}
//                 onChange={(e) => setLiveClassForm(prev => ({ ...prev, title: e.target.value }))}
//                 className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//               />
//               <input
//                 type="text"
//                 placeholder="Instructor Name *"
//                 value={liveClassForm.instructor}
//                 onChange={(e) => setLiveClassForm(prev => ({ ...prev, instructor: e.target.value }))}
//                 className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//               />
//             </div>

//             <button
//               onClick={handleStartInstantClass}
//               className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 flex items-center justify-center"
//             >
//               <Play className="w-5 h-5 mr-2" />
//               Start Live Class Now
//             </button>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm border p-6">
//             <h3 className="text-lg font-bold text-gray-900 mb-4">Schedule Future Class</h3>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Class Title *
//                 </label>
//                 <input
//                   type="text"
//                   value={liveClassForm.title}
//                   onChange={(e) => setLiveClassForm(prev => ({ ...prev, title: e.target.value }))}
//                   className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                   placeholder="Advanced Neural Networks"
//                 />
//               </div>

//               <div className="grid md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Instructor *
//                   </label>
//                   <input
//                     type="text"
//                     value={liveClassForm.instructor}
//                     onChange={(e) => setLiveClassForm(prev => ({ ...prev, instructor: e.target.value }))}
//                     className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                     placeholder="Dr. Kumar"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Subject *
//                   </label>
//                   <select
//                     value={liveClassForm.subject}
//                     onChange={(e) => setLiveClassForm(prev => ({ ...prev, subject: e.target.value }))}
//                     className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Date & Time *
//                   </label>
//                   <input
//                     type="datetime-local"
//                     value={liveClassForm.scheduledTime}
//                     onChange={(e) => setLiveClassForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
//                     className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Duration (minutes) *
//                   </label>
//                   <input
//                     type="number"
//                     value={liveClassForm.duration}
//                     onChange={(e) => setLiveClassForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
//                     min="15"
//                     className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                   />
//                 </div>
//               </div>

//               <button
//                 onClick={handleScheduleClass}
//                 className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center"
//               >
//                 <Calendar className="w-5 h-5 mr-2" />
//                 Schedule Class
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Faculty;


import React, { useState } from 'react';
import { Upload, Video, Calendar, Play, Mic } from 'lucide-react';
import { createLecture } from '../services/lectureService';
import { API_URL } from '../utils/constants';

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

    if (!uploadForm.video) {
      alert('Please select a video file');
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
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(Math.round(percentComplete));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 201) {
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
          document.querySelectorAll('input[type="file"]').forEach(input => input.value = '');
        } else {
          alert('Upload failed. Please try again.');
        }
        setUploading(false);
        setUploadProgress(0);
      });

      xhr.addEventListener('error', () => {
        alert('Upload failed. Please check your connection.');
        setUploading(false);
        setUploadProgress(0);
      });

      xhr.open('POST', `${API_URL}/lectures`);
      xhr.send(formData);
    } catch (error) {
      alert('Upload failed: ' + error.message);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleStartInstantClass = () => {
    if (!liveClassForm.title || !liveClassForm.instructor) {
      alert('Please fill in title and instructor name');
      return;
    }
    
    const classData = {
      _id: 'instant_' + Date.now(),
      title: liveClassForm.title,
      instructor: liveClassForm.instructor,
      subject: liveClassForm.subject || 'General',
      scheduledTime: new Date().toISOString(),
      duration: liveClassForm.duration,
      status: 'live',
      audioOnly: liveClassForm.audioOnly,
      participants: 0
    };
    
    const existingClasses = JSON.parse(localStorage.getItem('liveClasses') || '[]');
    existingClasses.push(classData);
    localStorage.setItem('liveClasses', JSON.stringify(existingClasses));
    
    alert('Live class started! Students can now join from the Live Classes page.');
    
    setLiveClassForm({
      title: '',
      instructor: '',
      subject: '',
      scheduledTime: '',
      duration: 60,
      audioOnly: false
    });
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