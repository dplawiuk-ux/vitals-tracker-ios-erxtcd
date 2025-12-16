
import * as Clipboard from 'expo-clipboard';
import { HealthEntry } from '@/types/HealthEntry';

export const formatDateTime = (date: Date): string => {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

export const exportHeartRateToCSV = async (entries: HealthEntry[]): Promise<void> => {
  const csvHeader = 'Date/Time,Heart Rate (BPM)\n';
  const csvRows = entries.map(entry => 
    `${formatDateTime(entry.timestamp)},${entry.heartRate}`
  ).join('\n');
  
  const csv = csvHeader + csvRows;
  await Clipboard.setStringAsync(csv);
  console.log('Heart rate data copied to clipboard');
};

export const exportBloodPressureToCSV = async (entries: HealthEntry[]): Promise<void> => {
  const csvHeader = 'Date/Time,Systolic (mmHg),Diastolic (mmHg)\n';
  const csvRows = entries.map(entry => 
    `${formatDateTime(entry.timestamp)},${entry.systolicBP},${entry.diastolicBP}`
  ).join('\n');
  
  const csv = csvHeader + csvRows;
  await Clipboard.setStringAsync(csv);
  console.log('Blood pressure data copied to clipboard');
};

export const exportWeightToCSV = async (entries: HealthEntry[]): Promise<void> => {
  const csvHeader = 'Date/Time,Weight (kg)\n';
  const csvRows = entries.map(entry => 
    `${formatDateTime(entry.timestamp)},${entry.weight}`
  ).join('\n');
  
  const csv = csvHeader + csvRows;
  await Clipboard.setStringAsync(csv);
  console.log('Weight data copied to clipboard');
};

export const exportSpO2ToCSV = async (entries: HealthEntry[]): Promise<void> => {
  const csvHeader = 'Date/Time,SpO₂ (%)\n';
  const csvRows = entries.map(entry => 
    `${formatDateTime(entry.timestamp)},${entry.spo2}`
  ).join('\n');
  
  const csv = csvHeader + csvRows;
  await Clipboard.setStringAsync(csv);
  console.log('SpO2 data copied to clipboard');
};
