import { Routes, Route } from "react-router-dom";
import Website from "./Website.jsx";
import AdminPanel from "./AdminPanel.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Website />} />
      <Route path="/admin-sairohan" element={<AdminPanel />} />
      <Route path="*" element={<Website />} />
    </Routes>
  );
}
