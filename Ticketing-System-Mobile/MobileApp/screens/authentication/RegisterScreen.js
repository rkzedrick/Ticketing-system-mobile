import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, StatusBar, ImageBackground } from 'react-native';
import TopBox from '../../../MobileApp/components/TopBox';


const { width, height } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleNext = () => {
    if (!username || !email || !password) {
      setErrorMessage('Please fill out all fields');
      return;
    }

    // Navigate directly to RegisterDetails without username check
    navigation.navigate('RegisterDetails', { username, email, password });
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
          <View style={styles.registerBox}>
            <Text style={styles.title}>Register</Text>
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Already have an account? Click here</Text>
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
    backgroundColor: 'transparent',
    paddingTop: StatusBar.currentHeight || 0,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    marginTop: width * 0.4,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  registerBox: {
    width: '85%',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: height * 0.03,
    marginBottom: height * 0.02,
    color: '#333',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: height * 0.06,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: height * 0.02,
    paddingHorizontal: width * 0.03,
  },
  nextButton: {
    width: '100%',
    height: height * 0.05,
    backgroundColor: '#2996f3',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.02,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: height * 0.02,
    fontWeight: 'bold',
  },
  loginLink: {
    color: '#0C356A',
    marginTop: height * 0.02,
    textAlign: 'center',
  },
});

export default RegisterScreen;
