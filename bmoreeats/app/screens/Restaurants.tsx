import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';

const windowDimensions = Dimensions.get('window');

interface Restaurant {
  id: string;
  name: string;
  type: string;
  imageUrl: string;
  rating?: number;
  isFeatured?: boolean;
  isPopular?: boolean;
  latitude?: number;
  longitude?: number;
  distance?: string;
}

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number | null; lon: number | null }>({
    lat: null,
    lon: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation();
  const token = ''; // Replace with your token

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setUserLocation({ lat: latitude, lon: longitude });
      } else {
        setError('Permission to access location was denied');
      }
      fetchRestaurants();
    })();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = restaurants.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRestaurants(filtered);
    } else {
      setFilteredRestaurants(restaurants);
    }
  }, [searchQuery, restaurants]);

  const fetchRestaurants = () => {
    setLoading(true);
    setError(null);

    axios
      .get('http://10.0.0.171:8080/api/restaurants/list', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setRestaurants(response.data);
        setFilteredRestaurants(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching restaurants:', error);
        setError('Error fetching restaurants.');
        setLoading(false);
      });
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 3958.8; // Radius of Earth in miles
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1); // Distance in miles
  };

  const categorizeRestaurants = () => {
    const available = restaurants.map((restaurant) => {
      if (restaurant.latitude && restaurant.longitude && userLocation.lat && userLocation.lon) {
        restaurant.distance = calculateDistance(
          userLocation.lat,
          userLocation.lon,
          restaurant.latitude,
          restaurant.longitude
        );
      }
      return restaurant;
    });

    const popular = available.filter((restaurant) => restaurant.isPopular);
    const featured = available.filter((restaurant) => restaurant.isFeatured);
    const nearYou = available.filter((restaurant) => parseFloat(restaurant.distance || '0') >= 2);

    return { available, popular, featured, nearYou };
  };

  const { available, popular, featured, nearYou } = categorizeRestaurants();

  const handleRestaurantClick = (restaurantId: string) => {
    navigation.navigate('Menu', { restaurantId });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/Pink Bakery Doughnut Promotion Facebook App Ad.gif')} // Replace with your ad image URL
        style={styles.adImage}
        contentFit="cover"
      />
      <TextInput
        style={styles.searchBar}
        placeholder="Search restaurants by name or type..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#FF6347" />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Section title="Available" data={available} onClick={handleRestaurantClick} />
          <Section title="Near You" data={nearYou} onClick={handleRestaurantClick} showDistance />
          <Section title="Popular" data={popular} onClick={handleRestaurantClick} />
          <Section title="Featured" data={featured} onClick={handleRestaurantClick} />
        </ScrollView>
      )}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const Section = ({
  title,
  data,
  onClick,
  showDistance,
}: {
  title: string;
  data: Restaurant[];
  onClick: (id: string) => void;
  showDistance?: boolean;
}) => {
  if (data.length === 0) return null; // Only render if the section has data

  return (
    <>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RestaurantCard
            item={item}
            onPress={() => onClick(item.id)}
            distance={showDistance && item.distance ? `${item.distance} miles` : undefined}
          />
        )}
        contentContainerStyle={styles.flatListContainer}
      />
    </>
  );
};

const RestaurantCard = ({
  item,
  onPress,
  distance,
}: {
  item: Restaurant;
  onPress: () => void;
  distance?: string;
}) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={{ uri: item.imageUrl }} style={styles.image} />
    <View style={styles.cardDetails}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.type}>{item.type}</Text>
      {distance && <Text style={styles.distance}>{distance}</Text>}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
    marginTop: 45,
    flex: 1,
  },
  adImage: {
    width: '100%',
    height: windowDimensions.height * 0.2,
    marginBottom: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    overflow: 'hidden',
  },
  searchBar: {
    height: 40,
    borderColor: '#e1e1e1',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    marginTop: 10,
    paddingLeft: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 2,
    borderRadius: 4,
    shadowColor: '#005',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    minWidth: 350,
    padding: 15,
    borderColor: '#ffffff',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginRight: 20,
  },
  cardDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  type: {
    fontSize: 14,
    color: '#777',
    marginBottom: 6,
  },
  distance: {
    fontSize: 12,
    color: '#555',
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  flatListContainer: {
    paddingHorizontal: 10,
  },
});

export default Restaurants;
