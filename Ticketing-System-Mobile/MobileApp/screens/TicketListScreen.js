import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import TopBox from '../components/TopBox';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height, width } = Dimensions.get('window');

const TicketListScreen = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const userType = await AsyncStorage.getItem('userType');
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('authToken');

        if (!userId || !userType || !token) {
          setError('User information or token not found. Please log in again.');
          setLoading(false);
          return;
        }

        const url = `http://10.0.2.2:8080/TicketService/tickets/user/${userId}`;
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setTickets(response.data);
        } else if (response.status === 204) {
          setError('No tickets found for the given user.');
        } else {
          setError('Failed to fetch tickets. Server error occurred.');
        }
      } catch (error) {
        console.error('Error fetching tickets:', error.message);
        setError('Failed to fetch tickets. Please check your network connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.rowText}>{item.issue ? String(item.issue) : 'No Issue'}</Text>
      <Text style={styles.rowText}>{item.status ? String(item.status) : 'No Status'}</Text>
      <Text style={styles.rowText}>{item.dateCreated ? new Date(item.dateCreated).toLocaleDateString() : 'No Date'}</Text>
      <Text style={styles.rowText}>{item.dateFinished ? new Date(item.dateFinished).toLocaleDateString() : 'N/A'}</Text>
      <Text style={styles.rowText}>
        {item.misStaff && (item.misStaff.firstName || item.misStaff.lastName) 
          ? `${String(item.misStaff.firstName || '')} ${String(item.misStaff.lastName || '')}`.trim() 
          : 'Unassigned'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TopBox />
      <Text style={styles.title}>Ticket List</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          <View style={styles.tableHeader}>
            <Text style={styles.headerText}>Issue</Text>
            <Text style={styles.headerText}>Status</Text>
            <Text style={styles.headerText}>Date Created</Text>
            <Text style={styles.headerText}>Date Finished</Text>
            <Text style={styles.headerText}>MIS Staff Name</Text>
          </View>
          <FlatList
            data={tickets}
            keyExtractor={(item) => item.ticketId.toString()}
            contentContainerStyle={styles.tableBody}
            renderItem={renderItem}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: height * 0.46,
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: width * 0.06,
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
    fontWeight: '600',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#e0e0e0',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  headerText: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#4a4a4a',
    textAlign: 'center',
    flex: 1,
  },
  tableBody: {
    paddingTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginVertical: 5,
    paddingHorizontal: 5,
  },
  rowText: {
    fontSize: width * 0.04,
    color: '#555',
    textAlign: 'center',
    flex: 1,
  },
  errorText: {
    color: 'red',
    fontSize: width * 0.04,  
    textAlign: 'center',
    marginTop: 20,
  },
});

export default TicketListScreen;
