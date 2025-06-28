import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('swiftsummary_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate login - in real app, this would call your API
    const mockUser = {
      id: '1',
      email,
      name: email.split('@')[0],
      plan: 'free',
      joinedAt: new Date().toISOString(),
    };
    
    setUser(mockUser);
    localStorage.setItem('swiftsummary_user', JSON.stringify(mockUser));
    return mockUser;
  };

  const signup = async (email, password, name) => {
    // Simulate signup - in real app, this would call your API
    const mockUser = {
      id: Date.now().toString(),
      email,
      name,
      plan: 'free',
      joinedAt: new Date().toISOString(),
    };
    
    setUser(mockUser);
    localStorage.setItem('swiftsummary_user', JSON.stringify(mockUser));
    return mockUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('swiftsummary_user');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};