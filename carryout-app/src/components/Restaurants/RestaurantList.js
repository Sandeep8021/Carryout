import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../Layout/Layout';
import { FaSpinner, FaSearchLocation } from 'react-icons/fa';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState({ lat: null, lon: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get user's location when component mounts
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lon: longitude });
        fetchNearbyRestaurants(latitude, longitude); // Fetch nearby restaurants
      },
      (error) => {
        console.error('Error getting location:', error);
        setError('Could not get your location. Showing default restaurants.');
        // Optionally set default location or fetch some general data
      }
    );
  }, []);

  const fetchNearbyRestaurants = (lat, lon) => {
    setLoading(true);
    setError(null);
    axios
      .get(`http://your-backend-url/restaurants/nearby?userLat=${lat}&userLon=${lon}`)
      .then((response) => {
        setRestaurants(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching nearby restaurants:', error);
        setError('Error fetching nearby restaurants.');
        setLoading(false);
      });
  };

  const searchRestaurants = (query) => {
    setLoading(true);
    return axios.get(`http://your-backend-url/restaurants/search?name=${query}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      searchRestaurants(searchQuery)
        .then((response) => {
          setRestaurants(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error searching restaurants:', error);
          setError('Error searching for restaurants.');
          setLoading(false);
        });
    } else {
      // If search query is empty, fetch nearby restaurants again
      fetchNearbyRestaurants(userLocation.lat, userLocation.lon);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto mt-8">
        <form onSubmit={handleSearch} className="flex items-center justify-center mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for restaurants..."
            className="border border-gray-400 rounded-full p-2 w-2/3 lg:w-1/3 focus:ring-2 focus:ring-black focus:outline-none"
          />
          <button
            type="submit"
            className="bg-black text-white ml-2 px-6 py-2 rounded-full hover:bg-gray-800 transition duration-300 flex items-center justify-center"
          >
            {loading ? <FaSpinner className="animate-spin" /> : 'Search'}
          </button>
        </form>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {loading ? (
          <div className="flex justify-center mt-8">
            <FaSpinner className="text-4xl text-black animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {restaurants.length > 0 ? (
              restaurants.map((restaurant) => (
                <div key={restaurant.id} className="border rounded-lg shadow-lg p-4 bg-white">
                  <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                  <h3 className="text-lg font-bold mt-2">{restaurant.name}</h3>
                  <p className="text-sm text-gray-600">{restaurant.type}</p>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 col-span-full">
                No restaurants found.
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RestaurantList;
