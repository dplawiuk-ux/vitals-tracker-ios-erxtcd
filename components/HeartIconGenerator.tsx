
import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, Platform } from 'react-native';
import { ZeldaHeart } from './ZeldaHeart';

export const HeartIconGenerator: React.FC = () => {
  const viewRef = useRef<View>(null);

  const generateIcon = async () => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Web Platform',
        'On web, you can take a screenshot of the heart icon below and save it as a 1024x1024 PNG file.'
      );
      return;
    }

    Alert.alert(
      'Generate Icon',
      'Please take a screenshot of the heart icon below and crop it to 1024x1024 pixels. Save it as:\n\n' +
      '1. icon.png (1024x1024) - for iOS\n' +
      '2. adaptive-icon.png (1024x1024) - for Android\n\n' +
      'Then update app.json to use these files.'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Heart Icon Generator</Text>
      <Text style={styles.instructions}>
        Use this to generate your app icon:
      </Text>
      
      <View style={styles.iconContainer} ref={viewRef}>
        <View style={styles.iconBackground}>
          <ZeldaHeart size={800} />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={generateIcon}>
        <Text style={styles.buttonText}>Instructions</Text>
      </TouchableOpacity>

      <Text style={styles.steps}>
        Steps:{'\n'}
        1. Take a screenshot of the heart above{'\n'}
        2. Crop to 1024x1024 pixels{'\n'}
        3. Save as icon.png in assets/images/{'\n'}
        4. Update app.json icon path{'\n'}
        5. Rebuild the app
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructions: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  iconContainer: {
    width: 1024,
    height: 1024,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconBackground: {
    width: 1024,
    height: 1024,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#FF0000',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  steps: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 24,
  },
});
