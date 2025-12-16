
import { HealthEntry } from '@/types/HealthEntry';

export interface Statistics {
  average: number;
  min: number;
  max: number;
  latest: number;
  trend: 'up' | 'down' | 'stable';
  count: number;
}

export const calculateStatistics = (
  entries: HealthEntry[],
  metricKey: keyof HealthEntry
): Statistics | null => {
  const values = entries
    .map(entry => entry[metricKey])
    .filter((value): value is number => typeof value === 'number');

  if (values.length === 0) {
    return null;
  }

  const average = values.reduce((sum, val) => sum + val, 0) / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const latest = values[0];

  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (values.length >= 2) {
    const previous = values[1];
    const change = ((latest - previous) / previous) * 100;
    
    if (change > 2) {
      trend = 'up';
    } else if (change < -2) {
      trend = 'down';
    }
  }

  return {
    average,
    min,
    max,
    latest,
    trend,
    count: values.length,
  };
};

export const getTrendIcon = (trend: 'up' | 'down' | 'stable'): string => {
  switch (trend) {
    case 'up':
      return '↑';
    case 'down':
      return '↓';
    case 'stable':
      return '→';
  }
};

export const getTrendColor = (trend: 'up' | 'down' | 'stable'): string => {
  switch (trend) {
    case 'up':
      return '#34C759';
    case 'down':
      return '#FF3B30';
    case 'stable':
      return '#8E8E93';
  }
};
