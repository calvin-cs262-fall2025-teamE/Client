import { Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

// Note: You asked for Tailwind styling. This project doesn't include a Tailwind-for-RN library
// by default (e.g. nativewind). I kept styles as plain React Native styles so this works
// immediately. If you'd like, I can convert these to Tailwind classes and add nativewind setup.

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 49 + (Platform.OS === 'ios' ? insets.bottom : 0),
            paddingBottom: Platform.OS === 'ios' ? insets.bottom : 0,
          },
          // Hide on large screens (optional) — keeps visible on mobile
          Platform.OS === 'web' ? { display: 'none' } : {},
        ],
        tabBarIcon: ({ focused, color, size }) => {
          const routeName = route.name;
          const iconColor = focused ? '#2563EB' : '#737373'; // blue when active, gray when inactive
          const iconSize = 24; // consistent size across all icons

          if (routeName === 'index') {
            return <Feather name="home" size={iconSize} color={iconColor} />;
          }

          if (routeName === 'search') {
            return <Feather name="search" size={iconSize} color={iconColor} />;
          }

          if (routeName === 'post') {
            // keep plus icon consistent with others
            return <Feather name="plus-square" size={iconSize} color={iconColor} />;
          }

          if (routeName === 'profile') {
            return <Feather name="user" size={iconSize} color={iconColor} />;
          }

          return null;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="search" options={{ title: 'Search' }} />
      <Tabs.Screen name="post" options={{ title: 'Post' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,
  },
});