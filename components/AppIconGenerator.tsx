
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ZeldaHeart } from './ZeldaHeart';

export const AppIconGenerator: React.FC = () => {
  return (
    <View style={styles.container}>
      <ZeldaHeart size={512} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 1024,
    height: 1024,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
