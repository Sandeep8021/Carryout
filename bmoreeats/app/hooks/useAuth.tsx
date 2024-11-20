import React, { createContext, useContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the shape of the AuthContext
interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  email: string | null;
  login: (token: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Define Props type for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Create context with initial value as undefined for types
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null)

  // Check for token in AsyncStorage to set authentication state initially
  React.useEffect(() => {
    const checkToken = async () => {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (storedToken) {
        setIsAuthenticated(true);
        setToken(storedToken);
        const mail = await AsyncStorage.getItem('userEmail');
        setEmail(mail);
      }
    };
    checkToken();
  }, []);

  const login = async (token: string, email: string) => {
    setIsAuthenticated(true);
    setToken(token);
    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('userEmail', email);
    console.log("in useauth", email)
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setToken(null);
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userEmail');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated,email, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
