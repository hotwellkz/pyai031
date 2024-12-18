import { Brain, Coins, Menu, X } from 'lucide-react';
import { BookOpen, LogIn, LogOut, User, UserPlus } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(true);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const loadTokens = useAuthStore((state) => state.loadTokens);
  const resetProgress = useAuthStore((state) => state.resetProgress);
  const loadProgress = useAuthStore((state) => state.loadProgress);
  const tokens = useAuthStore((state) => state.tokens);
  const setUser = useAuthStore((state) => state.setUser);

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    setIsScrolled(scrollPosition > 0);
  }, []);

  useEffect(() => {
    handleScroll();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        loadTokens();
        loadProgress();
      }
    });
    window.addEventListener('scroll', handleScroll);
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setUser, handleScroll]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      resetProgress();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  return (
    <header className={`fixed w-full top-0 z-[101] transition-all duration-300 ${
      isScrolled 
        ? 'bg-slate-900 shadow-lg py-2' 
        : 'bg-slate-900 py-4'
    }`}>
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between relative">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-400 transition-transform hover:scale-110" aria-hidden="true" />
              <span className="text-white font-bold text-xl tracking-tight">PyAI Teacher</span>
              </Link>
              <Link
              to="/admin"
              className="ml-2 text-gray-400 hover:text-white transition-colors"
              title="Админ панель"
            >
              <Shield className="w-5 h-5" />
            </Link>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/curriculum" className="text-gray-300 hover:text-white transition-all duration-200 text-sm font-medium hover:scale-105">
              Программа курса
            </Link>
            <Link to="/pricing" className="text-gray-300 hover:text-white transition-all duration-200 text-sm font-medium hover:scale-105">
              Тарифы
            </Link>
            {user ? (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 bg-blue-500/20 px-3 py-1.5 rounded-full">
                  <Coins className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-100 text-sm font-medium">{tokens}</span>
                </div>
                <Link to="/profile" className="text-gray-300 hover:text-white text-sm transition-colors">
                  {user.email}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-300 hover:text-white transition-all duration-200 text-sm font-medium hover:scale-105"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-all duration-200 text-sm font-medium hover:scale-105"
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium hover:scale-105 hover:shadow-lg"
                >
                  Регистрация
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden fixed inset-0 z-50 transform transition-all duration-500 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Overlay */}
          <div 
            className={`absolute inset-0 bg-black/80 transition-opacity duration-500 ${
              isMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Content */}
          <div className="absolute right-0 top-0 h-full w-[80%] max-w-sm bg-slate-900 shadow-2xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Brain className="h-8 w-8 text-blue-400" />
                  <span className="text-white font-bold text-xl">PyAI Teacher</span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto py-6 px-4 bg-slate-900">
                <nav className="space-y-6">
                  <div className="space-y-2">
                    <Link
                      to="/curriculum"
                      className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-blue-900 px-4 py-3 rounded-lg transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <BookOpen className="w-5 h-5" />
                      <span className="font-medium">Программа курса</span>
                    </Link>
                    <Link
                      to="/pricing"
                      className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-blue-900 px-4 py-3 rounded-lg transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Coins className="w-5 h-5" />
                      <span className="font-medium">Тарифы</span>
                    </Link>
                  </div>

                  {user ? (
                    <div className="space-y-4 pt-4 border-t border-white/10">
                      <div className="px-4">
                        <div className="flex items-center gap-2 bg-blue-900 px-3 py-2 rounded-lg">
                          <Coins className="w-5 h-5 text-blue-400" />
                          <span className="text-blue-100 font-medium">{tokens} токенов</span>
                        </div>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-blue-900 px-4 py-3 rounded-lg transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="w-5 h-5" />
                        <span className="font-medium">{user.email}</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-red-900/50 px-4 py-3 rounded-lg transition-all duration-200"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Выйти</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 pt-4 border-t border-white/10">
                      <Link
                        to="/login"
                        className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-blue-900 px-4 py-3 rounded-lg transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <LogIn className="w-5 h-5" />
                        <span className="font-medium">Войти</span>
                      </Link>
                      <Link
                        to="/register"
                        className="flex items-center gap-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <UserPlus className="w-5 h-5" />
                        <span className="font-medium">Регистрация</span>
                      </Link>
                    </div>
                  )}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-gray-300 hover:text-white transition-all duration-200 text-sm font-medium hover:scale-105"
    >
      {children}
    </a>
  );
}

function MobileNavLink({ 
  href, 
  children,
  onClick
}: { 
  href: string; 
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <a
      href={href}
      className="text-gray-300 hover:text-white transition-all duration-200 block text-lg font-medium px-4 py-2 hover:bg-white/5 rounded-lg"
      onClick={onClick}
    >
      {children}
    </a>
  );
}