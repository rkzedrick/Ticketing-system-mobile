import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ImageBackground, SafeAreaView, StatusBar, Alert } from 'react-native';
import TopBox from '../../../MobileApp/components/TopBox';  // Adjust the path as needed
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.1.19:8081/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      console.log("Login response status:", response.status);
  
      if (!response.ok) {
        const errorResponse = await response.text();
        console.error("Error response from server:", errorResponse);
        throw new Error('Login failed. Please check your username and password.');
      }
  
      const data = await response.json();
      console.log("Login data:", data);  // Log the response body
  
      // Try to get token from headers
      let token = response.headers.get('Authorization');
      
      // If token is not in headers, check the body
      if (!token && data.token) {
        token = data.token;
      }
  
      // Handle missing token error
      if (!token) {
        throw new Error('Token not found in response.');
      }
  
      const rawToken = token.replace('Bearer ', '');
      console.log("Token received:", rawToken);  // Log token for debugging
  
      await AsyncStorage.setItem('authToken', rawToken);
  
      const userId = data.userId || '';
      let userType = '';
  
      if (data.role === 'ROLE_MISSTAFF') userType = 'misStaff';
      else if (data.role === 'ROLE_STUDENT') userType = 'student';
      else if (data.role === 'ROLE_EMPLOYEE') userType = 'employee';
  
      if (userId) await AsyncStorage.setItem('userId', userId);
      if (userType) await AsyncStorage.setItem('userType', userType);
  
      Alert.alert('Login Successful', `Welcome, ${data.username}!`);
      navigation.navigate('Home', { token: rawToken, user: data });
  
    } catch (error) {
      console.error('Login error:', error);
  
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('userType');
      await AsyncStorage.removeItem('authToken');
  
      Alert.alert('Error', error.message);
    }
  };
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <ImageBackground
        source={require('../../../MobileApp/assets/background.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <TopBox />
          <View style={styles.loginBox}>
            <Text style={styles.title}>Login</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              placeholderTextColor="#888"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#888"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('RegisterFlow')}>
              <Text style={styles.registerLink}>Don't have an account? Click here</Text>
            </TouchableOpacity>
            
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  background: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  loginBox: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  forgotText: {
    color: '#007bff',
    fontSize: 14,
    marginBottom: 20,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerLink: {
    color: '#007bff',
    fontSize: 14,
  },
});

export default LoginScreen;
