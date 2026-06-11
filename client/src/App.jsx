import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import DashboardLayout from './pages/DashboardLayout.jsx';
import AuthPage from './pages/AuthPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/*" element={<AuthPage />} />
        <Route path="/app/*" element={<DashboardLayout />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
