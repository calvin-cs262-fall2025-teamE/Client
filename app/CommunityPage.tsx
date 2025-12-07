import PostCard from "@/components/PostCard";
import { useCommunityContext } from "@/context/CommunityContext";
import { usePostContext } from "@/context/PostContext";
import { useTheme } from "@/context/ThemeContext";
import { Community, defaultCommunity } from "@/types/Community";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Dimensions,
    FlatList,
    Platform,
    SafeAreaView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const windowWidth = Dimensions.get("window").width;

// Placeholder avatars and images
const AVATARS = [
  require("../assets/images/react-logo.png"),
  require("../assets/images/partial-react-logo.png"),
  require("../assets/images/android-icon-foreground.png"),
  require("../assets/images/android-icon-background.png"),
  require("../assets/images/icon.png"),
  require("../assets/images/splash-icon.png"),
];

const USERS = [
  { name: "Alice", handle: "@alice", avatar: AVATARS[0] },
  { name: "Bob", handle: "@bob", avatar: AVATARS[1] },
  { name: "Charlie", handle: "@charlie", avatar: AVATARS[2] },
  { name: "Diana", handle: "@diana", avatar: AVATARS[3] },
  { name: "Eve", handle: "@eve", avatar: AVATARS[4] },
  { name: "Frank", handle: "@frank", avatar: AVATARS[5] },
];

export default function RVD() {
  // Steps to find the current context:
  const { id } = useLocalSearchParams();
  const { communities } = useCommunityContext();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedCommunity: Community = communities.find(comm => comm.communityID.toString() === id) || defaultCommunity;
  const { posts } = usePostContext();

  const thesePosts = posts.filter((post) => post.communityId.toString() === id)

  const { theme } = useTheme();
  
  // Simulated current user ID - replace with actual auth context when available
  const currentUserId = 1;

  const handleCommunitySelect = (communityId: number) => {
    router.push({
      pathname: '/CommunityPage',
      params: { id: communityId }
    });
    setDropdownOpen(false);
  };

  const handleLike = (postId: number) => {
    console.log('Like clicked for post:', postId);
    Alert.alert('Like Button', `Clicked like for post ${postId}`);
    // toggleLike(postId, currentUserId);
  };

  const handleRetweet = (postId: number) => {
    console.log('Retweet clicked for post:', postId);
    Alert.alert('Retweet Button', `Clicked retweet for post ${postId}`);
    // toggleRetweet(postId, currentUserId);
  };

  const handleShare = async (postId: number, postTitle: string) => {
    console.log('Share clicked for post:', postId);
    try {
      await Share.share({
        message: `Check out this post: ${postTitle}`,
        title: postTitle,
      });
      // sharePost(postId);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: 'transparent' }]}> 
      <LinearGradient
        colors={theme.colors.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      >
        {/* Top Navigation Bar */}
        <View style={[styles.headerRow, { borderBottomColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setDropdownOpen(!dropdownOpen)}
          >
            <Ionicons name="menu" size={26} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{selectedCommunity.communityName}</Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>{selectedCommunity.description}</Text>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="sparkles" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Community Dropdown Menu */}
        {dropdownOpen && (
          <View style={[styles.dropdownMenu, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            {communities.map((community) => (
              <TouchableOpacity
                key={community.communityID}
                onPress={() => handleCommunitySelect(community.communityID)}
                style={[
                  styles.dropdownItem,
                  { 
                    backgroundColor: selectedCommunity.communityID === community.communityID 
                      ? `${theme.colors.primary}20` 
                      : 'transparent',
                    borderBottomColor: theme.colors.border
                  }
                ]}
              >
                <Ionicons 
                  name="people" 
                  size={20} 
                  color={selectedCommunity.communityID === community.communityID 
                    ? theme.colors.primary 
                    : theme.colors.textSecondary
                  } 
                  style={{ marginRight: 12 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[
                    styles.dropdownItemName,
                    { 
                      color: theme.colors.text,
                      fontWeight: selectedCommunity.communityID === community.communityID ? '700' : '500'
                    }
                  ]}>
                    {community.communityName}
                  </Text>
                  <Text style={[styles.dropdownItemDesc, { color: theme.colors.textSecondary }]}>
                    {community.description}
                  </Text>
                </View>
                {selectedCommunity.communityID === community.communityID && (
                  <Ionicons name="checkmark-circle" size={22} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Feed */}
        {/* <FlatList
          data={POSTS}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 90 }}
          renderItem={({ item }) => (
            <View style={[styles.postCard, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
              <Image source={item.user.avatar} style={[styles.postAvatar, { backgroundColor: theme.colors.chip }]} />
              <View style={{ flex: 1 }}>
                <View style={styles.postHeader}>
                  <Text style={[styles.postName, { color: theme.colors.text }]}>{item.user.name}</Text>
                  <Text style={[styles.postHandle, { color: theme.colors.textSecondary }]}>{item.user.handle} · {item.time}</Text>
                </View>
                <Text style={[styles.postText, { color: theme.colors.text }]}>{item.text}</Text>
                {item.image && (
                  <Image source={item.image} style={[styles.postImage, { backgroundColor: theme.colors.chip }]} resizeMode="cover" />
                )}
                <View style={styles.postActions}>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Ionicons name="chatbubble-outline" size={20} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Ionicons name="repeat-outline" size={20} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Ionicons name="heart-outline" size={20} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Ionicons name="share-outline" size={20} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        /> */}

        {/* Feed */}
        <FlatList
          data={thesePosts}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 140 }}
          renderItem={({ item }) => (
            <PostCard post={item} currentUserId={currentUserId} />
          )}
        />

        {/* Floating Compose Button */}
        <TouchableOpacity 
        style={[styles.fab, { backgroundColor: theme.colors.primary }]} 
        activeOpacity={0.8}
        onPress={() => router.push({
                pathname: "./(tabs)/post",
                params: {id: selectedCommunity.communityID},})}>
          <Ionicons name="create" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Bottom Navigation Bar */}
        <View style={[styles.bottomNav, { backgroundColor: 'transparent', borderTopColor: theme.colors.border }]}>
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => router.push('/(tabs)/index')}
          >
            <Ionicons name="compass-outline" size={28} color={theme.colors.textSecondary} />
            <Text style={[styles.navLabel, { color: theme.colors.textSecondary }]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => router.push('/(tabs)/search')}
          >
            <Ionicons name="search-outline" size={28} color={theme.colors.textSecondary} />
            <Text style={[styles.navLabel, { color: theme.colors.textSecondary }]}>Search</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => router.push('/(tabs)/post')}
          >
            <Ionicons name="add-circle-outline" size={28} color={theme.colors.textSecondary} />
            <Text style={[styles.navLabel, { color: theme.colors.textSecondary }]}>Post</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Ionicons name="person-outline" size={28} color={theme.colors.textSecondary} />
            <Text style={[styles.navLabel, { color: theme.colors.textSecondary }]}>Profile</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 32 : 0,
    backgroundColor: 'transparent',
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconButton: {
    padding: 4,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 12,
  },
  dropdownMenu: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    maxHeight: 400,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dropdownItemName: {
    fontSize: 16,
    marginBottom: 2,
  },
  dropdownItemDesc: {
    fontSize: 12,
  },
  communityScroll: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  communityScrollContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  communityNavItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  communityNavText: {
    fontSize: 14,
    fontWeight: '600',
  },
  storiesScroll: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 10,
  },
  storiesContainer: {
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 8,
  },
  storyAvatarWrapper: {
    alignItems: 'center',
    marginRight: 16,
    width: 60,
  },
  storyAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    marginBottom: 4,
  },
  addAvatar: {
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyName: {
    fontSize: 12,
    textAlign: 'center',
    width: 60,
  },
  postCard: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  postAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    marginTop: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  postName: {
    fontWeight: '700',
    fontSize: 15,
    marginRight: 6,
  },
  postHandle: {
    fontSize: 13,
  },
  postText: {
    fontSize: 15,
    marginBottom: 6,
    marginTop: 2,
    lineHeight: 20,
  },
  postImage: {
    width: windowWidth - 90,
    height: 180,
    borderRadius: 14,
    marginVertical: 6,
  },
  postActions: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 2,
    gap: 24,
  },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 40,
  },
  actionCount: {
    fontSize: 13,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    right: 22,
    bottom: 100,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    height: 85,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: 'transparent',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});