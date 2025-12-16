
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { IconSymbol } from '@/components/IconSymbol';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { LineChart } from '@/components/LineChart';
import { Toast } from '@/components/Toast';
import { getHealthEntries, getMetricHistory, deleteHealthEntry, updateHealthEntry } from '@/utils/storage';
import { HealthEntry, MetricType } from '@/types/HealthEntry';
import { METRICS } from '@/constants/metrics';
import { calculateStatistics } from '@/utils/statistics';
import {
  exportHeartRateToCSV,
  exportBloodPressureToCSV,
  exportWeightToCSV,
  exportSpO2ToCSV,
} from '@/utils/csvExport';

export default function MetricDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const metricKey = params.metric as MetricType;
  
  const [entries, setEntries] = useState<HealthEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<HealthEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [editingEntry, setEditingEntry] = useState<HealthEntry | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editSystolic, setEditSystolic] = useState('');
  const [editDiastolic, setEditDiastolic] = useState('');

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  const metric = METRICS.find(m => m.key === metricKey);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const loadEntries = async () => {
    setLoading(true);
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
    
    setLoading(false);
    console.log('Loaded metric history:', metricKey, filteredEntries.length);
  };

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [metricKey])
  );

  const formatDateTime = (date: Date): string => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleExport = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (filteredEntries.length === 0) {
      showToast('No data to export', 'error');
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
      
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showToast('Data copied to clipboard!', 'success');
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showToast('Failed to export data', 'error');
      console.error('Export error:', error);
    }
  };

  const handleDelete = async (entry: HealthEntry) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteHealthEntry(entry.id);
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              showToast('Entry deleted successfully', 'success');
              loadEntries();
            } catch (error) {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              showToast('Failed to delete entry', 'error');
              console.error('Delete error:', error);
            }
          },
        },
      ]
    );
  };

  const handleEdit = async (entry: HealthEntry) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditingEntry(entry);

    if (metricKey === 'bloodPressure') {
      setEditSystolic(entry.systolicBP?.toString() || '');
      setEditDiastolic(entry.diastolicBP?.toString() || '');
    } else {
      const value = entry[metricKey as keyof HealthEntry];
      setEditValue(value?.toString() || '');
    }
  };

  const handleSaveEdit = async () => {
    if (!editingEntry) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const updatedEntry = { ...editingEntry };

      if (metricKey === 'bloodPressure') {
        updatedEntry.systolicBP = editSystolic ? parseInt(editSystolic) : undefined;
        updatedEntry.diastolicBP = editDiastolic ? parseInt(editDiastolic) : undefined;
      } else {
        const numValue = editValue ? parseFloat(editValue) : undefined;
        (updatedEntry as any)[metricKey] = numValue;
      }

      await updateHealthEntry(updatedEntry);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showToast('Entry updated successfully', 'success');
      setEditingEntry(null);
      loadEntries();
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showToast('Failed to update entry', 'error');
      console.error('Update error:', error);
    }
  };

  const renderStatistics = () => {
    if (metricKey === 'bloodPressure') {
      const systolicStats = calculateStatistics(filteredEntries, 'systolicBP');
      const diastolicStats = calculateStatistics(filteredEntries, 'diastolicBP');

      if (!systolicStats || !diastolicStats) return null;

      return (
        <View style={[styles.statsContainer, { backgroundColor: theme.dark ? '#1a1a1a' : '#f5f5f5' }]}>
          <Text style={[styles.statsTitle, { color: theme.colors.text }]}>Statistics</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.dark ? '#999' : '#666' }]}>
                Avg Systolic
              </Text>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {systolicStats.average.toFixed(0)} mmHg
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.dark ? '#999' : '#666' }]}>
                Avg Diastolic
              </Text>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {diastolicStats.average.toFixed(0)} mmHg
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.dark ? '#999' : '#666' }]}>
                Range (Sys)
              </Text>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {systolicStats.min} - {systolicStats.max}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.dark ? '#999' : '#666' }]}>
                Range (Dia)
              </Text>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {diastolicStats.min} - {diastolicStats.max}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.dark ? '#999' : '#666' }]}>
                Total Readings
              </Text>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {systolicStats.count}
              </Text>
            </View>
          </View>
        </View>
      );
    } else {
      const stats = calculateStatistics(filteredEntries, metricKey as keyof HealthEntry);
      if (!stats) return null;

      return (
        <View style={[styles.statsContainer, { backgroundColor: theme.dark ? '#1a1a1a' : '#f5f5f5' }]}>
          <Text style={[styles.statsTitle, { color: theme.colors.text }]}>Statistics</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.dark ? '#999' : '#666' }]}>
                Average
              </Text>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {stats.average.toFixed(1)} {metric?.unit}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.dark ? '#999' : '#666' }]}>
                Minimum
              </Text>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {stats.min} {metric?.unit}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.dark ? '#999' : '#666' }]}>
                Maximum
              </Text>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {stats.max} {metric?.unit}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.dark ? '#999' : '#666' }]}>
                Total Readings
              </Text>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {stats.count}
              </Text>
            </View>
          </View>
        </View>
      );
    }
  };

  const renderChart = () => {
    if (metricKey === 'bloodPressure') {
      const systolicData = filteredEntries.map(entry => ({
        value: entry.systolicBP || 0,
        timestamp: entry.timestamp,
      }));

      const diastolicData = filteredEntries.map(entry => ({
        value: entry.diastolicBP || 0,
        timestamp: entry.timestamp,
      }));

      return (
        <LineChart
          multiSeries={[
            {
              data: systolicData.reverse(),
              label: 'Systolic',
              color: '#FF3B30',
            },
            {
              data: diastolicData.reverse(),
              label: 'Diastolic',
              color: '#007AFF',
            },
          ]}
          unit="mmHg"
        />
      );
    } else {
      const chartData = filteredEntries.map(entry => ({
        value: (entry[metricKey as keyof HealthEntry] as number) || 0,
        timestamp: entry.timestamp,
      }));

      return (
        <LineChart
          data={chartData.reverse()}
          label={metric?.label || ''}
          unit={metric?.unit || ''}
        />
      );
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
          <View style={styles.listItemLeft}>
            <Text style={[styles.listItemValue, { color: theme.colors.text }]}>
              {displayValue} {metric?.unit}
            </Text>
            <Text style={[styles.listItemDate, { color: theme.dark ? '#999' : '#666' }]}>
              {formatDateTime(item.timestamp)}
            </Text>
          </View>

          <View style={styles.listItemActions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#007AFF' }]}
              onPress={() => handleEdit(item)}
            >
              <IconSymbol
                ios_icon_name="pencil"
                android_material_icon_name="edit"
                size={18}
                color="#fff"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#FF3B30' }]}
              onPress={() => handleDelete(item)}
            >
              <IconSymbol
                ios_icon_name="trash"
                android_material_icon_name="delete"
                size={18}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
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

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
        <LoadingSpinner message="Loading metric data..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <Toast
        message={toastMessage}
        type={toastType}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />

      <View style={[styles.header, Platform.OS === 'android' && styles.headerAndroid]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
        >
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="chevron-left"
            size={24}
            color="#007AFF"
          />
          <Text style={[styles.backText, { color: '#007AFF' }]}>Back</Text>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: theme.dark ? '#2a2a2a' : '#f0f0f0' }]}
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowStats(!showStats);
            }}
          >
            <IconSymbol
              ios_icon_name="chart.bar"
              android_material_icon_name="bar-chart"
              size={20}
              color="#007AFF"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: '#007AFF' }]}
            onPress={handleExport}
          >
            <IconSymbol
              ios_icon_name="square.and.arrow.up"
              android_material_icon_name="share"
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
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
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <React.Fragment>
              {renderChart()}
              {showStats && renderStatistics()}
            </React.Fragment>
          }
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
          <Text style={[styles.emptySubtext, { color: theme.dark ? '#666' : '#999' }]}>
            Start tracking in the Input tab
          </Text>
        </View>
      )}

      <Modal
        visible={editingEntry !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setEditingEntry(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Edit Entry
            </Text>

            {metricKey === 'bloodPressure' ? (
              <React.Fragment>
                <View style={styles.modalInputGroup}>
                  <Text style={[styles.modalLabel, { color: theme.colors.text }]}>
                    Systolic (mmHg)
                  </Text>
                  <TextInput
                    style={[
                      styles.modalInput,
                      {
                        backgroundColor: theme.dark ? '#2a2a2a' : '#f5f5f5',
                        color: theme.colors.text,
                      },
                    ]}
                    value={editSystolic}
                    onChangeText={setEditSystolic}
                    keyboardType="numeric"
                    placeholder="120"
                    placeholderTextColor={theme.dark ? '#666' : '#999'}
                  />
                </View>

                <View style={styles.modalInputGroup}>
                  <Text style={[styles.modalLabel, { color: theme.colors.text }]}>
                    Diastolic (mmHg)
                  </Text>
                  <TextInput
                    style={[
                      styles.modalInput,
                      {
                        backgroundColor: theme.dark ? '#2a2a2a' : '#f5f5f5',
                        color: theme.colors.text,
                      },
                    ]}
                    value={editDiastolic}
                    onChangeText={setEditDiastolic}
                    keyboardType="numeric"
                    placeholder="80"
                    placeholderTextColor={theme.dark ? '#666' : '#999'}
                  />
                </View>
              </React.Fragment>
            ) : (
              <View style={styles.modalInputGroup}>
                <Text style={[styles.modalLabel, { color: theme.colors.text }]}>
                  {metric.label} ({metric.unit})
                </Text>
                <TextInput
                  style={[
                    styles.modalInput,
                    {
                      backgroundColor: theme.dark ? '#2a2a2a' : '#f5f5f5',
                      color: theme.colors.text,
                    },
                  ]}
                  value={editValue}
                  onChangeText={setEditValue}
                  keyboardType="decimal-pad"
                  placeholder={`Enter ${metric.label.toLowerCase()}`}
                  placeholderTextColor={theme.dark ? '#666' : '#999'}
                />
              </View>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.dark ? '#2a2a2a' : '#f0f0f0' }]}
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setEditingEntry(null);
                }}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#007AFF' }]}
                onPress={handleSaveEdit}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerAndroid: {
    paddingTop: 48,
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
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
  listItemLeft: {
    flex: 1,
  },
  listItemValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  listItemDate: {
    fontSize: 14,
    marginTop: 4,
  },
  listItemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
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
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInputGroup: {
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  modalInput: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
