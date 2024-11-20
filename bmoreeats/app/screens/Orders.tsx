import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const { email: userEmail, token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (userEmail && token) {
        try {
          const response = await axios.get(
            `http://10.0.0.171:8082/api/orders?email=${userEmail}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // Sort orders by date in descending order
          const sortedOrders = response.data.sort(
            (a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          setOrders(sortedOrders);
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      }
    };

    fetchOrders();
  }, [userEmail, token]);

  if (!userEmail) {
    return <Text style={styles.message}>Please log in to view your orders.</Text>;
  }

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.receiptContainer}>
      <Text style={styles.orderId}>Order ID: {item.id}</Text>
      <Text style={styles.orderDate}>Date: {new Date(item.timestamp).toLocaleDateString()}</Text>
      <Text style={styles.sectionTitle}>Items:</Text>
      <View style={styles.itemsContainer}>
        {item.items.map((orderItem: any, index: number) => (
          <View key={index} style={styles.itemRow}>
            <Text
              style={styles.itemName}
              numberOfLines={1} // Restrict to a single line
              ellipsizeMode="tail" // Add ellipses for overflow
            >
              {orderItem.quantity} x {orderItem.item_name}
            </Text>
            <Text style={styles.itemPrice}>${(orderItem.quantity * orderItem.price).toFixed(2)}</Text>
          </View>
        ))}
      </View>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Amount:</Text>
        <Text style={styles.totalAmount}>${item.totalAmount.toFixed(2)}</Text>
      </View>
      <Text style={styles.paymentType}>
        Payment Mode: {item.paymentType === 'payNow' ? 'Paid Online' : 'Pay at Restaurant'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Orders</Text>
      {orders.length === 0 ? (
        <Text style={styles.message}>No orders found.</Text>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(order) => order.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginTop:20,
    marginBottom: 16,
    textAlign: 'center',
  },
  receiptContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#777',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  itemsContainer: {
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 14,
    color: '#333',
    maxWidth: '75%', // Limit width to avoid overflow
  },
  itemPrice: {
    fontSize: 14,
    color: '#333',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
    paddingTop: 8,
    marginTop: 8,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  paymentType: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: '#666',
  },
});

export default Orders;
