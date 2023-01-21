import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.createElement('div');

rootElement.setAttribute('id', 'app-wrapper');
document.body.appendChild(rootElement);

const root = createRoot(rootElement);

root.render(<App />);