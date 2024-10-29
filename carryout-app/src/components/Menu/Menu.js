import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Layout from '../Layout/Layout';
import { FaSpinner } from 'react-icons/fa';

const Menu = () => {
  const { restaurantId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(''); // Track selected category

  useEffect(() => {
    fetchMenuItems();
  }, [restaurantId]);

  const fetchMenuItems = () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('authToken');
    axios
      .get(`http://localhost:8081/api/restaurants/${restaurantId}/menu`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setMenuItems(response.data.menu);
        console.log(response.data.menu[0].item_category)
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching menu items:', error);
        setError('Error fetching menu items.');
        setLoading(false);
      });
  };

  // Extract unique categories from menuItems
  const categories = [...new Set(menuItems.map((item) => item.item_category))];

  // Filter items by selected category
  const filteredItems = selectedCategory
    ? menuItems.filter((item) => item.item_category === selectedCategory)
    : menuItems;

  return (
    <Layout>
      <div className="container mx-auto mt-8 flex">
        {/* Sidebar with Categories */}
        <div className="w-1/4 p-4">
          <h2 className="text-xl font-bold mb-4">Categories</h2>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li
                key={category}
                onClick={() => setSelectedCategory(category)} // Update selected category
                className={`cursor-pointer text-lg ${
                  selectedCategory === category ? 'text-blue-600 font-semibold' : 'text-gray-700'
                } hover:text-blue-600`}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>

        {/* Menu Items Display */}
        <div className="w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {loading ? (
            <div className="flex justify-center mt-8 col-span-full">
              <FaSpinner className="text-4xl text-black animate-spin" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center mb-4 col-span-full">{error}</div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item.id} className="border rounded-lg shadow-lg p-4 bg-white">
                <img
                  src={item.imageUrl || 'https://via.placeholder.com/150'}
                  alt={item.item_name}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <h3 className="text-lg font-bold mt-2">{item.item_name}</h3>
                <p className="text-sm text-gray-600">
                  {item.item_description || 'No description available'}
                </p>
                <p className="text-lg font-semibold">${item.item_price}</p>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 col-span-full">
              No items available in this category.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Menu;
