import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/public-sans';
import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './App';

import core_logic_promise from 'core-logic';

// this makes sure nothing happens until the WASM code is loaded
core_logic_promise().then(_ => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}).catch(_ => {
  const root = document.getElementById('root');
  root.innerText = 'Error loading WASM code';
});



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
