// App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./Pages/Main";
import History from "./Pages/History";

//

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Main" element={<Main />} />
        <Route path="/History" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}
