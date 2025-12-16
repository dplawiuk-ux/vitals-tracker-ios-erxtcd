
export interface HealthEntry {
  id: string;
  timestamp: Date;
  heartRate?: number;
  systolicBP?: number;
  diastolicBP?: number;
  weight?: number;
  spo2?: number;
}

export type MetricType = 'heartRate' | 'systolicBP' | 'diastolicBP' | 'weight' | 'spo2' | 'bloodPressure';

export interface MetricInfo {
  key: MetricType;
  label: string;
  unit: string;
  icon: string;
  androidIcon: string;
}
