import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import ExploreScreen from '../screens/ExploreScreen';
import LoginScreen from '../screens/Login';
import Signup from '../screens/Signup';
import WelcomeScreen from '../screens/WelcomeScreen';
import Restaurants from '../screens/Restaurants';
import Menu from '../screens/Menu';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import { Platform } from 'react-native-web';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import Orders from '../screens/Orders';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
const BottomTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false, // Hide header in tab screens
      tabBarStyle: { backgroundColor: "white", borderTopWidth: 0 },
    }}
  >
    <Tab.Screen
      name="Home"
      component={Restaurants}
      options={{
        title: 'Home',
        tabBarIcon: ({ color }) => (
          <IconSymbol size={28} name="house.fill" color="black" />
        ),
      }}
    />
    <Tab.Screen
      name="Orders"
      component={Orders}
      options={{
        title: 'Orders',
        tabBarIcon: ({ color }) => (
          <MaterialIcons name='receipt' size={30} color="black" />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ExploreScreen}
      options={{
        title: 'Profile',
        tabBarIcon: ({ color }) => (
          <Icon name="user-o" size={20} color="black" />
        ),
      }}
    />
  </Tab.Navigator>
);

export default function MainNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? "HomeTabs" : "WelcomeScreen"}
      screenOptions={{
        headerShown: false, // Disable header for all screens
      }}
    >
      {isAuthenticated ? (
        <>
          {/* All screens under the BottomTabNavigator */}
          <Stack.Screen name="HomeTabs" component={BottomTabNavigator} />
          <Stack.Screen name="Menu" component={Menu} />
          {/* You can add other stack screens here if needed */}
        </>
      ) : (
        <>
          {/* Login and Signup are excluded from the BottomTabNavigator */}
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={Signup} />
        </>
      )}
    </Stack.Navigator>
  );
}
