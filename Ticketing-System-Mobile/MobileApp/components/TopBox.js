// TopBox.js
import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const TopBox = () => (
  <View style={styles.topBox}>
    <Image source={require('../assets/loge_new 2.png')} style={styles.logo} />
  </View>
);

const styles = StyleSheet.create({
  topBox: {
    width: '120%',
    height: height * 0.07,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: height * -0.3,
    marginBottom: height * 0.12,
    backgroundColor: '#0C356A',
  },
  logo: {
    width: width * 0.6,
    height: '100%',
    marginRight: width * 0.4,
    resizeMode: 'contain',
  },
});

export default TopBox;
