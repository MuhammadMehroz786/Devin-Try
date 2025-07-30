import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/auth/AuthPage';
import { InternshipsPage } from './components/internships/InternshipsPage';
import { HackathonsPage } from './components/hackathons/HackathonsPage';
import { MentorshipPage } from './components/mentorship/MentorshipPage';
import { ChatPage } from './components/chat/ChatPage';
import { Button } from '@/components/ui/button';
import { LogOut, Users, Briefcase, Calendar, MessageCircle, User } from 'lucide-react';

const MainApp: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CP</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">Community Platform</h1>
            </div>
            
            <nav className="hidden md:flex space-x-1">
              <button 
                onClick={() => setCurrentPage('dashboard')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentPage === 'dashboard' 
                    ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/25' 
                    : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
                }`}
              >
                <User className="h-4 w-4" />
                <span>Dashboard</span>
              </button>
              <button 
                onClick={() => setCurrentPage('internships')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentPage === 'internships' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Briefcase className="h-4 w-4" />
                <span>Internships</span>
              </button>
              <button 
                onClick={() => setCurrentPage('hackathons')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentPage === 'hackathons' 
                    ? 'bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-lg shadow-violet-500/25' 
                    : 'text-gray-600 hover:text-violet-600 hover:bg-violet-50'
                }`}
              >
                <Calendar className="h-4 w-4" />
                <span>Hackathons</span>
              </button>
              <button 
                onClick={() => setCurrentPage('mentorship')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentPage === 'mentorship' 
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25' 
                    : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Mentorship</span>
              </button>
              <button 
                onClick={() => setCurrentPage('chat')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentPage === 'chat' 
                    ? 'bg-gradient-to-r from-coral-500 to-pink-600 text-white shadow-lg shadow-pink-500/25' 
                    : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
                }`}
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat</span>
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {(user.full_name || user.email).charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <span className="text-sm font-medium text-gray-700">{user.full_name || user.email}</span>
                  <span className="text-xs bg-gradient-to-r from-teal-100 to-blue-100 text-teal-800 px-2 py-1 rounded-full ml-2">
                    {user.role}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-2 border-gray-200 hover:border-red-300 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {currentPage === 'internships' ? (
        <InternshipsPage />
      ) : currentPage === 'hackathons' ? (
        <HackathonsPage />
      ) : currentPage === 'mentorship' ? (
        <MentorshipPage />
      ) : currentPage === 'chat' ? (
        <ChatPage />
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to the Community Platform
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Connect with opportunities, join hackathons, find mentors, and engage with the community.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              <button 
                onClick={() => setCurrentPage('internships')}
                className="group bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl hover:scale-105 transition-all duration-300 text-left relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mx-auto mb-6 shadow-lg shadow-blue-500/25">
                    <Briefcase className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Internships</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Discover amazing internship opportunities from top companies and kickstart your career.
                  </p>
                </div>
              </button>

              <button 
                onClick={() => setCurrentPage('hackathons')}
                className="group bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-violet-100 hover:shadow-xl hover:scale-105 transition-all duration-300 text-left relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-violet-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-violet-500 to-violet-600 rounded-xl mx-auto mb-6 shadow-lg shadow-violet-500/25">
                    <Calendar className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Hackathons</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Join exciting hackathons and showcase your skills with innovative projects.
                  </p>
                </div>
              </button>

              <button 
                onClick={() => setCurrentPage('mentorship')}
                className="group bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-amber-100 hover:shadow-xl hover:scale-105 transition-all duration-300 text-left relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-amber-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl mx-auto mb-6 shadow-lg shadow-amber-500/25">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Mentorship</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Connect with industry professionals and get personalized guidance.
                  </p>
                </div>
              </button>

              <button 
                onClick={() => setCurrentPage('chat')}
                className="group bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-pink-100 hover:shadow-xl hover:scale-105 transition-all duration-300 text-left relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-pink-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl mx-auto mb-6 shadow-lg shadow-pink-500/25">
                    <MessageCircle className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Community Chat</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Engage in real-time conversations with the community.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
