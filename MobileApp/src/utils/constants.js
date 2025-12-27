// API Configuration
import { getApiUrl } from '../config/environment';

const API_URL = getApiUrl();

export default API_URL;

// App Constants
export const COLORS = {
  primary: '#1976d2',
  secondary: '#2e7d32',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  background: '#f5f5f5',
  white: '#ffffff',
  text: '#333333',
  textLight: '#666666',
  border: '#dddddd',
};

export const VISIT_TYPES = {
  MD: 'md',
  SALES: 'sales',
};

export const POSM_STATUS = {
  INSTALLED: 'terpasang',
  OUTLET_NOT_FOUND: 'outlet tidak ada',
  STORE_CLOSED: 'toko tutup',
};

export const PHOTO_TYPES = {
  BEFORE: 'before',
  AFTER: 'after',
};
