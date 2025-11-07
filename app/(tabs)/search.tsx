import { Text, View, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ADD8E6', // match profile screen
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  resultsContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#003366',
  },
  resultItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003366',
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#374151',
  },
});

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [communities, setCommunities] = useState<Community[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setCommunities([]);
      setPosts([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    const foundCommunities = [
      { id: '1', name: 'Gaming Community', members: 1200 },
      { id: '2', name: 'Book Club', members: 500 },
      { id: '3', name: 'Tech Hub', members: 2500 }
    ].filter(community =>
      community.name.toLowerCase().includes(query)
    );
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
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search communities, posts, or tags..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Communities</Text>
          {communities.length === 0 ? (
            <Text style={styles.resultSubtitle}>No communities found.</Text>
          ) : (
            communities.map((community) => (
              <View key={community.id} style={styles.resultItem}>
                <Text style={styles.resultTitle}>{community.name}</Text>
                <Text style={styles.resultSubtitle}>{community.members} members</Text>
              </View>
            ))
          )}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Posts</Text>
          {posts.length === 0 ? (
            <Text style={styles.resultSubtitle}>No posts found.</Text>
          ) : (
            posts.map((post) => (
              <View key={post.id} style={styles.resultItem}>
                <Text style={styles.resultTitle}>{post.title}</Text>
                <Text style={styles.resultSubtitle}>{post.community} • {post.tag}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}