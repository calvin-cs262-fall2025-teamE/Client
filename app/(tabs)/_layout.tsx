import { CommunityProvider } from '@/context/CommunityContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';


export default function TabLayout() {
  return (
    <CommunityProvider>
      <Tabs>
        {/* Here we used to use seperate post providers because each screen might keep track of a different post */}
        {/* However, to allow icons and order to work, this providers are put into the pages themselves */}
        <Tabs.Screen name="index" options={{ 
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'compass' : 'compass-outline'} color={color} size={24} /> 
          ), }}/>

        <Tabs.Screen name="search" options={{ 
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'search-circle' : 'search-circle-outline'} color={color} size={24} /> 
          ), }}/>

        <Tabs.Screen name="post" options={{ 
          title: 'Post',
          tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'add-circle' : 'add'} color={color} size={24} /> 
          ), }}/>

        <Tabs.Screen name="profile" options={{ 
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'library' : 'library-outline'} color={color} size={24} /> 
          ), }}/>
      </Tabs>
    </CommunityProvider>
  );
}