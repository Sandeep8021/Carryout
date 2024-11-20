// Menu.js

// Menu.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Layout from '../Layout/Layout';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { FaShoppingCart } from 'react-icons/fa';
import Cart from '../Cart/Cart';
import Modal from '../Cart/Modal';

const Menu = () => {
  const { restaurantId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({ spiceLevel: '', allergens: [] });
  const cartRef = useRef(null);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    fetchMenuItems();
  }, [restaurantId]);

  const fetchMenuItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8080/api/restaurants/${restaurantId}/menu`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenuItems(response.data.menu);
      console.log("selected Category->",selectedCategory);
      setSelectedCategory("Side")
      console.log("set selectedCategory->",selectedCategory)
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setError('Error fetching menu items.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSearchTerm('');
  };

  const addToCart = useCallback((item, options) => {
    setCart((prevCart) => ({
      ...prevCart,
      [item.id]: {
        ...item,
        quantity: (prevCart[item.id]?.quantity || 0) + 1,
        options,
      },
    }));
  }, []);
  const removeFromCart = useCallback((itemId) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[itemId].quantity > 1) {
        newCart[itemId].quantity -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  }, []);

  const handleAddToCartClick = (item) => {
    setSelectedItem(item);
    setIsOptionModalOpen(true);
  };

  const confirmAddToCart = () => {
    addToCart(selectedItem, selectedOptions);
    setIsOptionModalOpen(false);
    setSelectedOptions({ spiceLevel: '', allergens: [] });
  };

  const filteredItems = menuItems.filter(item => {
    if (searchTerm) {
      return item.item_name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return item.item_category === selectedCategory;
  });

  const toggleCart = () => setIsCartOpen(prev => !prev);

  const totalItems = Object.values(cart).reduce((total, item) => total + item.quantity, 0);

  return (
    <Layout>
      <button
        onClick={toggleCart}
        className="fixed right-6 z-10 bg-black text-white rounded-full p-3 shadow-lg transition-transform duration-200 transform hover:scale-105"
        aria-label="Toggle Cart"
      >
        <FaShoppingCart />
        {totalItems > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">{totalItems}</span>
        )}
      </button>

      <Modal isOpen={isCartOpen} onClose={toggleCart} title="Your Cart">
        <Cart cartItems={cart} onRemove={(itemId) => removeFromCart(itemId)} />
      </Modal>

      <Modal isOpen={isOptionModalOpen} onClose={() => setIsOptionModalOpen(false)} title="Select Options">
        {selectedItem && (
          <div>

            <div className="mb-4">
              <label className="block text-lg font-semibold">Spice Level:</label>
              {selectedOptions.spiceLevel&&(<select
                value={selectedOptions.spiceLevel}
                onChange={(e) => setSelectedOptions({ ...selectedOptions, spiceLevel: e.target.value })}
                className="w-full border p-2 rounded"
              >
                <option value="">Select Spice Level</option>
                {selectedItem.options.spice_level.map((level, index) => (
                  <option key={index} value={level}>{level}</option>
                ))}
              </select>)}
            </div>
            {selectedItem.options.allergens&&
              (<div className="mb-4">
              
              <label className="block text-lg font-semibold">Allergens:</label>
                {selectedItem.options.allergens.map((allergen, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      value={allergen}
                      checked={selectedOptions.allergens.includes(allergen)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedOptions({ ...selectedOptions, allergens: [...selectedOptions.allergens, allergen] });
                        } else {
                          setSelectedOptions({
                            ...selectedOptions,
                            allergens: selectedOptions.allergens.filter(a => a !== allergen),
                          });
                        }
                      }}
                  />
                  <label className="ml-2">{allergen}</label>
                </div>
              ))}
            
            </div>)}
            <button
              onClick={confirmAddToCart}
              className="w-full bg-black text-white font-bold py-2 rounded-full hover:bg-gray-800 transition duration-300 mt-2"
            >
              Add to Cart
            </button>
          </div>
        )}
      </Modal>

      <div className="flex justify-center space-x-2 bg-gray-100 p-2 rounded-lg shadow-md mb-2">
        {Array.from(new Set(menuItems.map(item => item.item_category))).map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-6 py-2 text-lg font-semibold rounded-full transition duration-300 ${
              selectedCategory === category ? 'bg-black text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="container mx-auto flex flex-col lg:flex-row mt-8 bg-white p-6 rounded-lg shadow-lg relative">
        <section className="w-full">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-400 rounded-full focus:ring-2 focus:ring-black focus:outline-none transition duration-300"
            />
          </div>

          <Scrollbars style={{ height: 500 }} autoHide>
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p>Loading menu items...</p>
              </div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.length > 0 ? (
                  filteredItems.map(item => (
                    <div key={item._id} className="border p-4 rounded-lg shadow-md flex items-start">
                      <div className="flex-1 pr-4">
                        <h3 className="text-lg font-semibold mb-1">{item.item_name}</h3>
                        <p className="text-yellow-600 font-semibold mb-2">${item.item_price}</p>
                        <p className="text-gray-500 text-sm mb-2">
                          {item.item_description}
                        </p>
                      </div>
                      <div className="flex flex-col items-center">
                        <img
                          src={item.imageUrl}
                          alt={item.item_name}
                          className="w-24 h-24 object-cover rounded-lg mb-2"
                        />
                        <button
                          onClick={() => handleAddToCartClick(item)}
                          className="w-full bg-black text-white font-bold py-2 rounded-full hover:bg-gray-800 transition duration-300 mt-2 transform hover:scale-105"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No items found in this category or search term.</p>
                )}
              </div>
            )}
          </Scrollbars>
        </section>
      </div>
    </Layout>
  );
};

export default Menu;
