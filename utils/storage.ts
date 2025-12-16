
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HealthEntry } from '@/types/HealthEntry';

const STORAGE_KEY = '@health_entries';

export const saveHealthEntry = async (entry: HealthEntry): Promise<void> => {
  try {
    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    const entries: HealthEntry[] = existingData ? JSON.parse(existingData) : [];
    
    const newEntry = {
      ...entry,
      timestamp: entry.timestamp.toISOString(),
    };
    
    entries.push(newEntry);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    console.log('Health entry saved successfully');
  } catch (error) {
    console.error('Error saving health entry:', error);
    throw error;
  }
};

export const getHealthEntries = async (): Promise<HealthEntry[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (!data) {
      console.log('No health entries found');
      return [];
    }
    
    const entries = JSON.parse(data);
    return entries.map((entry: any) => ({
      ...entry,
      timestamp: new Date(entry.timestamp),
    }));
  } catch (error) {
    console.error('Error getting health entries:', error);
    return [];
  }
};

export const getLatestMetricValue = (entries: HealthEntry[], metric: keyof HealthEntry): { value: any; timestamp: Date } | null => {
  const sortedEntries = entries
    .filter(entry => entry[metric] !== undefined && entry[metric] !== null)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  if (sortedEntries.length === 0) {
    return null;
  }
  
  return {
    value: sortedEntries[0][metric],
    timestamp: sortedEntries[0].timestamp,
  };
};

export const getMetricHistory = (entries: HealthEntry[], metric: keyof HealthEntry): HealthEntry[] => {
  return entries
    .filter(entry => entry[metric] !== undefined && entry[metric] !== null)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const clearAllEntries = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log('All health entries cleared');
  } catch (error) {
    console.error('Error clearing health entries:', error);
    throw error;
  }
};
