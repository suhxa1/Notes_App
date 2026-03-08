import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const token = localStorage.getItem("token"); // simple auth check

  return (
    <Routes>
      <Route 
        path="/" 
        element={token ? <Navigate to="/dashboard" /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={token ? <Navigate to="/dashboard" /> : <Register />} 
      />
      <Route 
        path="/dashboard" 
        element={token ? <Dashboard /> : <Navigate to="/" />} 
      />
      {/* 404 fallback */}
      <Route 
        path="*" 
        element={
          <div className="flex items-center justify-center h-screen">
            <h1 className="text-3xl font-bold text-gray-600">
              404 - Page Not Found
            </h1>
          </div>
        } 
      />
    </Routes>
  );
}

export default App;