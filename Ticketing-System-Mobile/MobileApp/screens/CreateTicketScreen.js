import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const CreateTicketScreen = () => {
  const [description, setDescription] = useState('');
  const [dateCreated, setDateCreated] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('To Do');
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null); // State to hold user ID
  const [userType, setUserType] = useState(null); // State to hold user type
  const [reporter, setReporter] = useState(''); // State to hold reporter information

  useEffect(() => {
    const retrieveTokenAndUserId = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        const storedUserId = await AsyncStorage.getItem('userId'); // Assuming user ID is stored in AsyncStorage
        const storedUserType = await AsyncStorage.getItem('userType'); // Assuming user type is also stored
  
        console.log("Retrieved Token:", storedToken);
        console.log("Stored userId:", storedUserId);
        console.log("Stored userType:", storedUserType);
  
        if (!storedToken || !storedUserId || !storedUserType) {
          Alert.alert('Error', 'No authentication token, user ID, or user type found. Please log in again.');
          return;
        }
  
        setToken(storedToken); // Save token to component state
        setUserId(storedUserId); // Save user ID to component state
        setUserType(storedUserType); // Save user type to component state
  
        // Now set the reporter information based on the retrieved userType
        if (storedUserType === 'student') {
          setReporter('Student');
        } else if (storedUserType === 'employee') {
          setReporter('Employee');
        } else {
          setReporter('Unknown'); // Handle other user types if necessary
        }
  
      } catch (error) {
        console.error('Error retrieving data:', error);
        Alert.alert('Error', 'Failed to retrieve authentication data.');
      }
    };
  
    retrieveTokenAndUserId();
  }, []);
  

  const handleCreateTicket = async () => {
    if (!token || !userId || !userType) {
      Alert.alert('Error', 'You need to log in to submit a ticket.', [{ text: 'OK' }]);
      return;
    }
  
    const ticketData = {
      issue: description,
      dateCreated,
      status,
      // Include the appropriate object based on user type
      student: userType === 'student' ? { studentNumber: userId } : null,
      employee: userType === 'employee' ? { employeeNumber: userId } : null,
      // Set reporter to just the type without user ID
     
    };
  
    try {
      const response = await fetch('http://10.0.2.2:8080/TicketService/ticket/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Add the 'Bearer ' prefix here
        },
        body: JSON.stringify(ticketData),
      });
  
      const responseBody = await response.text();
      console.log("Response status:", response.status);
      console.log("Response body:", responseBody);
  
      if (response.ok) {
        Alert.alert('Success', 'Ticket submitted successfully!', [{ text: 'OK' }]);
        // Reset the fields
        setDescription('');
        setDateCreated(new Date().toISOString().split('T')[0]);
        setStatus('To Do');
      } else {
        Alert.alert('Error', responseBody, [{ text: 'OK' }]);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      Alert.alert('Error', 'Failed to submit ticket: ' + error.message, [{ text: 'OK' }]);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a Ticket</Text>
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Enter ticket description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Text style={styles.label}>Date Created</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={dateCreated}
        onChangeText={setDateCreated}
      />
      <Text style={styles.label}>Status</Text>
      <TextInput
        style={styles.input}
        placeholder="Status (e.g., To Do)"
        value={status}
        onChangeText={setStatus}
      />
      <Text style={styles.label}>Reporter</Text>
      <TextInput
        style={styles.input}
        value={reporter}
        editable={false} 
      />
      <TouchableOpacity style={styles.button} onPress={handleCreateTicket}>
        <Text style={styles.buttonText}>Submit Ticket</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: height * 0.046,
    paddingHorizontal: width * 0.04,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  title: {
    fontSize: width * 0.07,
    marginBottom: height * 0.03,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
    marginTop: height * 0.02,
  },
  label: {
    fontSize: width * 0.05,
    fontWeight: '500',
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 5,
    marginLeft: '5%',
  },
  input: {
    width: '90%',
    height: height * 0.06,
    borderColor: '#cccccc',
    borderWidth: 1,
    marginBottom: height * 0.02,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  descriptionInput: {
    height: height * 0.15,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: height * 0.02,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
    marginTop: height * 0.03,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: width * 0.045,
    fontWeight: '600',
  },
});

export default CreateTicketScreen;
