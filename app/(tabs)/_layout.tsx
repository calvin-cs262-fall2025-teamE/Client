import { CommunityProvider } from '@/context/CommunityContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';


export default function TabLayout() {
  const { theme } = useTheme();
  
  return (
    <CommunityProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarStyle: {
            backgroundColor: theme.colors.background[0],
            borderTopColor: theme.colors.border,
            borderTopWidth: 1,
            height: 85,
            paddingBottom: 25,
            paddingTop: 10,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
          headerStyle: {
            backgroundColor: theme.colors.background[0],
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
          },
          headerShadowVisible: false,
        }}
      >
        {/* Here we used to use seperate post providers because each screen might keep track of a different post */}
        {/* However, to allow icons and order to work, this providers are put into the pages themselves */}
        <Tabs.Screen name="index" options={{ 
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'compass' : 'compass-outline'} color={color} size={28} /> 
          ), }}/>

        <Tabs.Screen name="search" options={{ 
          title: 'Search',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'search' : 'search-outline'} color={color} size={28} /> 
          ), }}/>

        <Tabs.Screen name="post" options={{ 
          title: 'Post',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} color={color} size={28} /> 
          ), }}/>

        <Tabs.Screen name="profile" options={{ 
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'person-circle' : 'person-circle-outline'} color={color} size={28} /> 
          ), }}/>
      </Tabs>
    </CommunityProvider>
  );
}