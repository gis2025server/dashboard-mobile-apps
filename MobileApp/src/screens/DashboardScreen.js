import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dashboardAPI, authAPI } from '../services/api';
import { COLORS } from '../utils/constants';

export default function DashboardScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUserData();
    loadDashboard();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadDashboard = async () => {
    try {
      const response = await dashboardAPI.getMyDashboard();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await authAPI.logout();
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.username}>{user?.nama || user?.username}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.sectionTitle}>Today's Overview</Text>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: COLORS.primary }]}>
            <Text style={styles.statValue}>
              {stats?.todayVisits || 0}
            </Text>
            <Text style={styles.statLabel}>Today's Visits</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: COLORS.success }]}>
            <Text style={styles.statValue}>
              {stats?.completedVisits || 0}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: COLORS.warning }]}>
            <Text style={styles.statValue}>
              {stats?.pendingVisits || 0}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: COLORS.secondary }]}>
            <Text style={styles.statValue}>
              {stats?.totalOutlets || 0}
            </Text>
            <Text style={styles.statLabel}>Total Outlets</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Visits')}
        >
          <Text style={styles.actionButtonText}>📋 View My Visits</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Reports')}
        >
          <Text style={styles.actionButtonText}>📊 View Reports</Text>
        </TouchableOpacity>

        {stats?.recentVisits && stats.recentVisits.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Recent Visits</Text>
            {stats.recentVisits.slice(0, 5).map((visit, index) => (
              <View key={index} style={styles.visitCard}>
                <View style={styles.visitHeader}>
                  <Text style={styles.visitOutlet}>{visit.nama_outlet}</Text>
                  <Text style={[
                    styles.visitStatus,
                    { color: visit.status === 'completed' ? COLORS.success : COLORS.warning }
                  ]}>
                    {visit.status}
                  </Text>
                </View>
                <Text style={styles.visitDate}>
                  {new Date(visit.date_visit).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  logoutButton: {
    padding: 10,
  },
  logoutText: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.white,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: COLORS.white,
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  visitCard: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  visitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  visitOutlet: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  visitStatus: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  visitDate: {
    fontSize: 14,
    color: COLORS.textLight,
  },
});
