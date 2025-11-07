import { CommunityProvider } from '@/context/CommunityContext';
import { PostProvider } from '@/context/PostContext';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <CommunityProvider>
      <Tabs>
        {/* Here we use seperate post providers because each screen might keep track of a different post */}
        <PostProvider>
          <Tabs.Screen name="index" options={{ title: 'Home' }} />
        </PostProvider>

        <PostProvider>
          <Tabs.Screen name="search" options={{ title: 'Search' }} />
        </PostProvider>

        {/* Posts doesn't get a post provider because you don't need to zoom in on any post details from here */}
        <Tabs.Screen name="post" options={{ title: 'Post' }} /> 

        <PostProvider>
          <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
        </PostProvider>
      </Tabs>
    </CommunityProvider>
  );
}