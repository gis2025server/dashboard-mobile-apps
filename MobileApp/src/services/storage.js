import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const KEYS = {
  TOKEN: 'token',
  USER: 'user',
  VISITS: 'visits',
  OFFLINE_ACTIONS: 'offline_actions',
};

// Save token
export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem(KEYS.TOKEN, token);
    return true;
  } catch (error) {
    console.error('Error saving token:', error);
    return false;
  }
};

// Get token
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(KEYS.TOKEN);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Remove token
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(KEYS.TOKEN);
    return true;
  } catch (error) {
    console.error('Error removing token:', error);
    return false;
  }
};

// Save user data
export const saveUser = async (user) => {
  try {
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
    return true;
  } catch (error) {
    console.error('Error saving user:', error);
    return false;
  }
};

// Get user data
export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem(KEYS.USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// Remove user data
export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem(KEYS.USER);
    return true;
  } catch (error) {
    console.error('Error removing user:', error);
    return false;
  }
};

// Save visits for offline access
export const saveVisits = async (visits) => {
  try {
    await AsyncStorage.setItem(KEYS.VISITS, JSON.stringify(visits));
    return true;
  } catch (error) {
    console.error('Error saving visits:', error);
    return false;
  }
};

// Get saved visits
export const getVisits = async () => {
  try {
    const visits = await AsyncStorage.getItem(KEYS.VISITS);
    return visits ? JSON.parse(visits) : [];
  } catch (error) {
    console.error('Error getting visits:', error);
    return [];
  }
};

// Save offline action
export const saveOfflineAction = async (action) => {
  try {
    const actions = await getOfflineActions();
    actions.push({ ...action, timestamp: Date.now() });
    await AsyncStorage.setItem(KEYS.OFFLINE_ACTIONS, JSON.stringify(actions));
    return true;
  } catch (error) {
    console.error('Error saving offline action:', error);
    return false;
  }
};

// Get offline actions
export const getOfflineActions = async () => {
  try {
    const actions = await AsyncStorage.getItem(KEYS.OFFLINE_ACTIONS);
    return actions ? JSON.parse(actions) : [];
  } catch (error) {
    console.error('Error getting offline actions:', error);
    return [];
  }
};

// Clear offline actions
export const clearOfflineActions = async () => {
  try {
    await AsyncStorage.removeItem(KEYS.OFFLINE_ACTIONS);
    return true;
  } catch (error) {
    console.error('Error clearing offline actions:', error);
    return false;
  }
};

// Clear all data
export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
};

export default {
  saveToken,
  getToken,
  removeToken,
  saveUser,
  getUser,
  removeUser,
  saveVisits,
  getVisits,
  saveOfflineAction,
  getOfflineActions,
  clearOfflineActions,
  clearAll,
};
