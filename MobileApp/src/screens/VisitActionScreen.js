import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { visitActionAPI } from '../services/api';
import { getCurrentLocation, isWithinRadius, formatDistance, calculateDistance } from '../services/location';
import { COLORS, POSM_STATUS, PHOTO_TYPES } from '../utils/constants';

export default function VisitActionScreen({ route, navigation }) {
  const { visit } = route.params;
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [actionId, setActionId] = useState(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [beforePhoto, setBeforePhoto] = useState(null);
  const [afterPhoto, setAfterPhoto] = useState(null);
  const [posmStatus, setPosmStatus] = useState(null);

  useEffect(() => {
    requestPermissions();
    getLocation();
  }, []);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraStatus !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is required to take photos');
    }
  };

  const getLocation = async () => {
    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
      
      if (visit.latitude && visit.longitude) {
        const dist = calculateDistance(
          location.latitude,
          location.longitude,
          parseFloat(visit.latitude),
          parseFloat(visit.longitude)
        );
        setDistance(dist);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get current location');
    }
  };

  const handleCheckIn = async () => {
    if (!currentLocation) {
      Alert.alert('Error', 'Location not available. Please try again.');
      return;
    }

    // Check if within 100m radius
    if (distance && distance > 100) {
      Alert.alert(
        'Too Far',
        `You are ${formatDistance(distance)} away from the outlet. You need to be within 100m to check in.`,
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);
    try {
      const response = await visitActionAPI.checkin({
        visit_id: visit.id,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });

      if (response.data.success) {
        setActionId(response.data.data.id);
        setCheckedIn(true);
        Alert.alert('Success', 'Checked in successfully!');
      }
    } catch (error) {
      console.error('Check-in error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to check in');
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async (type) => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const photoUri = result.assets[0].uri;
        
        if (type === PHOTO_TYPES.BEFORE) {
          setBeforePhoto(photoUri);
        } else {
          setAfterPhoto(photoUri);
        }

        // Upload photo
        await uploadPhoto(photoUri, type);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const uploadPhoto = async (uri, type) => {
    if (!actionId) {
      Alert.alert('Error', 'Please check in first');
      return;
    }

    setLoading(true);
    try {
      const response = await visitActionAPI.uploadPhoto(uri, type, actionId);
      
      if (response.data.success) {
        Alert.alert('Success', `${type} photo uploaded successfully!`);
      }
    } catch (error) {
      console.error('Upload photo error:', error);
      Alert.alert('Error', 'Failed to upload photo');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    if (!actionId) {
      Alert.alert('Error', 'Please check in first');
      return;
    }

    setLoading(true);
    try {
      const response = await visitActionAPI.updateStatus({
        action_id: actionId,
        posm_status: status,
      });

      if (response.data.success) {
        setPosmStatus(status);
        Alert.alert('Success', 'POSM status updated!');
      }
    } catch (error) {
      console.error('Update status error:', error);
      Alert.alert('Error', 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!checkedIn) {
      Alert.alert('Error', 'Please check in first');
      return;
    }

    if (!beforePhoto || !afterPhoto) {
      Alert.alert('Error', 'Please take both before and after photos');
      return;
    }

    if (!posmStatus) {
      Alert.alert('Error', 'Please update POSM status');
      return;
    }

    Alert.alert(
      'Check Out',
      'Are you sure you want to check out? This will complete the visit.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Check Out',
          onPress: async () => {
            setLoading(true);
            try {
              const response = await visitActionAPI.checkout({
                action_id: actionId,
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              });

              if (response.data.success) {
                Alert.alert('Success', 'Visit completed successfully!', [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ]);
              }
            } catch (error) {
              console.error('Check-out error:', error);
              Alert.alert('Error', 'Failed to check out');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Visit Action</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.outletCard}>
          <Text style={styles.outletName}>{visit.nama_outlet}</Text>
          <Text style={styles.outletDetail}>📍 {visit.alamat}</Text>
          <Text style={styles.outletDetail}>🏢 {visit.warehouse}</Text>
          <Text style={styles.outletDetail}>📦 {visit.amo}</Text>
          {distance !== null && (
            <Text style={[
              styles.distanceText,
              { color: distance <= 100 ? COLORS.success : COLORS.error }
            ]}>
              📏 Distance: {formatDistance(distance)}
              {distance <= 100 ? ' ✓' : ' (Too far)'}
            </Text>
          )}
        </View>

        {!checkedIn ? (
          <TouchableOpacity
            style={[styles.button, styles.checkInButton]}
            onPress={handleCheckIn}
            disabled={loading || !currentLocation}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>📍 Check In</Text>
            )}
          </TouchableOpacity>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📸 Documentation Photos</Text>
              
              <View style={styles.photoRow}>
                <View style={styles.photoContainer}>
                  <Text style={styles.photoLabel}>Before</Text>
                  {beforePhoto ? (
                    <Image source={{ uri: beforePhoto }} style={styles.photo} />
                  ) : (
                    <TouchableOpacity
                      style={styles.photoPlaceholder}
                      onPress={() => takePhoto(PHOTO_TYPES.BEFORE)}
                      disabled={loading}
                    >
                      <Text style={styles.photoPlaceholderText}>📷 Take Photo</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.photoContainer}>
                  <Text style={styles.photoLabel}>After</Text>
                  {afterPhoto ? (
                    <Image source={{ uri: afterPhoto }} style={styles.photo} />
                  ) : (
                    <TouchableOpacity
                      style={styles.photoPlaceholder}
                      onPress={() => takePhoto(PHOTO_TYPES.AFTER)}
                      disabled={loading || !beforePhoto}
                    >
                      <Text style={styles.photoPlaceholderText}>📷 Take Photo</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📋 POSM Status</Text>
              
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  posmStatus === POSM_STATUS.INSTALLED && styles.statusButtonActive
                ]}
                onPress={() => handleUpdateStatus(POSM_STATUS.INSTALLED)}
                disabled={loading}
              >
                <Text style={[
                  styles.statusButtonText,
                  posmStatus === POSM_STATUS.INSTALLED && styles.statusButtonTextActive
                ]}>
                  ✓ Terpasang
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusButton,
                  posmStatus === POSM_STATUS.OUTLET_NOT_FOUND && styles.statusButtonActive
                ]}
                onPress={() => handleUpdateStatus(POSM_STATUS.OUTLET_NOT_FOUND)}
                disabled={loading}
              >
                <Text style={[
                  styles.statusButtonText,
                  posmStatus === POSM_STATUS.OUTLET_NOT_FOUND && styles.statusButtonTextActive
                ]}>
                  ✗ Outlet Tidak Ada
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusButton,
                  posmStatus === POSM_STATUS.STORE_CLOSED && styles.statusButtonActive
                ]}
                onPress={() => handleUpdateStatus(POSM_STATUS.STORE_CLOSED)}
                disabled={loading}
              >
                <Text style={[
                  styles.statusButtonText,
                  posmStatus === POSM_STATUS.STORE_CLOSED && styles.statusButtonTextActive
                ]}>
                  🔒 Toko Tutup
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                styles.checkOutButton,
                (!beforePhoto || !afterPhoto || !posmStatus) && styles.buttonDisabled
              ]}
              onPress={handleCheckOut}
              disabled={loading || !beforePhoto || !afterPhoto || !posmStatus}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>✓ Check Out & Complete</Text>
              )}
            </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  outletCard: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  outletName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  outletDetail: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 5,
  },
  distanceText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  button: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  checkInButton: {
    backgroundColor: COLORS.primary,
  },
  checkOutButton: {
    backgroundColor: COLORS.success,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  photoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  photoContainer: {
    width: '48%',
  },
  photoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  photo: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: COLORS.border,
  },
  photoPlaceholder: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  statusButton: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  statusButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  statusButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  statusButtonTextActive: {
    color: COLORS.white,
  },
});
