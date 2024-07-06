import "./App.css";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import AdminPage from "./screens/AdminPage";
import { QueryClient, QueryClientProvider } from "react-query";
import LoginScreen from "./screens/auth/LoginScreen";
import { useState } from "react";

function App() {
  const queryClient = new QueryClient();
  const [isLoggedIn,setIsLoggedIn] = useState(true);
  const handleLogin = () => {
    setIsLoggedIn(true);
  }
  const handleLogout = () => {
    setIsLoggedIn(false);
  }
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<LoginScreen handleLogin={handleLogin} />} />
          <Route
            path="/home"
            element={
              isLoggedIn ? (
                <AdminPage handleLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </QueryClientProvider>
    </Router>
  );
}

export default App;