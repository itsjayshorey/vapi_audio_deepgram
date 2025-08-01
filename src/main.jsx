import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App';           // Deepgram
import VapiPage from './VapiPage'; // Vapi Assistant

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/vapi" element={<VapiPage />} />
    </Routes>
  </BrowserRouter>
);
