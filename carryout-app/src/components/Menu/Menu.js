// Menu.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Layout from '../Layout/Layout';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';
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
  const cartRef = useRef(null);
  const userEmail = localStorage.getItem('userEmail');
  
  const token = localStorage.getItem('authToken');
  useEffect(() => {
    fetchMenuItems();
  }, [restaurantId]);

  useEffect(() => {
    if (menuItems.length > 0) {
      setSelectedCategory(menuItems[0].item_category);
    }
  }, [menuItems]);

  const fetchMenuItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8080/api/restaurants/${restaurantId}/menu`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenuItems(response.data.menu);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setError('Error fetching menu items.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSearchTerm('');
  };

  const filteredItems = menuItems.filter(item => {
    if (searchTerm) {
      return item.item_name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return item.item_category === selectedCategory;
  });

  const addToCart = useCallback((item) => {
    setCart((prevCart) => ({
      ...prevCart,
      [item.id]: {
        ...item,
        quantity: (prevCart[item.id]?.quantity || 0) + 1,
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

  const toggleCart = () => setIsCartOpen(prev => !prev);

  const totalItems = Object.values(cart).reduce((total, item) => total + item.quantity, 0);

  const handleCheckout = async (total, paymentOption) => {
    const timestamp = new Date().toISOString();
    const cartDetails = {
      email: userEmail,
      timestamp: timestamp,
      totalAmount: total.toFixed(2),
      paymentType: paymentOption,
      items: Object.values(cart).map(item => ({
        id: item.id,
        item_name: item.item_name,
        item_price: item.item_price,
        quantity: item.quantity,
      })),
    };
    try {
      await axios.post('http://localhost:8081/api/checkout/process', cartDetails,
      { headers: { Authorization: `Bearer ${token}` } });
      setCart({});
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error posting cart details:', error);
      alert('Error placing order.');
    }
  };

  const handleClickOutside = useCallback((event) => {
    if (cartRef.current && !cartRef.current.contains(event.target) && isCartOpen) {
      setIsCartOpen(false);
    }
  }, [isCartOpen]);

  useEffect(() => {
    if (isCartOpen) {
      window.addEventListener('click', handleClickOutside);
    } else {
      window.removeEventListener('click', handleClickOutside);
    }
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isCartOpen, handleClickOutside]);

  return (
    <Layout>
      <button
        onClick={toggleCart}
        className={`fixed right-6 z-10 bg-yellow-600 text-white rounded-full p-3 shadow-lg transition-transform duration-200 ${isCartOpen ? 'animate-bounce' : ''}`}
        aria-label="Toggle Cart"
      >
        <FaShoppingCart />
        {totalItems > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">{totalItems}</span>
        )}
      </button>

      <Modal isOpen={isCartOpen} onClose={toggleCart} title="Your Cart">
        <Cart
          cartItems={cart}
          onRemove={removeFromCart}
          onCheckout={handleCheckout}
        />
      </Modal>

      <div className="container mx-auto flex flex-col lg:flex-row mt-8 bg-white p-6 rounded-lg shadow-lg relative">
        <aside className="w-full lg:w-1/4 p-4 lg:border-r lg:border-gray-200 bg-gray-100 rounded-lg shadow-md lg:mr-6">
          <h2 className="text-2xl font-serif font-bold text-center lg:text-left mb-6 text-gray-800">Menu Categories</h2>
          <Scrollbars style={{ height: 500 }} autoHide>
            <ul className="space-y-3">
              {Array.from(new Set(menuItems.map(item => item.item_category))).map((category) => (
                <li
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`cursor-pointer p-2 rounded-lg transition-colors ${selectedCategory === category ? 'bg-gray-300 font-bold' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  {category}
                </li>
              ))}
            </ul>
          </Scrollbars>
        </aside>

        <section className="w-full lg:w-3/4 p-4">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="border rounded-lg w-full p-2"
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
              <div className="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 gap-2">
                {filteredItems.length > 0 ? (
                  filteredItems.map(item => (
                    <div key={item.id} className="border p-4 rounded-lg shadow-md flex flex-col">
                      <img
                        src={item.imageUrl}
                        alt={item.item_name}
                        className="w-full h-40 object-cover object-center mb-2 rounded-lg"
                      />
                      <h3 className="text-lg font-semibold mb-2">{item.item_name}</h3>
                      <p className="text-yellow-600 font-semibold mb-2">${item.item_price}</p>
                      <p className="text-gray-500 text-sm mb-2">{item.item_description}</p>
                      {item.options.spice_level && <p className="text-red-600 text-sm">Spice Level: {item.options.spice_level}</p>}
                      {item.options.allergens && <p className="text-yellow-800 text-sm">Allergens: {item.options.allergens}</p>}
                      <div className="flex items-center justify-between mt-4">
                        {cart[item.id] ? (
                          <div className="flex items-center">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700 transition duration-200"
                            >
                              <FaMinus />
                            </button>
                            <span className="mt-2 mb-1 text-lg">{cart[item.id].quantity}</span>
                            <button
                              onClick={() => addToCart(item)}
                              className="text-green-500 hover:text-green-700 transition duration-200"
                            >
                              <FaPlus />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            className="w-full bg-yellow-600 text-white font-bold py-2 rounded-lg hover:bg-yellow-700 transition duration-200 my-2"
                          >
                            Add to Cart
                          </button>
                        )}
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
