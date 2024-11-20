import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { Image } from 'expo-image';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Navigate to Login or Restaurants screen after 3 seconds
    const timeout = setTimeout(() => {
      if (isAuthenticated) {
        navigation.navigate('Restaurants');
      } else {
        navigation.navigate('Login');
      }
    }, 2500);

    return () => clearTimeout(timeout); // Cleanup timeout on unmount
  }, [navigation, isAuthenticated]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/bmore_logo.gif')} // Replace with the correct path to your GIF
        style={styles.gif}
        contentFit='scale-down'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e2d0d0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gif: {
    width:width, // Adjust width based on your design
    height: height, // Adjust height based on your design
  },
});

export default WelcomeScreen;
