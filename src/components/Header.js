import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings,
  Moon,
  Sun,
  Monitor,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import AuthModal from './AuthModal';
import Button from './ui/Button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, isSystemTheme, setSystemTheme, setLightTheme, setDarkTheme } = useTheme();
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'About', href: '/about' },
  ];

  const themeOptions = [
    { name: 'Light', icon: Sun, action: setLightTheme, active: !isDark && !isSystemTheme },
    { name: 'Dark', icon: Moon, action: setDarkTheme, active: isDark && !isSystemTheme },
    { name: 'System', icon: Monitor, action: setSystemTheme, active: isSystemTheme },
  ];

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: {
        duration: 0.2,
        ease: 'easeInOut'
      }
    }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: -10,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <>
      <motion.header
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className={`sticky top-0 z-40 backdrop-blur-lg border-b transition-colors duration-200 ${
          isDark 
            ? 'bg-gray-900/80 border-gray-700' 
            : 'bg-white/80 border-gray-200'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg"
              >
                <Zap className="h-6 w-6 text-white" />
              </motion.div>
              <span className={`text-xl font-bold transition-colors duration-200 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                SwiftSummary Pro
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative font-medium transition-colors duration-200 ${
                    location.pathname === item.href
                      ? isDark ? 'text-blue-400' : 'text-blue-600'
                      : isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                  {location.pathname === item.href && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Theme Selector */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                  icon={isSystemTheme ? Monitor : isDark ? Moon : Sun}
                  iconPosition="left"
                  className="flex items-center space-x-1"
                >
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>

                <AnimatePresence>
                  {isThemeMenuOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className={`absolute right-0 mt-2 w-40 rounded-lg shadow-xl border z-50 ${
                        isDark 
                          ? 'bg-gray-800 border-gray-700' 
                          : 'bg-white border-gray-200'
                      }`}
                      onMouseLeave={() => setIsThemeMenuOpen(false)}
                    >
                      {themeOptions.map((option) => (
                        <button
                          key={option.name}
                          onClick={() => {
                            option.action();
                            setIsThemeMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 flex items-center space-x-2 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                            option.active
                              ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'
                              : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <option.icon className="h-4 w-4" />
                          <span>{option.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {user ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>
                      {user.name}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={`absolute right-0 mt-2 w-48 rounded-lg shadow-xl border z-50 ${
                          isDark 
                            ? 'bg-gray-800 border-gray-700' 
                            : 'bg-white border-gray-200'
                        }`}
                        onMouseLeave={() => setIsUserMenuOpen(false)}
                      >
                        <div className={`px-4 py-3 border-b ${
                          isDark ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {user.name}
                          </p>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {user.email}
                          </p>
                        </div>
                        <button className={`w-full text-left px-4 py-2 flex items-center space-x-2 transition-colors duration-200 ${
                          isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                        }`}>
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className={`w-full text-left px-4 py-2 flex items-center space-x-2 transition-colors duration-200 rounded-b-lg ${
                            isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              icon={isMenuOpen ? X : Menu}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            />
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`md:hidden border-t overflow-hidden ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                <nav className="py-4 space-y-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block font-medium transition-colors duration-200 ${
                        location.pathname === item.href
                          ? isDark ? 'text-blue-400' : 'text-blue-600'
                          : isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  <div className={`pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Theme
                      </span>
                      <div className="flex space-x-2">
                        {themeOptions.map((option) => (
                          <Button
                            key={option.name}
                            variant={option.active ? "primary" : "ghost"}
                            size="sm"
                            icon={option.icon}
                            onClick={option.action}
                            className="p-2"
                          />
                        ))}
                      </div>
                    </div>
                    
                    {!user && (
                      <Button
                        variant="primary"
                        onClick={() => {
                          setIsAuthModalOpen(true);
                          setIsMenuOpen(false);
                        }}
                        className="w-full"
                      >
                        Sign In
                      </Button>
                    )}
                  </div>
                  
                  {user && (
                    <div className={`pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {user.name}
                          </p>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={handleLogout}
                        icon={LogOut}
                        className="w-full justify-start"
                      >
                        Logout
                      </Button>
                    </div>
                  )}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};

export default Header;