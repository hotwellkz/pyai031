import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import PythonInstallation from './pages/PythonInstallation';
import NewEraLearning from './components/NewEraLearning';
import StartLearning from './components/StartLearning';
import SuitableFor from './components/SuitableFor';
import Reviews from './components/Reviews/Reviews';
import StartFree from './components/StartFree';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Curriculum from './pages/Curriculum';
import AIChat from './components/AIChat';
import PythonIntroLesson from './pages/PythonIntroLesson';
import VariablesLesson from './pages/VariablesLesson';
import OOPLesson from './pages/OOPLesson';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Offer from './pages/Offer';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  useEffect(() => {
    // Предотвращаем горизонтальный свайп
    const preventHorizontalScroll = (e: TouchEvent) => {
      if (Math.abs(e.touches[0].clientX - e.touches[0].screenX) > 10) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', preventHorizontalScroll, { passive: false });

    return () => {
      document.removeEventListener('touchmove', preventHorizontalScroll);
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen">
            <Header />
            <main>
              <Hero />
              <Features />
              <NewEraLearning />
              <StartLearning />
              <SuitableFor />
              <Reviews />
              <StartFree />
              <FAQ />
            </main>
            <Footer />
            <AIChat />
          </div>
        } />
        <Route path="/curriculum" element={<Curriculum />} />
        <Route path="/lesson/python-introduction" element={
          <ProtectedRoute>
            <PythonIntroLesson />
          </ProtectedRoute>
        } />
        <Route path="/lesson/python-installation" element={
          <ProtectedRoute>
            <PythonInstallation />
          </ProtectedRoute>
        } />
        <Route path="/lesson/variables-introduction" element={
          <ProtectedRoute>
            <VariablesLesson />
          </ProtectedRoute>
        } />
        <Route path="/lesson/oop-introduction" element={
          <ProtectedRoute>
            <OOPLesson />
          </ProtectedRoute>
        } />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/offer" element={<Offer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}
export default App;