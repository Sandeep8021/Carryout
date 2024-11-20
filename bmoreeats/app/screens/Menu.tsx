import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity,useWindowDimensions, TouchableWithoutFeedback,FlatList, Image, StyleSheet, Alert, Modal } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { BlurView } from 'expo-blur';
import { Ionicons} from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import Cart from './Cart';
import { PanResponder } from 'react-native';


interface MenuItem {
  id: string;
  item_name: string;
  item_price: number;
  item_description: string;
  imageUrl: string;
  item_category: string;
  options?: {
    spice_level?: string[];
    allergens?: string[];
  };
}

const Menu: React.FC = ({navigation}) => {
  const route = useRoute();
  const { restaurantId } = route.params as { restaurantId: string };
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [cart, setCart] = useState<{ [key: string]: MenuItem & { quantity: number } }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedOptions, setSelectedOptions] = useState({ spiceLevel: [] as string[],quantity:1 as Number, allergens: [] as string[] });
  const token = 'your_auth_token_here';
  const [data, setData] = useState<any>({});
  const [showAllTimings, setShowAllTimings] = useState(false);
  const [instructions, setInstructions] = useState('');
  const [modalPosition, setModalPosition] = useState(300); 
  const { width } = useWindowDimensions();  // Get screen width to determine column layout
  const columns = width > 900 ? 2 : 1; 
  const screenHeight = useWindowDimensions().height;
  useEffect(() => {
    fetchMenuItems();
  }, [restaurantId]);

  const fetchMenuItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://10.0.0.171:8080/api/restaurants/${restaurantId}/menu`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenuItems(response.data.menu);
      setData(response.data);
      setSelectedCategory('Side');
    } catch (error) {
      setError('Error fetching menu items.');
    } finally {
      setLoading(false);
    }
  };
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dy) > 10;
    },
    onPanResponderMove: (_, gestureState) => {
      const newPosition = Math.max(100, modalPosition + gestureState.dy);
      setModalPosition(newPosition);
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 50) {
        setModalPosition(screenHeight - 100);
      } else if (gestureState.dy < -50) {
        setModalPosition(300);
      }
    },
  });

  const renderAllergens = (allergens) => {
    if (!allergens || allergens.length === 0) return null;
    
    return allergens.map((allergen, index) => {
      switch (allergen) {
        case 'peanut':
          return <><Ionicons key={index} name="ios-peanut" size={20} color="brown" style={styles.allergenIcon} /><Text>Peanut</Text></>;
        case 'dairy':
          return <><FontAwesome5 key={index} name="cheese" size={20} color="orange" style={styles.allergenIcon} /><Text>Dairy</Text></>;
        case 'egg':
          return <><FontAwesome5 key={index} name="egg" size={20} color="yellow" style={styles.allergenIcon} /><Text>Egg</Text></>;
        case 'gluten':
          return <><FontAwesome5 key={index} name="bread-slice" size={20} color="orange" style={styles.allergenIcon} /><Text>Glutten</Text></>;
        case 'shellfish':
          return <><FontAwesome5 key={index} name="fish" size={20} color="blue" style={styles.allergenIcon} /><Text>ShellFish</Text></>;
        case 'soy':
          return <><Ionicons key={index} name="leaf" size={20} color="green" style={styles.allergenIcon} /><Text>Soy</Text></>;
        case 'tree_nuts':
          return <><FontAwesome5 key={index} name="tree" size={20} color="green" style={styles.allergenIcon} /><Text>TreeNuts</Text></>;
        case 'fish':
          return <><Ionicons key={index} name="ios-fish" size={20} color="blue" style={styles.allergenIcon} /><Text>Fish</Text></>;
        default:
          return null;
      }
    });
  };
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSearchTerm('');
  };

  const addToCart = useCallback((item: MenuItem, options: any) => {
    const uniqueKey = `${item.id}-${Date.now()}`; // Generate a unique key
    
    console.log(item, options)
    setCart((prevCart) => ({
      ...prevCart,
      [uniqueKey]: {
        ...item,
        quantity: 1,
        instructions: instructions,
        options,
      },
    }));
  }, []);
  const removeFromCart = useCallback((uniqueKey: string) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      delete newCart[uniqueKey];
      return newCart;
    });
  }, []);

  const handleAddToCartClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsOptionModalOpen(true);
  };
  

  const confirmAddToCart = () => {
    if (selectedItem) {
      addToCart(selectedItem, selectedOptions);
      setIsOptionModalOpen(false);
      setSelectedOptions({ spiceLevel: '',quantity:1 , allergens: [] });
    }
  };

  const filteredItems = menuItems.filter(item => {
    if (searchTerm) {
      return item.item_name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return item.item_category === selectedCategory;
  });

  // const toggleCart = () => setIsCartOpen(prev => !prev);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    {console.log("cart clikecd")}
  };

  const totalItems = Object.values(cart).reduce((total, item) => total + item.quantity, 0);
  const getTodaysTimings = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todayTiming = data.businessHours.find(dayTiming => dayTiming[today]);
    return todayTiming ? todayTiming[today].join(' and ') : 'Closed';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      // Cart button with modal toggle functionality
      <TouchableWithoutFeedback onPress={() => setIsOptionModalOpen(false)}>
        
          <TouchableOpacity onPress={toggleCart} style={styles.cartButton}>
            <Text style={{ color: 'white' }}>Cart</Text>
            <AntDesign name="shoppingcart" size={24} color="white" />
            {totalItems > 0 && <Text style={{ color: 'white' }}>{totalItems}</Text>}
          </TouchableOpacity>

      </TouchableWithoutFeedback>



<Modal visible={isCartOpen} animationType='slide' onRequestClose={toggleCart} transparent={true}>

  <View style={styles.modalOverlay}>
    <TouchableWithoutFeedback onPress={toggleCart}>
      <Cart cartItems={cart} onRemove={removeFromCart}/>
    </TouchableWithoutFeedback>
  </View>
</Modal>





      {/* Restaurant Details Section */}
      {data && (
        <View style={styles.restaurantDetails}>
          <Image source={{ uri: data.imageUrl }} style={styles.restaurantImage} />
          <Text style={styles.restaurantName}>{data.name}</Text>
          
          
          {data.businessHours && data.businessHours.length > 0 && (
          
          <View style={styles.businessHoursContainer}>
            {!showAllTimings ? (
              <TouchableOpacity
              onPress={() => setShowAllTimings(prev => !prev)}
              style={styles.toggleButton}
            >
              <View style={styles.businessHoursRow}>
                <Text style={styles.businessDay}>Today:</Text>
                <Text style={styles.businessTimes}>{getTodaysTimings()}</Text>
              </View>
              </TouchableOpacity>
            ) : (
              data.businessHours.map((dayTiming, index) => {
                const day = Object.keys(dayTiming)[0];
                const timings = dayTiming[day];
                return (
                  <TouchableOpacity
                  onPress={() => setShowAllTimings(prev => !prev)}
                  style={styles.toggleButton}
                >
                  <View key={index} style={styles.businessHoursRow}>
                  
                    <Text style={styles.businessDay}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}:
                    </Text>
                    <Text style={styles.businessTimes}>{timings.join(' and ')}</Text>
                    
                  </View>
                  
                  </TouchableOpacity>
                );
              })
            )}
            
          </View>
        )}  
          <Text style={styles.restaurantAddress}>{data.address}</Text>

        </View>
      )}
  <TextInput
        placeholder="Search menu items..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.searchInput}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {Array.from(new Set(menuItems.map(item => item.item_category))).map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => handleCategoryClick(category)}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategoryButton,
            ]}
          >
            <Text style={[styles.categoryButtonText, selectedCategory === category && styles.selectedCategoryButtonText]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      

      <FlatList
  data={filteredItems}
  keyExtractor={item => item.id}
  showsVerticalScrollIndicator={false}
  renderItem={({ item }) => (
    <TouchableOpacity
      onPress={() => handleAddToCartClick(item)}
      style={{ marginTop: 10 }}
      activeOpacity={0.7}
      
    >
      <View style={styles.menuItem}>
        <View style={styles.menuItemText}>
          <Text style={styles.itemName}>{item.item_name}</Text>
          <Text style={styles.itemPrice}>${item.item_price}</Text>
          <Text style={styles.itemDescription}>{item.item_description}</Text>
          {item.options.allergens && item.options.allergens.length > 0 && (
                <View style={styles.allergensContainer}>
                  <Text style={styles.allergenLabel}>Contains:</Text>
                  {renderAllergens(item.options.allergens)}
                </View>
              )}
        </View>
        <View style={{justifyContent:'center'}}>
          <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
        </View>
      </View>
    </TouchableOpacity>
  )}
/>



<View
          style={[styles.modalOverlay, { top: modalPosition }]}
          {...panResponder.panHandlers}
        >
<Modal
  visible={isOptionModalOpen}
  animationType="slide"
  onRequestClose={() => setIsOptionModalOpen(false)}
  transparent
>
  <TouchableWithoutFeedback onPress={() => setIsOptionModalOpen(false)}>
    <View style={styles.modalOverlay}>
      <TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          {selectedItem && (
            <View>
              {/* Spice Level Options */}
              {selectedItem.options.spice_level && (
  <View style={styles.optionsContainer}>
    <Text style={styles.optionHeader}>Spice Level</Text>
    <View style={styles.optionButtonsContainer}>
      {selectedItem.options.spice_level.map((level, index) => (
        <TouchableOpacity
          key={`${level}-${index}`} // Generate a unique key based on both the level and index
          onPress={() => {
            // Check if the level is already selected
            if (selectedOptions.spiceLevel.includes(level)) {
              // If it's already selected, remove it from the selection
              setSelectedOptions({
                ...selectedOptions,
                spiceLevel: selectedOptions.spiceLevel.filter(item => item !== level),
              });
            } else if (selectedOptions.spiceLevel.length < 2) {
              // If less than two levels are selected, add the new level
              setSelectedOptions({
                ...selectedOptions,
                spiceLevel: [...selectedOptions.spiceLevel, level],
              });
            }
          }}
          style={[
            styles.optionButton,
            selectedOptions.spiceLevel.includes(level) && styles.optionButtonSelected,
          ]}
        >
          <Text
            style={[
              styles.optionButtonText,
              selectedOptions.spiceLevel.includes(level) && styles.optionButtonTextSelected,
            ]}
          >
            {level}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
)}


              {/* Special Instructions */}
              <View style={styles.instructionsContainer}>
                <Text style={styles.optionHeader}>Special Instructions</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Add any special instructions..."
                  value={selectedOptions.instructions || ''}
                  onChangeText={(text) =>
                    setSelectedOptions({ ...selectedOptions, instructions: text })
                  }
                />
              </View>

              {/* Quantity Selector */}
              <View style={styles.quantityContainer}>
  <Text style={styles.optionHeader}>Quantity</Text>
  <View style={styles.quantityButtonsContainer}>
    {/* Decrement Button */}
    <TouchableOpacity
      onPress={() =>
        setSelectedOptions({
          ...selectedOptions,
          quantity: Math.max(1, (selectedOptions.quantity || 1) - 1),
        })
      }
      disabled={selectedOptions.quantity <= 1} // Disable button at minimum quantity
      style={[
        styles.quantityButton,
        selectedOptions.quantity <= 1 && styles.disabledButton, // Apply disabled style
      ]}
    >
      <Text
        style={[
          styles.quantityButtonText,
          selectedOptions.quantity <= 1 && styles.disabledButtonText, // Change text style when disabled
        ]}
      >
        -
      </Text>
    </TouchableOpacity>

    {/* Quantity Display */}
    <Text style={styles.quantityText}>{selectedOptions.quantity || 1}</Text>

    {/* Increment Button */}
    <TouchableOpacity
      onPress={() => {
        const maxQuantity = 10; // Example max quantity limit
        if ((selectedOptions.quantity || 1) < maxQuantity) {
          setSelectedOptions({
            ...selectedOptions,
            quantity: (selectedOptions.quantity || 1) + 1,
          });
        } else {
          // Optional: Show feedback when the max limit is reached
          alert('Maximum quantity reached!');
        }
      }}
      style={[
        styles.quantityButton,
        selectedOptions.quantity >= 10 && styles.disabledButton, // Apply disabled style at max limit
      ]}
    >
      <Text
        style={[
          styles.quantityButtonText,
          selectedOptions.quantity >= 10 && styles.disabledButtonText, // Change text style when disabled
        ]}
      >
        +
      </Text>
    </TouchableOpacity>
  </View>
</View>


              {/* Add to Cart Button */}
              <TouchableOpacity onPress={confirmAddToCart} style={styles.addToCartButton}>
                <Text style={styles.addToCartButtonText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  </TouchableWithoutFeedback>
</Modal>
</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    marginTop:45,
    backgroundColor: 'white',
  },
  modalContent: {
    width: '80%',
    height:'60%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5, // For shadow on Android
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    padding:10,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderColor:'gray',
    borderTopWidth:6,
    borderLeftWidth:2,
    borderBottomWidth:2,
    marginBottom:100,
    borderRadius:30,
    borderRightWidth:2,
    maxHeight: '50%',
  },
  optionsContainer: {
    marginVertical: 15,
  },
  optionHeader: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  optionButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  optionButton: {
    padding: 10,
    margin: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
  },
  optionButtonSelected: {
    borderColor: 'black',
    backgroundColor: 'black',
  },
  optionButtonText: {
    color: '#000',
  },
  optionButtonTextSelected: {
    color: '#fff',
  },
  

  addToCartButton: {
    marginTop: 25,
    padding: 15,
    backgroundColor: 'black',
    borderRadius: 30,
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cartItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cartItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  cartItemText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemQuantity: {
    fontSize: 18,
    color: '#666',
  },
  removeButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'red',
    fontSize: 16,
  },
  textInput: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 5 },
  quantityButtonsContainer: { flexDirection: 'row', alignItems: 'center', justifyContent:'center' },
  quantityButton: {
    
    backgroundColor: 'red',
    borderRadius: 50, // 50% of width/height to make it a circle
    width: 40, // Define width
    height: 40, // Define height
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: { margin: 10, fontSize: 16, color:'red' },
  emptyCartText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
  cartTotalContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  restaurantImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  addToCart:{
    backgroundColor: '#000000',
    paddingVertical: 10,
    padding:120,
    borderRadius: 25,
    margin:5,
    color:'white'
  },
  // optionsContainer:{
  //   flexDirection: 'row',
  //   margin:10,
    
  // },
  optionTitle:{
    marginLeft:8,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
    padding:10,
    flexWrap:'wrap'
    
  },
  restaurantDetails: {
    padding: 10,
    backgroundColor: 'white',
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  iconContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  restaurantAddress: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  restaurantDescription: {
    fontSize: 14,
    color: '#777',
  },
  cartButton: {
    position:'absolute',
    bottom: 60,
    right: 10,
    zIndex:2,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryContainer: {
    maxHeight: 50,  // Limit the height of the category container
    flexDirection: 'row',  // Keep items in a row
    flexWrap: 'wrap',  // Allow wrapping of category buttons
    marginBottom: 10,  // Slight margin to avoid collision with content below
  },
  categoryButton: {
    margin: 2,
    padding: 6,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
  },
  selectedCategoryButton: {
    backgroundColor: 'black',
  },
  categoryButtonText: {
    fontSize: 16,
  },
  selectedCategoryButtonText: {
    color: 'white',
  },
  searchInput: {
    padding: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 8,
  },
 header: {
    flexDirection: 'row',
    alignItems: 'center',
    
    backgroundColor: '#f8f8f8', // Light background for the header
    
  },
  backButton: {
    position:"absolute",
    top:12,
    left:12,
    width: 40,
    height: 40,
    borderRadius: 40, // Makes it circular
    backgroundColor: '#e0e0e0', // Neutral background
    alignItems: 'center',
    justifyContent: 'center',
    zIndex:1,
  },
  menuItem: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    padding: 10,
  },
  menuItemText: {
    flex: 1,
    marginRight: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
    color: '#888',
    marginTop: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  allergensContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'flex-start',  // Ensures allergens start at the beginning of the container
    justifyContent: 'flex-start', // Aligns icons from the left side
    flexWrap: 'wrap', // Allow allergens to wrap to the next line if needed
  },
  allergenLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginRight: 10, // Space between the label and icons
  },
  allergenIcon: {
    marginLeft: 5,
    marginRight: 5, // Space between allergen icons
  },

  businessHoursContainer: {
    marginTop: 4,
    color:'black'
  },
  businessHoursRow: {
    flexDirection: 'row',
    marginBottom: 4,
    color:'#black'
  },
  businessDay: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    color: '#black'
  },
  businessTimes: {
    fontSize: 16,
    color: '#555',
  },
});





export default Menu;
