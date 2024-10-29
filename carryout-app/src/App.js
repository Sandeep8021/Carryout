import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login/login';
import { AuthProvider, useAuth } from './components/Authentication/AuthContext';
import ProtectedRoute from './components/Authentication/ProtectedRoute';
import RestaurantList from './components/Restaurants/RestaurantList';
import Signup from './Signup/signup';
import Menu from "./components/Menu/Menu";


function App() {
  const { isAuthenticated } = useAuth();

  return (
    <AuthProvider>
<Routes>
  <Route element={<ProtectedRoute />}>
    <Route path="/restaurants" element={<RestaurantList />} /> 
    <Route path="/restaurants/:restaurantId/menu" element={<Menu />} />
  </Route>
  <Route path="/" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
</Routes>
</AuthProvider>
  )
};



export default App;