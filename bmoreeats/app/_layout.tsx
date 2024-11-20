import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import Login from './screens/Login';
import Signup from './screens/Signup';
import WelcomeScreen from './screens/WelcomeScreen';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Route } from 'expo-router/build/Route';
import { AuthProvider } from './hooks/useAuth';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
    {/* Make the status bar visible */}
    <StatusBar
      barStyle="dark-content" // Options: "default", "light-content", "dark-content"
      backgroundColor="#ffffff" // Set your preferred background color
      translucent={false} // Set to true if you want content to render under the status bar
    />
    {/* Your main application navigator or screens */}
    <AuthProvider>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
     <Stack>
         
        <Stack.Screen name="/WelcomeScreen"/>
        
         <Stack.Screen name="/Restaurants"/>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }}/> */
        <Stack.Screen name="Login" />
        {/* 
        <Stack.Screen name="/Menu" />
        <Stack.Screen name='screens'  />
        
        
        <Stack.Screen name="/signup" />
        <Stack.Screen name="+not-found" /> */}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
    </AuthProvider>
    </View>
  );
}
