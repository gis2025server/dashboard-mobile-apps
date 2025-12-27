import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { visitAPI } from '../services/api';
import { COLORS } from '../utils/constants';

export default function VisitListScreen({ navigation }) {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedType, setSelectedType] = useState('md'); // 'md' or 'sales'

  useEffect(() => {
    loadVisits();
  }, [selectedType]);

  const loadVisits = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await visitAPI.getByDate(today, selectedType);
      
      if (response.data.success) {
        setVisits(response.data.data);
      }
    } catch (error) {
      console.error('Error loading visits:', error);
      Alert.alert('Error', 'Failed to load visits');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadVisits();
  };

  const handleVisitPress = (visit) => {
    navigation.navigate('VisitAction', { visit });
  };

  const renderVisitItem = ({ item }) => {
    const isCompleted = item.status === 'completed';
    const isPending = item.status === 'pending';

    return (
      <TouchableOpacity
        style={styles.visitCard}
        onPress={() => handleVisitPress(item)}
        disabled={isCompleted}
      >
        <View style={styles.visitHeader}>
          <Text style={styles.outletName}>{item.nama_outlet}</Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: isCompleted ? COLORS.success : isPending ? COLORS.warning : COLORS.primary }
          ]}>
            <Text style={styles.statusText}>
              {item.status || 'pending'}
            </Text>
          </View>
        </View>

        <View style={styles.visitDetails}>
          <Text style={styles.detailText}>📍 {item.alamat || 'No address'}</Text>
          <Text style={styles.detailText}>🏢 Warehouse: {item.warehouse}</Text>
          <Text style={styles.detailText}>📦 AMO: {item.amo}</Text>
          <Text style={styles.detailText}>
            📅 {new Date(item.date_visit).toLocaleDateString()}
          </Text>
        </View>

        {!isCompleted && (
          <View style={styles.actionButton}>
            <Text style={styles.actionButtonText}>
              {isPending ? 'Start Visit →' : 'Continue Visit →'}
            </Text>
          </View>
        )}

        {isCompleted && (
          <Text style={styles.completedText}>✓ Visit Completed</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Visits</Text>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              selectedType === 'md' && styles.typeButtonActive
            ]}
            onPress={() => setSelectedType('md')}
          >
            <Text style={[
              styles.typeButtonText,
              selectedType === 'md' && styles.typeButtonTextActive
            ]}>
              MD
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              selectedType === 'sales' && styles.typeButtonActive
            ]}
            onPress={() => setSelectedType('sales')}
          >
            <Text style={[
              styles.typeButtonText,
              selectedType === 'sales' && styles.typeButtonTextActive
            ]}>
              Sales
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={visits}
        renderItem={renderVisitItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? 'Loading visits...' : 'No visits scheduled for today'}
            </Text>
          </View>
        }
      />
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
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  typeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  typeButtonTextActive: {
    color: COLORS.white,
  },
  listContent: {
    padding: 15,
  },
  visitCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  visitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  outletName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  visitDetails: {
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  completedText: {
    color: COLORS.success,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
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
});
