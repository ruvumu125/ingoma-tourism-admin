import React, {useEffect} from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainPage from "./components/MainPage";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


function App() {

  return (
      <React.Fragment>

        <ToastContainer />

        <BrowserRouter>
          <Routes>
            <Route path="*" element={<MainPage />} />
          </Routes>
        </BrowserRouter>
      </React.Fragment>
  );
}

export default App;
