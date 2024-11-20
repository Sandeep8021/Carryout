import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { CartItem, CartProps } from './types';
import { useAuth } from '../hooks/useAuth';

const Cart: React.FC<CartProps> = ({ cartItems, onRemove }) => {
  const stripe = useStripe();
  const [tipPercentage, setTipPercentage] = useState<number | null>(null);
  const [customTip, setCustomTip] = useState<string>(''); // Custom tip input
  const [instructions, setInstructions] = useState<{ [key: string]: string }>({});
  const [paymentOption, setPaymentOption] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { email: userEmail, token } = useAuth();
  const [customTipVisible, setCustomTipVisible]=useState(false);

  const subtotal = Object.values(cartItems).reduce(
    (sum, item) => sum + item.item_price * item.options.quantity,
    0
  );


  const serviceFee = subtotal * 0.01;
  const tax = subtotal * 0.06;
  const tip =
    tipPercentage !== null
      ? (tipPercentage / 100) * subtotal
      : customTip
      ? parseFloat(customTip)
      : 0;
  const total = subtotal + serviceFee + tax + tip;

  const handleTipChange = (percentage: number | null) => {
    setTipPercentage(percentage);
    setCustomTip('');
  };

  const handleCustomTipChange = (value: string) => {
    setCustomTip(value);
    setTipPercentage(null);
  };

  const handlePaymentOptionChange = (option: string) => {
    setPaymentOption(option);
  };


  const handleCheckoutClick = async () => {
    if (paymentOption) {
      if (paymentOption === 'payNow') {
        setIsProcessing(true);
        try {
          const response = await fetch('http://10.0.0.171:8082/api/payments/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ amount: total * 100, currency: 'usd' }),
          });

          if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
          }

          const data = await response.json();
          if (!data.clientSecret) {
            throw new Error('Client secret not found in the response');
          }

          const { error } = await stripe.confirmPayment({
            paymentMethodType: 'Card',
            clientSecret: data.clientSecret,
            paymentMethodData: {
              billingDetails: {
                email: userEmail,
              },
            },
          });

          if (error) {
            setError(error.message);
          } else {
            Alert.alert('Success', 'Payment completed successfully!');
          }
        } catch (err: any) {
          setError(`Checkout failed: ${err.message}`);
        } finally {
          setIsProcessing(false);
        }
      } else {
        Alert.alert('Success', 'Payment option saved!');
      }
    } else {
      Alert.alert('Error', 'Please select a payment option.');
    }
  };

  return (
    <View style={{justifyContent:'flex-end'}}>
    <ScrollView
      style={{
        padding: 16,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 16 }}>
        Order Receipt
      </Text>

      <ScrollView style={{ marginBottom: 16 }}>
        {Object.keys(cartItems).length > 0 ? (
          Object.values(cartItems).map((item) => (
            <View
              key={item.id}
              style={{
                borderBottomWidth: 1,
                borderColor: '#e0e0e0',
                paddingVertical: 8,
                marginBottom: 8,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, fontWeight: '600' }}>
                  {item.options.quantity} x {item.item_name}
                </Text>
                <Text style={{ fontSize: 16 }}>${(item.item_price * item.options.quantity).toFixed(2)}</Text>
                

              </View>
              {item.options.spiceLevel.length>=1&&
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text>Spice Level: {item.options.spiceLevel.length>1?item.options.spiceLevel.join('-'):item.options.spiceLevel}</Text>
              </View>}
            </View>
          ))
        ) : (
          <Text style={{ color: '#666', textAlign: 'center' }}>Your cart is empty.</Text>
        )}
      </ScrollView>
      <View style={{ marginVertical: 16 }}>
  <Text style={{ fontWeight: '600', marginBottom: 8, color: '#000' }}>Tip:</Text>
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
    {/* No Tip Button */}
    <TouchableOpacity
      onPress={() => handleTipChange(null)}
      style={{
        padding: 10,
        backgroundColor: tipPercentage === null && !customTip ? '#000' : '#fff',
        borderRadius: 30, // Rounded border
        marginBottom: 8,
        width: '48%',
        borderColor: '#000',
        borderWidth: 1,
      }}
    >
      <Text style={{ color: tipPercentage === null && !customTip ? '#fff' : '#000', textAlign: 'center' }}>None</Text>
    </TouchableOpacity>

    {/* 10% Tip Button */}
    <TouchableOpacity
      onPress={() => handleTipChange(10)}
      style={{
        padding: 10,
        backgroundColor: tipPercentage === 10 ? '#000' : '#fff',
        borderRadius: 30, // Rounded border
        marginBottom: 8,
        width: '48%',
        borderColor: '#000',
        borderWidth: 1,
      }}
    >
      <Text style={{ color: tipPercentage === 10 ? '#fff' : '#000', textAlign: 'center' }}>
        10% (${((10 / 100) * subtotal).toFixed(2)})
      </Text>
    </TouchableOpacity>

    {/* 15% Tip Button */}
    <TouchableOpacity
      onPress={() => handleTipChange(15)}
      style={{
        padding: 10,
        backgroundColor: tipPercentage === 15 ? '#000' : '#fff',
        borderRadius: 30, // Rounded border
        marginBottom: 8,
        width: '48%',
        borderColor: '#000',
        borderWidth: 1,
      }}
    >
      <Text style={{ color: tipPercentage === 15 ? '#fff' : '#000', textAlign: 'center' }}>
        15% (${((15 / 100) * subtotal).toFixed(2)})
      </Text>
    </TouchableOpacity>

    {/* 20% Tip Button */}
    <TouchableOpacity
      onPress={() => handleTipChange(20)}
      style={{
        padding: 10,
        backgroundColor: tipPercentage === 20 ? '#000' : '#fff',
        borderRadius: 30, // Rounded border
        marginBottom: 8,
        width: '48%',
        borderColor: '#000',
        borderWidth: 1,
      }}
    >
      <Text style={{ color: tipPercentage === 20 ? '#fff' : '#000', textAlign: 'center' }}>
        20% (${((20 / 100) * subtotal).toFixed(2)})
      </Text>
    </TouchableOpacity>

    {/* Custom Button */}
    <TouchableOpacity
      onPress={() => setCustomTipVisible(!customTipVisible)} // Toggle visibility of custom tip input
      style={{
        padding: 10,
        backgroundColor: customTipVisible ? '#000' : '#fff',
        borderRadius: 30, // Rounded border
        marginTop: 8,
        width: '100%',
        borderColor: '#000',
        borderWidth: 1,
      }}
    >
      <Text style={{ color: customTipVisible ? '#fff' : '#000', textAlign: 'center' }}>Custom</Text>
    </TouchableOpacity>
  </View>

  {/* Custom Tip Input */}
  {customTipVisible && (
    <TextInput
    placeholder="Enter custom tip"
    value={customTip}
    onChangeText={(text) => {
      // Add a leading zero if there's a decimal point at the beginning
      if (text === '.' || text === '') {
        handleCustomTipChange('0' + text);
      } else if (/^\d*\.?\d{0,2}$/.test(text)) {
        handleCustomTipChange(text);
      }
    }}
    style={{
      borderWidth: 1,
      borderColor: '#000',
      borderRadius: 30, // Rounded border
      padding: 10,
      marginTop: 8,
      width: '100%',
      color: '#000',
    }}
    keyboardType="numeric"
  />
  
  )}
</View>

      <View
        style={{
          borderTopWidth: 1,
          borderColor: '#e0e0e0',
          paddingVertical: 16,
        }}
      >
        <Text style={{ fontSize: 16 }}>Subtotal: ${subtotal.toFixed(2)}</Text>
        <Text style={{ fontSize: 16 }}>Service Fee (1%): ${serviceFee.toFixed(2)}</Text>
        <Text style={{ fontSize: 16 }}>Tax (6%): ${tax.toFixed(2)}</Text>
        <Text style={{ fontSize: 16, marginTop: 8, fontWeight: '600' }}>
          Total: ${total.toFixed(2)}
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleCheckoutClick}
        style={{
          marginTop: 16,
          padding: 12,
          backgroundColor: isProcessing ? '#ccc' : '#007AFF',
          borderRadius: 25,
        }}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', textAlign: 'center' }}>Checkout</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
    </View>
  );
};

export default Cart;
