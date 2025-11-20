import { CommunityProvider } from '@/context/CommunityContext';
import { Stack } from 'expo-router';
import { PostProvider } from '../context/PostContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { AuthProvider } from './AuthContext'; // adjust the path if needed

function RootNavigator() {
  const { theme } = useTheme();
  
  return (
    <AuthProvider>
      <CommunityProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.background[0],
            },
            headerTintColor: theme.colors.text,
            headerTitleStyle: {
              fontWeight: '700',
              fontSize: 18,
            },
            headerShadowVisible: false,
            headerBackTitleVisible: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="create-account" options={{ headerShown: false }} />
          <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
          <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
          <Stack.Screen name="RVD" options={{ title: 'Community', headerShown: true }} />
          <Stack.Screen name="post-details" options={{ title: 'Post', headerShown: true }} />
          <Stack.Screen name="CommunityPage" options={{ title: 'Community', headerShown: true }} />
        </Stack>
      </CommunityProvider>
    </AuthProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <PostProvider>
        <RootNavigator />
      </PostProvider>
    </ThemeProvider>
  );
}