import { Redirect } from 'expo-router';
import { useAuth } from './AuthContext';

export default function Index() {
  const { isAuthenticated } = useAuth();
  // If not logged in, go to /login; otherwise go to your tabs
  return isAuthenticated ? (
    <Redirect href='/(tabs)/profile' />
  ) : (
    <Redirect href='/login' />
  );
}