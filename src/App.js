import React from "react";
import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar.tsx";
import HomePage from "./pages/HomePage.tsx";

function App() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <HomePage />
      </div>
    </div>
  );
}

export default App;
