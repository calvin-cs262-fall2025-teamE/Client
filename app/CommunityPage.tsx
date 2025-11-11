import { useCommunityContext } from "@/context/CommunityContext";
import { usePostContext } from "@/context/PostContext";
import { Community, defaultCommunity } from "@/types/Community";
import { useLocalSearchParams, useRouter } from "expo-router";
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

type IconName = 'menu' | 'sparkle' | 'reply' | 'retweet' | 'like' | 'share' | 'add' | 'compose';
interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}
function Icon({ name, size = 22, color = "#555" }: IconProps) {
  const icons: Record<IconName, string> = {
    menu: "☰",
    sparkle: "✨",
    reply: "💬",
    retweet: "🔁",
    like: "❤️",
    share: "📤",
    add: "+",
    compose: "✏️",
  };
  return (
    <Text style={{ fontSize: size, color, marginHorizontal: 2 }}>{icons[name]}</Text>
  );
}

export default function CommunityPage() {
    const { communityId } = useLocalSearchParams();

    const { communities } = useCommunityContext();

    const selectedCommunity: Community = communities.find(item => item.communityID.toString() === communityId) || defaultCommunity;

    const { posts } = usePostContext();
    const router = useRouter();

    // We'll eventually want to use an SQL statment to retrieve just these
    const selectedPosts = posts.filter(post => post.communityId.toString() === communityId);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Navigation Bar */}
        <View style={styles.headerRow}>
          <TouchableOpacity>
            <Icon name="menu" size={26} color="#222" />
          </TouchableOpacity>
          <Image source={require("../assets/images/react-logo.png")} style={styles.logo} resizeMode="contain" />
          <View style={{ flex: 1 }} />
          <TouchableOpacity>
            <Icon name="sparkle" size={24} color="#1da1f2" />
          </TouchableOpacity>
        </View>

        {/* Horizontal Avatars */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesScroll} contentContainerStyle={styles.storiesContainer}>
          <View style={styles.storyAvatarWrapper}>
            <View style={[styles.storyAvatar, styles.addAvatar]}>
              <Icon name="add" size={28} color="#1da1f2" />
            </View>
            <Text style={styles.storyName}>Add</Text>
          </View>
          {USERS.map((user) => (
            <View style={styles.storyAvatarWrapper} key={user.handle}>
              <Image source={user.avatar} style={styles.storyAvatar} />
              <Text style={styles.storyName}>{user.name.split(" ")[0]}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Feed */}
        <FlatList
          data={selectedPosts}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 90 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
            style={styles.postCard}
            onPress={() => router.push({
                pathname: "./post-details",
                params: { id: item.id } // Here is an example of parameters
            })}
            >
              {/* <Image source={item.user.avatar} style={styles.postAvatar} /> */}
              {/* TODO: Here we need some kind of query to get the username of the person who posted this */}
              <View style={{ flex: 1 }}>
                <View style={styles.postHeader}>
                  <Text style={styles.postName}>{item.title}</Text>
                  {/* <Text style={styles.postHandle}>{item.user.handle} · {item.time}</Text> */}
                </View>
                <Text style={styles.postText}>{item.content}</Text>
                {/* {item.image && (
                  <Image source={item.image} style={styles.postImage} resizeMode="cover" />
                )} */}
                <View style={styles.postActions}>
                  {/* <TouchableOpacity style={styles.actionBtn}><Icon name="reply" size={20} color="#555" /></TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}><Icon name="retweet" size={20} color="#17bf63" /></TouchableOpacity> */}
                  <TouchableOpacity style={styles.actionBtn}><Icon name="like" size={20} color="#e0245e" /></TouchableOpacity>
                  {/* <TouchableOpacity style={styles.actionBtn}><Icon name="share" size={20} color="#1da1f2" /></TouchableOpacity> */}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Floating Compose Button */}
        <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
          <Icon name="compose" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7fafd',
    paddingTop: Platform.OS === 'android' ? 32 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#f7fafd',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e6ecf0',
    backgroundColor: '#fff',
  },
  logo: {
    width: 32,
    height: 32,
    marginLeft: 16,
    marginRight: 8,
  },
  storiesScroll: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e6ecf0',
    paddingVertical: 8,
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
    borderColor: '#1da1f2',
    marginBottom: 4,
    backgroundColor: '#e6ecf0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addAvatar: {
    borderStyle: 'dashed',
    borderColor: '#1da1f2',
    backgroundColor: '#fff',
  },
  storyName: {
    fontSize: 12,
    color: '#444',
    textAlign: 'center',
    width: 60,
  },
  postCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 2,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e6ecf0',
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
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
    marginRight: 6,
  },
  postHandle: {
    color: '#888',
    fontSize: 13,
  },
  postText: {
    fontSize: 15,
    color: '#222',
    marginBottom: 6,
    marginTop: 2,
  },
  postImage: {
    width: windowWidth - 90,
    height: 180,
    borderRadius: 14,
    marginVertical: 6,
    backgroundColor: '#e6ecf0',
  },
  postActions: {
    flexDirection: 'row',
    marginTop: 6,
    marginBottom: 2,
  },
  actionBtn: {
    marginRight: 24,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  fab: {
    position: 'absolute',
    right: 22,
    bottom: 32,
    backgroundColor: '#1da1f2',
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 5,
  },
});