import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Toaster } from 'react-hot-toast';
// import { BrowserRouter } from 'react-router-dom';
const toastOptions = {
  position: "top-right",
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Suspense>
    <>
      <App />
      <Toaster {...toastOptions} />
    </>
  </Suspense>,
);
