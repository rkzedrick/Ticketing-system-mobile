import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, StatusBar, Alert, ImageBackground } from 'react-native';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const ForgotPasswordScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showSecondScreen, setShowSecondScreen] = useState(false); // Controls whether to show OTP/password screen

  // Step 1: Submit Username to Request OTP
  const handleUsernameSubmit = async () => {
    setErrors({});
    setIsButtonDisabled(true);

    // Validate username (alphanumeric check)
    if (!username || /[^a-zA-Z0-9]/.test(username)) {
      setErrors({ username: 'Please enter a valid alphanumeric username.' });
      setIsButtonDisabled(false);
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.19:8080/user/forgot-password', { username });
      if (response.status === 200) {
        setShowSecondScreen(true); // Move to the OTP/password screen
      } else {
        setErrors({ username: 'Failed to send OTP. Please try again.' });
      }
    } catch (error) {
      setErrors({ username: error.response?.data?.message || 'An error occurred.' });
    } finally {
      setIsButtonDisabled(false);
    }
  };

  // Step 2: Verify OTP and Change Password
  const handleChangePassword = async () => {
    setErrors({});
    setIsButtonDisabled(true);

    // Validate OTP and password
    if (!otp || !password) {
      setErrors({
        otp: !otp ? 'OTP is required.' : '',
        password: !password ? 'Password is required.' : '',
      });
      setIsButtonDisabled(false);
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.19:8080/user/verify-forgot-password', {
        username,
        otp,
        password,
      });
      if (response.status === 200) {
        Alert.alert('Success', 'Password reset successfully.');
        navigation.navigate('Login'); // Navigate to Login screen
      } else {
        setErrors({ otp: 'Failed to reset password. Please try again.' });
      }
    } catch (error) {
      setErrors({ otp: error.response?.data?.message || 'An error occurred.' });
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <ImageBackground
        source={require('../../../MobileApp/assets/background.jpg')}
        style={styles.background}
        resizeMode="cover"
      />
      <View style={styles.container}>
        {!showSecondScreen ? (
          // First screen to submit the username
          <View style={styles.inputBox}>
            <Text style={styles.title}>Forgot Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
              placeholderTextColor="#888"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleUsernameSubmit}
              disabled={isButtonDisabled}
            >
              <Text style={styles.submitButtonText}>Send OTP</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.backToLoginLink}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Second screen to enter OTP and change password
          <View style={styles.inputBox}>
            <Text style={styles.title}>Reset Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              value={otp}
              onChangeText={setOtp}
              placeholderTextColor="#888"
              keyboardType="numeric"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.otp && <Text style={styles.errorText}>{errors.otp}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#888"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleChangePassword}
              disabled={isButtonDisabled}
            >
              <Text style={styles.submitButtonText}>Reset Password</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  inputBox: {
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
  submitButton: {
    width: '100%',
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backToLoginLink: {
    color: '#007bff',
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});

export default ForgotPasswordScreen;
