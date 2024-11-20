import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../hooks/useAuth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ExploreScreen = () => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await AsyncStorage.removeItem('authToken');
    logout();
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={{marginVertical:280}}>
          <View style={styles.header}>
            <Image
              source={require('../../assets/images/bmore_logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Body */}
          <View style={styles.body}>
            <Text style={styles.inputStyle}>Name</Text>
            <Text style={styles.inputStyle}>Mail ID</Text>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogout}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Logout</Text>
              )}
            </TouchableOpacity>
          </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Icon name="shield-check" size={20} color="#4CAF50" />
          <Text style={styles.footerText}>Your transactions are secure.</Text>
        </View>
        <Image
          source={require('../../assets/images/Stripe.png')}
          style={styles.stripeLogo}
          resizeMode="contain"
        />
        <Text style={styles.footerText}>Payments are PCI compliant.</Text>
        <Text style={styles.footerContact}>Contact: Sandeep Kemidi - 4435097417</Text>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20, // Adjusted to reduce excessive padding
  },
  logo: {
    width: 150,
    height: 50,
  },
  body: {
    alignItems: 'center',
  },
  inputStyle: {
    height: 50,
    width: '90%',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 50,
    fontSize: 16,
    color: '#333333',
    elevation: 2,
  },
  button: {
    backgroundColor: '#000000',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: '#555555',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    position:'absolute',
  bottom:0,
  left:0,
  right:0,
  flex:1,
    backgroundColor: '#F8F8F8',
    paddingVertical: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  footerText: {
    color: '#666666',
    fontSize: 14,
    marginLeft: 8,
  },
  footerContact: {
    color: '#666666',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default ExploreScreen;
