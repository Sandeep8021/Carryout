import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login/login';
import { AuthProvider, useAuth } from './components/Authentication/AuthContext';
import ProtectedRoute from './components/Authentication/ProtectedRoute';
import RestaurantList from './components/Restaurants/RestaurantList';
import Signup from './Signup/signup';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <AuthProvider>
<Routes>
  <Route element={<ProtectedRoute />}>
    <Route path="/restaurants" element={<RestaurantList />} /> {/* Fixed here */}
  </Route>
  <Route path="/" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
</Routes>
</AuthProvider>
  )
};



export default App;