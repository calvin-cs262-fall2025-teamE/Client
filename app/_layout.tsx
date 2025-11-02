import { Stack } from 'expo-router';
import { AuthProvider } from './AuthContext'; // adjust the path if needed

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack />
    </AuthProvider>
  );
}