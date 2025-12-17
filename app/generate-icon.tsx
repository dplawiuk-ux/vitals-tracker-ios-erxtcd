
import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ZeldaHeart } from '../components/ZeldaHeart';

export default function GenerateIconScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>App Icon Generator</Text>
      
      <Text style={styles.instructions}>
        Follow these steps to create your app icon:
      </Text>

      <View style={styles.stepsContainer}>
        <Text style={styles.step}>1. Take a screenshot of the heart icon below</Text>
        <Text style={styles.step}>2. Crop the screenshot to exactly 1024x1024 pixels</Text>
        <Text style={styles.step}>3. Save it as &apos;icon.png&apos; in assets/images/</Text>
        <Text style={styles.step}>4. For Android, save a copy as &apos;adaptive-icon.png&apos;</Text>
        <Text style={styles.step}>5. Delete the old icon files (final_quest_240x240.png)</Text>
        <Text style={styles.step}>6. Clear the app cache and rebuild</Text>
      </View>

      <View style={styles.iconWrapper}>
        <Text style={styles.iconLabel}>Screenshot this (1024x1024):</Text>
        <View style={styles.iconContainer}>
          <ZeldaHeart size={900} />
        </View>
      </View>

      <View style={styles.commandsContainer}>
        <Text style={styles.commandsTitle}>Commands to run:</Text>
        <View style={styles.commandBox}>
          <Text style={styles.command}>rm -rf node_modules/.cache</Text>
          <Text style={styles.command}>rm -rf .expo</Text>
          <Text style={styles.command}>npx expo start --clear</Text>
        </View>
      </View>

      <Text style={styles.note}>
        Note: The icon must be exactly 1024x1024 pixels for iOS App Store submission.
        For Android, the adaptive icon should have a transparent background.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 18,
    color: '#FF0000',
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  stepsContainer: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  step: {
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
  },
  iconWrapper: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  iconContainer: {
    width: 300,
    height: 300,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FF0000',
  },
  commandsContainer: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  commandsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  commandBox: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
  },
  command: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 12,
    color: '#0f0',
    marginBottom: 5,
  },
  note: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 40,
  },
});
