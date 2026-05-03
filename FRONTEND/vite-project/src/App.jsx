// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import TaskDashboard from "./pages/TaskDashboard";
import TaskBoard from "./pages/TaskBoard";
import Project from "./pages/Project";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<TaskDashboard />} />
        <Route path="/project/:projectId" element={<TaskBoard />} />
        <Route path="/project-details/:id" element={<Project />} />
      </Routes>
    </BrowserRouter>
  );
}