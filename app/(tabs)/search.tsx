import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Community {
  id: string;
  name: string;
  members: number;
}

export default function SearchScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [communities, setCommunities] = useState<Community[]>([]);

  // Always-search function
  const handleSearch = (text: string) => {
    const q = text.toLowerCase();

    const foundCommunities = [
      { id: '0', name: 'RVD', members: 999 },
      { id: '1', name: 'Gaming Community', members: 1200 },
      { id: '2', name: 'Book Club', members: 500 },
      { id: '3', name: 'Tech Hub', members: 2500 },
    ].filter((c) => c.name.toLowerCase().includes(q));

    setCommunities(foundCommunities);
    return foundCommunities;
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
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Discover communities
            </Text>
          </View>

          {/* Search Bar */}
          <View
            style={[
              styles.searchContainer,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
            ]}
          >
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Search communities..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              autoCapitalize="none"
              returnKeyType="search"
              onChangeText={(text) => {
                setSearchQuery(text);
                handleSearch(text);
              }}
            />

            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: theme.colors.primary }]}
              activeOpacity={0.8}
              onPress={() => {
                if (!searchQuery.trim()) {
                  alert('Please enter a search term.');
                  return;
                }

                const results = handleSearch(searchQuery);

                if (results.length === 0) {
                  alert('No matching community found.');
                  return;
                }

                const first = results[0].name.toLowerCase();

                if (first === 'rvd') {
                  router.push('/RVD');
                  return;
                }

                router.push(`/CommunityPage?id=${results[0].id}`);
              }}
            >
              <Ionicons name="search" size={22} color="white" />
            </TouchableOpacity>
          </View>

          {/* Results */}
          <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
            {communities.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  Communities
                </Text>

                {communities.map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    style={[
                      styles.communityItem,
                      { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                    ]}
                    onPress={() => {
                      if (c.name.toLowerCase() === 'rvd') {
                        router.push('/RVD');
                      } else {
                        router.push(`/CommunityPage?id=${c.id}`);
                      }
                    }}
                  >
                    <View style={styles.communityContent}>
                      <Ionicons name="people" size={20} color={theme.colors.primary} />
                      <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text style={[styles.communityName, { color: theme.colors.text }]}>
                          {c.name}
                        </Text>
                        <Text
                          style={[styles.memberCount, { color: theme.colors.textSecondary }]}
                        >
                          {c.members}
                          {' '}
                          members
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={theme.colors.textSecondary}
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  content: { flex: 1, padding: 20 },
  hero: { marginBottom: 16, gap: 6, width: '100%' },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 15 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16,
  },
  iconButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsContainer: { flex: 1 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  communityItem: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
    overflow: 'hidden',
  },
  communityContent: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  communityName: { fontSize: 16, fontWeight: '600' },
  memberCount: { fontSize: 14 },
});
