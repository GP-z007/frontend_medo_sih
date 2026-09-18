import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import '@udaan/styles/globals.css';
import '@udaan/styles/dashboard.css';

const root = document.getElementById('root');
if (!root) throw new Error('UDAAN root element missing');

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
