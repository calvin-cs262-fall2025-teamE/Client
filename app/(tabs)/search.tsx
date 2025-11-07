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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff',
    },
    searchInput: {
      height: 44,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      paddingHorizontal: 16,
      marginBottom: 16,
      fontSize: 16,
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
      color: '#333',
    },
    communityItem: {
      padding: 12,
      backgroundColor: '#f8f8f8',
      borderRadius: 8,
      marginBottom: 8,
    },
    communityName: {
      fontSize: 16,
      fontWeight: '500',
      color: '#333',
      marginBottom: 4,
    },
    memberCount: {
      fontSize: 14,
      color: '#666',
    },
    postItem: {
      padding: 12,
      backgroundColor: '#f8f8f8',
      borderRadius: 8,
      marginBottom: 8,
    },
    postTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: '#333',
      marginBottom: 8,
    },
    postMeta: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    communityTag: {
      fontSize: 14,
      color: '#666',
      marginRight: 8,
    },
    tag: {
      fontSize: 14,
      color: '#007AFF',
    },
    noResults: {
      textAlign: 'center',
      color: '#666',
      marginTop: 24,
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search communities, posts, or tags..."
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          // Trigger search on each text change
          setTimeout(() => {
            handleSearch();
          }, 0);
        }}
        returnKeyType="search"
        autoCapitalize="none"
      />

      <ScrollView style={styles.resultsContainer}>
        {communities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Communities</Text>
            {communities.map(community => (
              <TouchableOpacity key={community.id} style={styles.communityItem}>
                <Text style={styles.communityName}>{community.name}</Text>
                <Text style={styles.memberCount}>{community.members} members</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {posts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Posts</Text>
            {posts.map(post => (
              <TouchableOpacity key={post.id} style={styles.postItem}>
                <Text style={styles.postTitle}>{post.title}</Text>
                <View style={styles.postMeta}>
                  <Text style={styles.communityTag}>{post.community}</Text>
                  <Text style={styles.tag}>#{post.tag}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {searchQuery && communities.length === 0 && posts.length === 0 && (
          <Text style={styles.noResults}>No results found</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tagButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  tagButtonSelected: {
    backgroundColor: '#007AFF',
  },
  tagText: {
    color: '#666',
  },
  tagTextSelected: {
    color: '#fff',
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    flex: 1,
  },
  resultItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  resultTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  resultTag: {
    color: '#007AFF',
    marginRight: 8,
  },
});