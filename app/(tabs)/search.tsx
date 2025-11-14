import { Text, View, StyleSheet, TextInput, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

interface Community {
  id: string;
  name: string;
  members: number;
}

interface Post {
  id: string;
  title: string;
  community: string;
  tag: string;
}

export default function SearchScreen() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [communities, setCommunities] = useState<Community[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setCommunities([]);
      setPosts([]);
      return;
    }

    // Mock search results - in a real app, this would be an API call
    const query = searchQuery.toLowerCase();
    
    // Search for communities
    const foundCommunities = [
      { id: '1', name: 'Gaming Community', members: 1200 },
      { id: '2', name: 'Book Club', members: 500 },
      { id: '3', name: 'Tech Hub', members: 2500 }
    ].filter(community => 
      community.name.toLowerCase().includes(query)
    );

    // Search for posts
    const foundPosts = [
      { id: '1', title: 'Latest Gaming News', community: 'Gaming Community', tag: 'news' },
      { id: '2', title: 'Book of the Month', community: 'Book Club', tag: 'discussion' },
      { id: '3', title: 'Tech Trends 2025', community: 'Tech Hub', tag: 'technology' }
    ].filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.tag.toLowerCase().includes(query) ||
      post.community.toLowerCase().includes(query)
    );

    setCommunities(foundCommunities);
    setPosts(foundPosts);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={theme.colors.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      >
        <View style={styles.content}>
          <View style={styles.hero}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Search</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Discover communities and posts</Text>
          </View>

          <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Search communities, posts, or tags..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                setTimeout(() => {
                  handleSearch();
                }, 0);
              }}
              returnKeyType="search"
              autoCapitalize="none"
            />
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="search" size={22} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
            {communities.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Communities</Text>
                {communities.map(community => (
                  <TouchableOpacity key={community.id} style={[styles.communityItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <View style={styles.communityContent}>
                      <Ionicons name="people" size={20} color={theme.colors.primary} />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[styles.communityName, { color: theme.colors.text }]}>{community.name}</Text>
                        <Text style={[styles.memberCount, { color: theme.colors.textSecondary }]}>{community.members} members</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {posts.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Posts</Text>
                {posts.map(post => (
                  <TouchableOpacity key={post.id} style={[styles.postItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Text style={[styles.postTitle, { color: theme.colors.text }]}>{post.title}</Text>
                    <View style={styles.postMeta}>
                      <View style={[styles.metaBadge, { backgroundColor: theme.colors.chip }]}>
                        <Text style={[styles.communityTag, { color: theme.colors.textSecondary }]}>{post.community}</Text>
                      </View>
                      <Text style={[styles.tag, { color: theme.colors.primary }]}>#{post.tag}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {searchQuery && communities.length === 0 && posts.length === 0 && (
              <View style={styles.noResultsContainer}>
                <Ionicons name="search-outline" size={48} color={theme.colors.textSecondary} />
                <Text style={[styles.noResults, { color: theme.colors.textSecondary }]}>No results found</Text>
                <Text style={[styles.noResultsHint, { color: theme.colors.textSecondary }]}>Try a different search term</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  hero: {
    width: "100%",
    gap: 6,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    width: "100%",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: StyleSheet.hairlineWidth,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  iconButton: {
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  resultsContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    marginLeft: 4,
  },
  communityItem: {
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  communityContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  communityName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  memberCount: {
    fontSize: 14,
  },
  postItem: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  postMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  communityTag: {
    fontSize: 13,
  },
  tag: {
    fontSize: 13,
    fontWeight: "600",
  },
  noResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  noResults: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  noResultsHint: {
    textAlign: "center",
    fontSize: 14,
  },
});