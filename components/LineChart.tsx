
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Svg, { Line, Circle, Path, Text as SvgText } from 'react-native-svg';

interface DataPoint {
  value: number;
  timestamp: Date;
}

interface DataSeries {
  data: DataPoint[];
  label: string;
  color: string;
}

interface LineChartProps {
  data?: DataPoint[];
  label?: string;
  unit: string;
  color?: string;
  multiSeries?: DataSeries[];
}

export function LineChart({ data, label, unit, color = '#007AFF', multiSeries }: LineChartProps) {
  const theme = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 60;
  const chartHeight = 200;
  const padding = 40;

  const isMultiSeries = multiSeries && multiSeries.length > 0;
  const chartData = isMultiSeries ? multiSeries : (data ? [{ data, label: label || '', color }] : []);

  if (chartData.length === 0 || chartData.every(series => series.data.length === 0)) {
    return (
      <View style={[styles.container, { backgroundColor: theme.dark ? '#1a1a1a' : '#f5f5f5' }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{label || 'Chart'}</Text>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: theme.dark ? '#999' : '#666' }]}>
            No data to display
          </Text>
        </View>
      </View>
    );
  }

  const allValues = chartData.flatMap(series => series.data.map(d => d.value));
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const valueRange = maxValue - minValue || 1;

  const maxDataLength = Math.max(...chartData.map(series => series.data.length));

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const firstSeriesWithData = chartData.find(series => series.data.length > 0);
  const dateRange = firstSeriesWithData ? {
    start: firstSeriesWithData.data[0].timestamp,
    end: firstSeriesWithData.data[firstSeriesWithData.data.length - 1].timestamp
  } : null;

  return (
    <View style={[styles.container, { backgroundColor: theme.dark ? '#1a1a1a' : '#f5f5f5' }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {isMultiSeries ? 'Blood Pressure History' : label}
      </Text>
      
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

        {chartData.map((series, seriesIndex) => {
          if (series.data.length === 0) return null;

          const points = series.data.map((point, index) => {
            const x = padding + (index / (series.data.length - 1 || 1)) * (chartWidth - 2 * padding);
            const y = chartHeight - padding - ((point.value - minValue) / valueRange) * (chartHeight - 2 * padding);
            return { x, y, value: point.value };
          });

          const pathData = points.map((point, index) => {
            if (index === 0) {
              return `M ${point.x} ${point.y}`;
            }
            return `L ${point.x} ${point.y}`;
          }).join(' ');

          return (
            <React.Fragment key={seriesIndex}>
              <Path
                d={pathData}
                stroke={series.color}
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {points.map((point, index) => (
                <Circle
                  key={`${seriesIndex}-${index}`}
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill={series.color}
                />
              ))}
            </React.Fragment>
          );
        })}

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

      {isMultiSeries && (
        <View style={styles.legendContainer}>
          {chartData.map((series, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: series.color }]} />
              <Text style={[styles.legendLabel, { color: theme.colors.text }]}>
                {series.label}
              </Text>
            </View>
          ))}
        </View>
      )}

      {dateRange && (
        <View style={styles.legend}>
          <Text style={[styles.legendText, { color: theme.dark ? '#999' : '#666' }]}>
            {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
          </Text>
        </View>
      )}
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
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  legendLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  legend: {
    marginTop: 12,
    alignItems: 'center',
  },
  legendText: {
    fontSize: 12,
  },
});
