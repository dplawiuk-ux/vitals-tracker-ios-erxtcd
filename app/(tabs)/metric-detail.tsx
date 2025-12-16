
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { getHealthEntries, getMetricHistory } from '@/utils/storage';
import { HealthEntry, MetricType } from '@/types/HealthEntry';
import { METRICS } from '@/constants/metrics';
import {
  exportHeartRateToCSV,
  exportBloodPressureToCSV,
  exportWeightToCSV,
  exportSpO2ToCSV,
  formatDateTime,
} from '@/utils/csvExport';

export default function MetricDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const metricKey = params.metric as MetricType;
  
  const [entries, setEntries] = useState<HealthEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<HealthEntry[]>([]);

  const metric = METRICS.find(m => m.key === metricKey);

  const loadEntries = async () => {
    const allEntries = await getHealthEntries();
    setEntries(allEntries);

    if (metricKey === 'bloodPressure') {
      const filtered = allEntries.filter(
        entry => entry.systolicBP !== undefined && entry.diastolicBP !== undefined
      ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setFilteredEntries(filtered);
    } else {
      const filtered = getMetricHistory(allEntries, metricKey as keyof HealthEntry);
      setFilteredEntries(filtered);
    }
    
    console.log('Loaded metric history:', metricKey, filteredEntries.length);
  };

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [metricKey])
  );

  const handleExport = async () => {
    if (filteredEntries.length === 0) {
      Alert.alert('No Data', 'There is no data to export.');
      return;
    }

    try {
      switch (metricKey) {
        case 'heartRate':
          await exportHeartRateToCSV(filteredEntries);
          break;
        case 'bloodPressure':
          await exportBloodPressureToCSV(filteredEntries);
          break;
        case 'weight':
          await exportWeightToCSV(filteredEntries);
          break;
        case 'spo2':
          await exportSpO2ToCSV(filteredEntries);
          break;
        default:
          console.log('Unknown metric type');
          return;
      }
      
      Alert.alert('Success', 'Data copied to clipboard in CSV format!');
    } catch (error) {
      Alert.alert('Error', 'Failed to export data. Please try again.');
      console.error('Export error:', error);
    }
  };

  const renderItem = ({ item }: { item: HealthEntry }) => {
    let displayValue = '';
    
    if (metricKey === 'bloodPressure') {
      displayValue = `${item.systolicBP}/${item.diastolicBP}`;
    } else {
      displayValue = String(item[metricKey as keyof HealthEntry]);
    }

    return (
      <View style={[styles.listItem, { backgroundColor: theme.dark ? '#1a1a1a' : '#f5f5f5' }]}>
        <View style={styles.listItemContent}>
          <Text style={[styles.listItemValue, { color: theme.colors.text }]}>
            {displayValue} {metric?.unit}
          </Text>
          <Text style={[styles.listItemDate, { color: theme.dark ? '#999' : '#666' }]}>
            {formatDateTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  if (!metric) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.text }]}>
            Invalid metric
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="chevron-left"
            size={24}
            color="#007AFF"
          />
          <Text style={[styles.backText, { color: '#007AFF' }]}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.exportButton, { backgroundColor: '#007AFF' }]}
          onPress={handleExport}
        >
          <IconSymbol
            ios_icon_name="square.and.arrow.up"
            android_material_icon_name="share"
            size={20}
            color="#fff"
          />
          <Text style={styles.exportButtonText}>Copy All Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <IconSymbol
          ios_icon_name={metric.icon}
          android_material_icon_name={metric.androidIcon}
          size={40}
          color="#007AFF"
        />
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {metric.label} History
        </Text>
      </View>

      {filteredEntries.length > 0 ? (
        <FlatList
          data={filteredEntries}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContainer,
            Platform.OS !== 'ios' && styles.listContainerWithTabBar,
          ]}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <IconSymbol
            ios_icon_name="chart.bar.doc.horizontal"
            android_material_icon_name="insert-chart"
            size={64}
            color={theme.dark ? '#666' : '#999'}
          />
          <Text style={[styles.emptyText, { color: theme.dark ? '#999' : '#666' }]}>
            No {metric.label.toLowerCase()} data recorded
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    fontSize: 16,
    fontWeight: '500',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  listContainerWithTabBar: {
    paddingBottom: 100,
  },
  listItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  listItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  listItemDate: {
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
