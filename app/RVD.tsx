import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Dimensions
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
    text: "When are the RVD Bible studies this year?",
    image: null,
  },
  {
    id: "2",
    user: USERS[1],
    time: "5m",
    text: "Can I use the kitchens on other floors?",
    image: require("../assets/images/android-icon-background.png"),
  },
  {
    id: "3",
    user: USERS[2],
    time: "10m",
    text: "Is there a piano in the building?",
    image: require("../assets/images/android-icon-foreground.png"),
  },
  {
    id: "4",
    user: USERS[3],
    time: "15m",
    text: "Why was there a tornado siren last Friday?",
    image: require("../assets/images/splash-icon.png"),
  },
  {
    id: "5",
    user: USERS[4],
    time: "20m",
    text: "Which floor had the best halloween decoration last year?",
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

// I hope to embody the following philosophy with the layout:
// This is help forum, not social media
// Therefore, we don't want features that highlight individual people
// so NO profile personal feed and features like reposting
// However, we can use a more social-media astetic at times, for appeal
// - Caleb
export default function RVD() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Navigation Bar */}
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>Sort Unanswered</Text>
          <TouchableOpacity>
            <Icon name="menu" size={26} color="#222" />
          </TouchableOpacity>
        <View style={{ flex: 1 }} />
          <Text style={styles.headerText}>Recent Questions</Text>
          
        </View>

        {/* Horizontal Avatars
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
        </ScrollView> */}

        {/* Posts List */}
        <FlatList
          data={POSTS}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 90 }}
          renderItem={({ item }) => (
            <View style={styles.postCard}>
              <Image source={item.user.avatar} style={styles.postAvatar} />
              <View style={{ flex: 1 }}>
                <View style={styles.postHeader}>
                  <Text style={styles.postName}>{item.user.name}</Text>
                  <Text style={styles.postHandle}>{item.user.handle} · {item.time}</Text>
                </View>
                <Text style={styles.postText}>{item.text}</Text>
                {item.image && (
                  <Image source={item.image} style={styles.postImage} resizeMode="cover" />
                )}
                <View style={styles.postActions}>
                  <TouchableOpacity style={styles.actionBtn}><Icon name="reply" size={20} color="#555" /></TouchableOpacity>
                  <Text>5</Text>
                  <TouchableOpacity style={styles.actionBtn}><Icon name="like" size={20} color="#e0245e" /></TouchableOpacity>                
                  <Text>8</Text>
                </View>
              </View>
            </View>
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
  headerText: {
    fontSize: 18,
    color: '#222',
    marginBottom: 4,
    marginTop: 2,
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