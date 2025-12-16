
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Svg, { Line, Circle, Path, Text as SvgText } from 'react-native-svg';

interface DataPoint {
  value: number;
  timestamp: Date;
}

interface LineChartProps {
  data: DataPoint[];
  label: string;
  unit: string;
  color?: string;
}

export function LineChart({ data, label, unit, color = '#007AFF' }: LineChartProps) {
  const theme = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 60;
  const chartHeight = 200;
  const padding = 40;

  if (data.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.dark ? '#1a1a1a' : '#f5f5f5' }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{label}</Text>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: theme.dark ? '#999' : '#666' }]}>
            No data to display
          </Text>
        </View>
      </View>
    );
  }

  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue || 1;

  const points = data.map((point, index) => {
    const x = padding + (index / (data.length - 1 || 1)) * (chartWidth - 2 * padding);
    const y = chartHeight - padding - ((point.value - minValue) / valueRange) * (chartHeight - 2 * padding);
    return { x, y, value: point.value };
  });

  const pathData = points.map((point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }
    return `L ${point.x} ${point.y}`;
  }).join(' ');

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.dark ? '#1a1a1a' : '#f5f5f5' }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{label}</Text>
      
      <Svg width={chartWidth} height={chartHeight}>
        <Line
          x1={padding}
          y1={chartHeight - padding}
          x2={chartWidth - padding}
          y2={chartHeight - padding}
          stroke={theme.dark ? '#3a3a3a' : '#ddd'}
          strokeWidth="2"
        />
        <Line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={chartHeight - padding}
          stroke={theme.dark ? '#3a3a3a' : '#ddd'}
          strokeWidth="2"
        />

        <Path
          d={pathData}
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((point, index) => (
          <Circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="5"
            fill={color}
          />
        ))}

        <SvgText
          x={padding - 5}
          y={padding - 10}
          fill={theme.colors.text}
          fontSize="12"
          textAnchor="end"
        >
          {maxValue.toFixed(0)} {unit}
        </SvgText>

        <SvgText
          x={padding - 5}
          y={chartHeight - padding + 5}
          fill={theme.colors.text}
          fontSize="12"
          textAnchor="end"
        >
          {minValue.toFixed(0)} {unit}
        </SvgText>
      </Svg>

      <View style={styles.legend}>
        <Text style={[styles.legendText, { color: theme.dark ? '#999' : '#666' }]}>
          {formatDate(data[0].timestamp)} - {formatDate(data[data.length - 1].timestamp)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  emptyState: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  legend: {
    marginTop: 12,
    alignItems: 'center',
  },
  legendText: {
    fontSize: 12,
  },
});
