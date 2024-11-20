import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, Alert, StyleSheet, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import * as Location from 'expo-location';
//import { useAuth } from '../Authentication/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [address, setAddress] = useState<string>('');
  const navigation = useNavigation();
  //const { logout } = useAuth();
  const apiKey = 'ed44fce202e9404ea14c350a4d5cc4ae'; // Replace with your OpenCage API key

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleLocation = async () => {
    setIsLocationEnabled(!isLocationEnabled);

    if (!isLocationEnabled) {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      const locationData = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = locationData.coords;
      setLocation({ latitude, longitude });
      fetchAddress(latitude, longitude);
    } else {
      setLocation(null);
      setAddress('');
    }
  };

  const fetchAddress = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setAddress(data.results[0].formatted);
      } else {
        console.error('No address found');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      
    //   {
    //     text: 'Logout',
    //     style: 'destructive',
    //     onPress: () => {
    //       logout();
    //       navigation.navigate('SignIn');
    //     },
    //   },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>B'MORE EATS</Text>
        <View style={styles.headerActions}>
          {/* Toggle for Live Location */}
          <View style={styles.locationToggle}>
            <Text style={styles.locationText}>Live Location</Text>
            <Switch
              value={isLocationEnabled}
              onValueChange={toggleLocation}
              thumbColor={isLocationEnabled ? '#34D399' : '#f4f3f4'}
            />
          </View>
          {/* Display location and address */}
          {location && (
            <Text style={styles.locationInfo}>
              Lat: {location.latitude.toFixed(4)}, Lng: {location.longitude.toFixed(4)}
            </Text>
          )}
          {address && <Text style={styles.addressInfo}>{address}</Text>}
          {/* Profile Icon */}
          <TouchableOpacity onPress={toggleProfile}>
            <FontAwesome name="user-circle" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Menu */}
      {isProfileOpen && (
        <View style={styles.profileMenu}>
          <TouchableOpacity
            style={styles.profileOption}
            onPress={() => {
              setIsProfileOpen(false);
              navigation.navigate('Profile');
            }}
          >
            <FontAwesome name="user" size={20} color="black" style={styles.icon} />
            <Text style={styles.profileText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileOption}
            onPress={() => {
              setIsProfileOpen(false);
              navigation.navigate('Settings');
            }}
          >
            <FontAwesome name="cog" size={20} color="black" style={styles.icon} />
            <Text style={styles.profileText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileOption}
            onPress={() => {
              setIsProfileOpen(false);
              navigation.navigate('Orders');
            }}
          >
            <FontAwesome name="history" size={20} color="black" style={styles.icon} />
            <Text style={styles.profileText}>Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <FontAwesome name="sign-out" size={20} color="red" style={styles.icon} />
            <Text style={[styles.profileText, { color: 'red' }]}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={toggleProfile}>
            <Text style={styles.profileText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Content */}
      <View style={styles.mainContent}>{children}</View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© {new Date().getFullYear()} Your Company Name</Text>
        <Text style={styles.footerText}>Address: 123 Your Street, City, State, Zip</Text>
        <View style={styles.socialLinks}>
          <Text style={styles.link} onPress={() => Linking.openURL('https://www.facebook.com')}>
            Facebook
          </Text>
          <Text style={styles.link} onPress={() => Linking.openURL('https://www.twitter.com')}>
            Twitter
          </Text>
          <Text style={styles.link} onPress={() => Linking.openURL('https://www.instagram.com')}>
            Instagram
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Layout;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { backgroundColor: '#1F2937', padding: 16, flexDirection: 'row', justifyContent: 'space-between' },
  headerText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  locationToggle: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  locationText: { color: '#FFF', marginRight: 8 },
  locationInfo: { color: '#34D399', fontSize: 12 },
  addressInfo: { color: '#60A5FA', fontSize: 12 },
  profileMenu: { position: 'absolute', top: 70, right: 20, backgroundColor: '#FFF', borderRadius: 8, elevation: 5, width: 200 },
  profileOption: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  icon: { marginRight: 8 },
  profileText: { color: '#000' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  closeButton: { padding: 12, alignItems: 'center' },
  mainContent: { flex: 1, padding: 16 },
  footer: { backgroundColor: '#1F2937', padding: 16, alignItems: 'center' },
  footerText: { color: '#FFF', fontSize: 12 },
  socialLinks: { flexDirection: 'row', marginTop: 8 },
  link: { color: '#93C5FD', marginHorizontal: 8 },
});
