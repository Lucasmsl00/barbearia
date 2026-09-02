import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import AgendarPage from "./pages/AgendarPage";
import LoginPage from "./pages/LoginPage";
import RegistrarPage from "./pages/RegistrarPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/agendar" element={<AgendarPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registrar" element={<RegistrarPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;
