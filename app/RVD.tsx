import PostCard from "@/components/PostCard";
import { usePostContext } from "@/context/PostContext";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
    Dimensions,
    FlatList,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
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

const POSTS = [
  {
    id: "1",
    user: USERS[0],
    time: "2m",
    text: "Just started a new React Native project! 🚀",
    image: null,
  },
  {
    id: "2",
    user: USERS[1],
    time: "5m",
    text: "Check out this beautiful sunset!",
    image: require("../assets/images/android-icon-background.png"),
  },
  {
    id: "3",
    user: USERS[2],
    time: "10m",
    text: "Dogs make everything better 🐶",
    image: require("../assets/images/android-icon-foreground.png"),
  },
  {
    id: "4",
    user: USERS[3],
    time: "15m",
    text: "Nature walks are the best therapy.",
    image: require("../assets/images/splash-icon.png"),
  },
  {
    id: "5",
    user: USERS[4],
    time: "20m",
    text: "Working on a cool new app idea!",
    image: null,
  },
];

export default function RVD() {
  const { theme } = useTheme();
  const { posts, toggleLike } = usePostContext();
  const router = useRouter();
  
  // Filter posts for RVD community (communityId: 0) or show all if you prefer
  const rvdPosts = posts; // Shows all posts - change to posts.filter(p => p.communityId === 0) if you want RVD-specific only
  
  // Simulated current user ID - replace with actual auth context when available
  const currentUserId = 1;


  
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
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="menu" size={26} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>RVD</Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>Rodenhouse–Van Dellen</Text>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="sparkles" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Horizontal Avatars */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={[styles.storiesScroll, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]} 
          contentContainerStyle={styles.storiesContainer}
        >
          <View style={styles.storyAvatarWrapper}>
            <View style={[styles.storyAvatar, styles.addAvatar, { borderColor: theme.colors.primary, backgroundColor: theme.colors.chip }]}>
              <Ionicons name="add" size={28} color={theme.colors.primary} />
            </View>
            <Text style={[styles.storyName, { color: theme.colors.textSecondary }]}>Add</Text>
          </View>
          {USERS.map((user) => (
            <View style={styles.storyAvatarWrapper} key={user.handle}>
              <Image source={user.avatar} style={[styles.storyAvatar, { borderColor: theme.colors.primary, backgroundColor: theme.colors.chip }]} />
              <Text style={[styles.storyName, { color: theme.colors.textSecondary }]}>{user.name.split(" ")[0]}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Feed */}
        <FlatList
          data={rvdPosts}
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
            params: { id: 0 }
          })}
        >
          <Ionicons name="create" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Bottom Navigation Bar */}
        <View style={[styles.bottomNav, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => router.navigate('/(tabs)')}
          >
              <Ionicons name="home-outline" size={28} color={theme.colors.textSecondary} />
            <Text style={[styles.navLabel, { color: theme.colors.textSecondary }]}>Home</Text>
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
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  iconButton: {
    padding: 8,
    borderRadius: 12,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    opacity: 0.8,
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
    right: 24,
    bottom: 100,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
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
    height: 72,
    paddingBottom: 8,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});