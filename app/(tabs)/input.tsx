
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@react-navigation/native';
import { saveHealthEntry } from '@/utils/storage';
import { HealthEntry } from '@/types/HealthEntry';

export default function InputScreen() {
  const theme = useTheme();
  const [timestamp, setTimestamp] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  const [heartRate, setHeartRate] = useState('');
  const [systolicBP, setSystolicBP] = useState('');
  const [diastolicBP, setDiastolicBP] = useState('');
  const [weight, setWeight] = useState('');
  const [spo2, setSpo2] = useState('');

  const handleSave = async () => {
    const entry: HealthEntry = {
      id: Date.now().toString(),
      timestamp,
      heartRate: heartRate ? parseInt(heartRate) : undefined,
      systolicBP: systolicBP ? parseInt(systolicBP) : undefined,
      diastolicBP: diastolicBP ? parseInt(diastolicBP) : undefined,
      weight: weight ? parseFloat(weight) : undefined,
      spo2: spo2 ? parseFloat(spo2) : undefined,
    };

    const hasData = entry.heartRate || entry.systolicBP || entry.diastolicBP || entry.weight || entry.spo2;
    
    if (!hasData) {
      Alert.alert('No Data', 'Please enter at least one metric value.');
      return;
    }

    try {
      await saveHealthEntry(entry);
      
      setHeartRate('');
      setSystolicBP('');
      setDiastolicBP('');
      setWeight('');
      setSpo2('');
      setTimestamp(new Date());
      
      Alert.alert('Success', 'Health entry saved successfully!');
      console.log('Entry saved:', entry);
    } catch (error) {
      Alert.alert('Error', 'Failed to save health entry. Please try again.');
      console.error('Save error:', error);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newTimestamp = new Date(timestamp);
      newTimestamp.setFullYear(selectedDate.getFullYear());
      newTimestamp.setMonth(selectedDate.getMonth());
      newTimestamp.setDate(selectedDate.getDate());
      setTimestamp(newTimestamp);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newTimestamp = new Date(timestamp);
      newTimestamp.setHours(selectedTime.getHours());
      newTimestamp.setMinutes(selectedTime.getMinutes());
      setTimestamp(newTimestamp);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'ios' && styles.contentContainerWithTabBar,
        ]}
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Personal Vitals Tracker
        </Text>

        <View style={[styles.section, { backgroundColor: theme.dark ? '#1a1a1a' : '#f5f5f5' }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Entry Time
          </Text>
          
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity
              style={[styles.dateTimeButton, { backgroundColor: theme.dark ? '#2a2a2a' : '#fff' }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={[styles.dateTimeText, { color: theme.colors.text }]}>
                {timestamp.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.dateTimeButton, { backgroundColor: theme.dark ? '#2a2a2a' : '#fff' }]}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={[styles.dateTimeText, { color: theme.colors.text }]}>
                {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={timestamp}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={timestamp}
              mode="time"
              display="default"
              onChange={onTimeChange}
            />
          )}
        </View>

        <View style={[styles.section, { backgroundColor: theme.dark ? '#1a1a1a' : '#f5f5f5' }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Vital Signs
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Heart Rate (BPM)
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.dark ? '#2a2a2a' : '#fff',
                  color: theme.colors.text,
                  borderColor: theme.dark ? '#3a3a3a' : '#ddd',
                },
              ]}
              value={heartRate}
              onChangeText={setHeartRate}
              keyboardType="numeric"
              placeholder="e.g., 72"
              placeholderTextColor={theme.dark ? '#666' : '#999'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Systolic BP (mmHg)
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.dark ? '#2a2a2a' : '#fff',
                  color: theme.colors.text,
                  borderColor: theme.dark ? '#3a3a3a' : '#ddd',
                },
              ]}
              value={systolicBP}
              onChangeText={setSystolicBP}
              keyboardType="numeric"
              placeholder="e.g., 120"
              placeholderTextColor={theme.dark ? '#666' : '#999'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Diastolic BP (mmHg)
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.dark ? '#2a2a2a' : '#fff',
                  color: theme.colors.text,
                  borderColor: theme.dark ? '#3a3a3a' : '#ddd',
                },
              ]}
              value={diastolicBP}
              onChangeText={setDiastolicBP}
              keyboardType="numeric"
              placeholder="e.g., 80"
              placeholderTextColor={theme.dark ? '#666' : '#999'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Weight (kg)
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.dark ? '#2a2a2a' : '#fff',
                  color: theme.colors.text,
                  borderColor: theme.dark ? '#3a3a3a' : '#ddd',
                },
              ]}
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
              placeholder="e.g., 70.5"
              placeholderTextColor={theme.dark ? '#666' : '#999'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              SpO₂ (%)
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.dark ? '#2a2a2a' : '#fff',
                  color: theme.colors.text,
                  borderColor: theme.dark ? '#3a3a3a' : '#ddd',
                },
              ]}
              value={spo2}
              onChangeText={setSpo2}
              keyboardType="decimal-pad"
              placeholder="e.g., 98"
              placeholderTextColor={theme.dark ? '#666' : '#999'}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: '#007AFF' }]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Entry</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  contentContainerWithTabBar: {
    paddingTop: 48,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTimeButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  dateTimeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
