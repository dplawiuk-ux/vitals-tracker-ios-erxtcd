
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PixelHeart } from '@/components/PixelHeart';

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <PixelHeart size={160} color="#000000" />
      <Text style={styles.text}>Apps by verysmallapps.com</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 32,
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
  },
});
