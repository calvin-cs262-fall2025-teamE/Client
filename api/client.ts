import axios from 'axios';
import { Platform } from 'react-native';

/**
 * Axios instance configured for backend API
 * 
 * ⚠️ CRITICAL: Mobile apps CANNOT use localhost
 * 
 * For Android emulator: Use 10.0.2.2
 * For iOS simulator: localhost works
 * For physical devices: Use your computer's LAN IP (192.168.x.x)
 * 
 * To find your LAN IP:
 * - Windows: ipconfig (look for IPv4 Address)
 * - Mac/Linux: ifconfig (look for inet)
 * 
 * Replace 192.168.1.100 below with your actual LAN IP
 */
const getBaseURL = () => {
  if (Platform.OS === 'android') {
    // Android emulator
    return 'http://10.0.2.2:3000';
  } else if (Platform.OS === 'ios') {
    // iOS simulator - localhost works
    // For physical iOS device, use LAN IP: 'http://192.168.1.100:3000'
    return 'http://localhost:3000';
  } else {
    // Web/other
    return 'http://localhost:3000';
  }
};

export const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000, // Increased timeout for image uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API] Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

