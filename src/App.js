// App.js
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MiniDrawer from "./Components/Drower";
import HomePage from "./Pages/Home";
import VideoPage001 from "./Pages/VideoPage001";
import ErrorBoundary from "./Components/ErrorBoundry";

function App() {
  return (
    <BrowserRouter>
      <MiniDrawer>
          <ErrorBoundary>
        <Routes>
          <Route path="/" element={<HomePage />} />
            <Route path="/video/:id" element={<VideoPage001 />} />
          <Route path="*" element={<h1>Page not found</h1>} />
        </Routes>
          </ErrorBoundary>
      </MiniDrawer>
    </BrowserRouter>
  );
}

export default App;
