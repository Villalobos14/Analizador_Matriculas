// src/AppRouter.jsx
import React from 'react';
import Form from '../pages/form/Form';
import { Route, Routes, BrowserRouter } from 'react-router-dom';

const AppRouter = () => {
  return (
    <BrowserRouter>  
      <Routes>
        <Route path="/form" element={<Form />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
