import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, Alert, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import TopBox from '../components/TopBox'; // Import TopBox component

const { height, width } = Dimensions.get('window');

const ProfileScreen = () => {
  const [userType, setUserType] = useState(null);
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();

  const getTokenWithRetry = async () => {
    let token = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      token = await AsyncStorage.getItem('authToken');
      console.log(`Token retrieval attempt ${attempt}:`, token);
      if (token && token !== 'null' && token !== '') break;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    return token;
  };

  const fetchProfileData = async () => {
    const token = await getTokenWithRetry();
    const userId = route?.params?.userId || await AsyncStorage.getItem('userId');
    const userType = route?.params?.userType || await AsyncStorage.getItem('userType');

    console.log("Fetched data - userId:", userId, ", userType:", userType, ", token:", token);

    if (!userId || !userType || !token) {
      console.log("Required data missing - userId:", userId, ", userType:", userType, ", token:", token);
      setError("User information or token not found. Please log in again.");
      setLoading(false);
      Alert.alert("Session Expired", "User information or token not found. Please log in again.");
      return;
    }

    const endpoint = userType === 'employee'
      ? `http://10.0.2.2:8080/EmployeeService/employee/${userId}`
      : `http://10.0.2.2:8080/StudentService/student/${userId}`;
  
    try {
      const response = await axios.get(endpoint, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile data:", error.message);
      setError('An error occurred while fetching profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { userId, userType }); // Navigate to edit profile screen
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
        <Text style={{ textAlign: 'center', marginTop: 10 }}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
         <TopBox />
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Include TopBox here */}
      <TopBox />

      <Text style={styles.userTypeText}>User Type: {userType}</Text>
      
      {/* Profile Information */}
      <View style={styles.profileBox}>
        <Text style={styles.label}>First Name: <Text style={styles.value}>{profile.firstName || 'N/A'}</Text></Text>
      </View>
      <View style={styles.profileBox}>
        <Text style={styles.label}>Middle Name: <Text style={styles.value}>{profile.middleName || 'N/A'}</Text></Text>
      </View>
      <View style={styles.profileBox}>
        <Text style={styles.label}>Last Name: <Text style={styles.value}>{profile.lastName || 'N/A'}</Text></Text>
      </View>
      <View style={styles.profileBox}>
        <Text style={styles.label}>Email: <Text style={styles.value}>{profile.email || 'N/A'}</Text></Text>
      </View>
      <View style={styles.profileBox}>
        <Text style={styles.label}>Contact Number: <Text style={styles.value}>{profile.contactNumber || 'N/A'}</Text></Text>
      </View>
      <View style={styles.profileBox}>
        <Text style={styles.label}>Address: <Text style={styles.value}>{profile.address || 'N/A'}</Text></Text>
      </View>
      {userType === 'student' && (
        <View style={styles.profileBox}>
          <Text style={styles.label}>Student Number: <Text style={styles.value}>{profile.studentNumber || 'N/A'}</Text></Text>
        </View>
      )}
      <View style={styles.profileBox}>
        <Text style={styles.label}>Birthdate: <Text style={styles.value}>{profile.birthdate || 'N/A'}</Text></Text>
      </View>

      {/* Edit Profile Button */}
      <TouchableOpacity onPress={handleEditProfile} style={styles.editProfileButton}>
        <Text style={styles.editProfileButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: height * 0.34,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 30,
    alignItems: 'center',
  },

  userTypeText: {
    fontSize: height * 0.025, 
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,  
  },
  profileBox: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 13,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  label: {
    fontSize: height * 0.02, 
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    fontWeight: 'normal',
    color: '#555',
    fontSize: height * 0.019, 
  },
  editProfileButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,

  },
  editProfileButtonText: {
    color: '#222',
    fontSize: height * 0.022, 
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProfileScreen;
