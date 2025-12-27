import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { visitActionAPI } from '../services/api';
import { COLORS } from '../utils/constants';

export default function ReportScreen() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'today', 'week'

  useEffect(() => {
    loadReports();
  }, [filter]);

  const loadReports = async () => {
    try {
      const response = await visitActionAPI.getAll();
      
      if (response.data.success) {
        let filteredData = response.data.data;
        
        if (filter === 'today') {
          const today = new Date().toDateString();
          filteredData = filteredData.filter(
            item => new Date(item.checkin_time).toDateString() === today
          );
        } else if (filter === 'week') {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          filteredData = filteredData.filter(
            item => new Date(item.checkin_time) >= weekAgo
          );
        }
        
        setReports(filteredData);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
      Alert.alert('Error', 'Failed to load reports');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadReports();
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'terpasang':
        return COLORS.success;
      case 'outlet tidak ada':
        return COLORS.error;
      case 'toko tutup':
        return COLORS.warning;
      default:
        return COLORS.textLight;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Reports</Text>
        
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'all' && styles.filterButtonActive
            ]}
            onPress={() => setFilter('all')}
          >
            <Text style={[
              styles.filterButtonText,
              filter === 'all' && styles.filterButtonTextActive
            ]}>
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'today' && styles.filterButtonActive
            ]}
            onPress={() => setFilter('today')}
          >
            <Text style={[
              styles.filterButtonText,
              filter === 'today' && styles.filterButtonTextActive
            ]}>
              Today
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'week' && styles.filterButtonActive
            ]}
            onPress={() => setFilter('week')}
          >
            <Text style={[
              styles.filterButtonText,
              filter === 'week' && styles.filterButtonTextActive
            ]}>
              This Week
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {reports.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? 'Loading reports...' : 'No reports found'}
            </Text>
          </View>
        ) : (
          reports.map((report, index) => (
            <View key={index} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <Text style={styles.outletName}>{report.nama_outlet}</Text>
                <Text style={styles.dateText}>{formatDate(report.checkin_time)}</Text>
              </View>

              <View style={styles.reportDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Check In:</Text>
                  <Text style={styles.detailValue}>
                    {formatTime(report.checkin_time)}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Check Out:</Text>
                  <Text style={styles.detailValue}>
                    {formatTime(report.checkout_time)}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>POSM Status:</Text>
                  <Text style={[
                    styles.detailValue,
                    styles.statusText,
                    { color: getStatusColor(report.posm_status) }
                  ]}>
                    {report.posm_status || 'N/A'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Location:</Text>
                  <Text style={styles.detailValue}>
                    {report.checkin_latitude && report.checkin_longitude
                      ? `${report.checkin_latitude.toFixed(6)}, ${report.checkin_longitude.toFixed(6)}`
                      : 'N/A'}
                  </Text>
                </View>

                {report.photo_before && (
                  <View style={styles.photoIndicator}>
                    <Text style={styles.photoText}>📷 Before Photo: ✓</Text>
                  </View>
                )}

                {report.photo_after && (
                  <View style={styles.photoIndicator}>
                    <Text style={styles.photoText}>📷 After Photo: ✓</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  filterButtonTextActive: {
    color: COLORS.white,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  reportCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  outletName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  dateText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  reportDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  statusText: {
    textTransform: 'capitalize',
  },
  photoIndicator: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  photoText: {
    fontSize: 14,
    color: COLORS.success,
    fontWeight: '500',
  },
});
