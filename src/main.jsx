import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AppProvider } from './context/AppContext';
import { NetworkProvider } from './context/NetworkContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NetworkProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </NetworkProvider>
  </React.StrictMode>
);