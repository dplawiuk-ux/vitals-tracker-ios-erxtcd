
import { MetricInfo } from '@/types/HealthEntry';

export const METRICS: MetricInfo[] = [
  {
    key: 'heartRate',
    label: 'Heart Rate',
    unit: 'BPM',
    icon: 'heart.fill',
    androidIcon: 'favorite',
  },
  {
    key: 'bloodPressure',
    label: 'Blood Pressure',
    unit: 'mmHg',
    icon: 'waveform.path.ecg',
    androidIcon: 'show-chart',
  },
  {
    key: 'weight',
    label: 'Weight',
    unit: 'kg',
    icon: 'scalemass.fill',
    androidIcon: 'fitness-center',
  },
  {
    key: 'spo2',
    label: 'SpO₂',
    unit: '%',
    icon: 'lungs.fill',
    androidIcon: 'air',
  },
];
