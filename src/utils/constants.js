export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
export const VIDEO_QUALITIES = {
HIGH: { label: 'High (720p)', value: 'high', size: '~80-100 MB/hour' },
MEDIUM: { label: 'Medium (480p)', value: 'medium', size: '~50-70 MB/hour' },
LOW: { label: 'Low (360p)', value: 'low', size: '~30-40 MB/hour' },
AUDIO_ONLY: { label: 'Audio Only', value: 'audioOnly', size: '~15-20 MB/hour' }
};
export const SUBJECTS = [
'Artificial Intelligence',
'VLSI',
'Renewable Energy',
'Machine Learning',
'Data Science',
'IoT',
'Blockchain',
'Cybersecurity'
];
export const BANDWIDTH_RECOMMENDATIONS = {
high: 'medium',
medium: 'low',
low: 'audioOnly',
very_low: 'audioOnly'
};