import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Bell, TrendingUp, User, Menu, X, Sun, Moon, History, HelpCircle, Award } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Reminders', href: '/reminders', icon: Bell },
    { name: 'Analytics', href: '/analytics', icon: TrendingUp },
    { name: 'Badges', href: '/badges', icon: Award },
    { name: 'History', href: '/history', icon: History },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Help', href: '/help', icon: HelpCircle },
  ];
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
            <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">MedManager</h1>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive(item.href)
                          ? 'text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/30'
                          : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            
            {/* Theme Toggle */}
            <div className="flex items-center">
              <button
                onClick={() => {
                  console.log('Theme toggle clicked!');
                  toggleTheme();
                }}
                className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden ml-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-2 text-base font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-primary-600 bg-primary-50 border-l-4 border-primary-600 dark:text-primary-400 dark:bg-primary-900/30'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
