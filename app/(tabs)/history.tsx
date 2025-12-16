
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { useFocusEffect, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { getHealthEntries, getLatestMetricValue } from '@/utils/storage';
import { HealthEntry } from '@/types/HealthEntry';
import { METRICS } from '@/constants/metrics';

export default function HistoryScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [entries, setEntries] = useState<HealthEntry[]>([]);

  const loadEntries = async () => {
    const data = await getHealthEntries();
    setEntries(data);
    console.log('Loaded entries:', data.length);
  };

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [])
  );

  const formatDateTime = (date: Date): string => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderMetricCard = (metric: typeof METRICS[0]) => {
    let latestValue = null;
    
    if (metric.key === 'bloodPressure') {
      const systolic = getLatestMetricValue(entries, 'systolicBP');
      const diastolic = getLatestMetricValue(entries, 'diastolicBP');
      
      if (systolic && diastolic) {
        latestValue = {
          value: `${systolic.value}/${diastolic.value}`,
          timestamp: systolic.timestamp,
        };
      }
    } else {
      latestValue = getLatestMetricValue(entries, metric.key as keyof HealthEntry);
    }

    const handlePress = () => {
      console.log('Navigating to metric detail:', metric.key);
      router.push({
        pathname: '/metric-detail',
        params: { metric: metric.key }
      });
    };

    return (
      <TouchableOpacity
        key={metric.key}
        style={[styles.metricCard, { backgroundColor: theme.dark ? '#1a1a1a' : '#f5f5f5' }]}
        onPress={handlePress}
      >
        <View style={styles.metricHeader}>
          <IconSymbol
            ios_icon_name={metric.icon}
            android_material_icon_name={metric.androidIcon}
            size={32}
            color="#007AFF"
          />
          <Text style={[styles.metricLabel, { color: theme.colors.text }]}>
            {metric.label}
          </Text>
        </View>

        {latestValue ? (
          <View style={styles.metricContent}>
            <Text style={[styles.metricValue, { color: theme.colors.text }]}>
              {latestValue.value} {metric.unit}
            </Text>
            <Text style={[styles.metricTimestamp, { color: theme.dark ? '#999' : '#666' }]}>
              {formatDateTime(latestValue.timestamp)}
            </Text>
          </View>
        ) : (
          <Text style={[styles.noDataText, { color: theme.dark ? '#999' : '#666' }]}>
            No data recorded
          </Text>
        )}

        <View style={styles.chevronContainer}>
          <IconSymbol
            ios_icon_name="chevron.right"
            android_material_icon_name="chevron-right"
            size={20}
            color={theme.dark ? '#666' : '#999'}
          />
        </View>
      </TouchableOpacity>
    );
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
          styles.contentContainerWithTabBar,
        ]}
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Health History
        </Text>

        <Text style={[styles.subtitle, { color: theme.dark ? '#999' : '#666' }]}>
          Tap any metric to view detailed history
        </Text>

        <View style={styles.metricsContainer}>
          {METRICS.map(metric => renderMetricCard(metric))}
        </View>

        {entries.length === 0 && (
          <View style={styles.emptyState}>
            <IconSymbol
              ios_icon_name="chart.bar.doc.horizontal"
              android_material_icon_name="insert-chart"
              size={64}
              color={theme.dark ? '#666' : '#999'}
            />
            <Text style={[styles.emptyText, { color: theme.dark ? '#999' : '#666' }]}>
              No health data recorded yet
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.dark ? '#666' : '#999' }]}>
              Start tracking your vitals in the Input tab
            </Text>
          </View>
        )}
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
    paddingTop: Platform.OS === 'android' ? 48 : 0,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  metricsContainer: {
    gap: 12,
  },
  metricCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  metricLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  metricContent: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  metricTimestamp: {
    fontSize: 12,
    marginTop: 2,
  },
  noDataText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginRight: 8,
  },
  chevronContainer: {
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
