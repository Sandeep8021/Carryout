import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '../hooks/useAuth';
import MainNavigator from './_layout'; // Assuming this is the main navigator

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
         <MainNavigator/> 
        
      </NavigationContainer>
    </AuthProvider>
  );
}
