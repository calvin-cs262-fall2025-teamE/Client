import { useCommunityContext } from "@/context/CommunityContext";
import { usePostContext } from "@/context/PostContext";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../AuthContext";

export default function HomeScreen() {
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { communities } = useCommunityContext();
  const { posts } = usePostContext();
  const { user, updateUser } = useAuth();
  const router = useRouter();

  // Get unique post types/tags from all posts
  const allTags = [...new Set(posts.map(p => p.type))];

  const handleLeave = (communityID: number) => {
    if (!user) {
      Alert.alert("Not signed in", "Sign in to manage your communities.");
      return;
    }

    const updatedCommunities = (user.communities || []).filter((c) => c !== communityID.toString());
    updateUser({ ...user, communities: updatedCommunities });
    Alert.alert("Left community", "You have left this community.");
  };

  const handleJoin = (communityID: number) => {
    if (!user) {
      Alert.alert("Not signed in", "Sign in to join communities.");
      return;
    }

    const updatedCommunities = [...(user.communities || []), communityID.toString()];
    updateUser({ ...user, communities: updatedCommunities });
    Alert.alert("Joined community", "You have joined this community.");
  };

  // User's joined community IDs
  const userCommunities = user?.communities || [];

  // Joined communities
  const joinedCommunities = communities.filter((c) => userCommunities.includes(c.communityID.toString()));
  
  // Communities user hasn't joined (for discovery)
  const discoverCommunities = communities.filter((c) => !userCommunities.includes(c.communityID.toString()));
  
  // When searching, filter all communities
  const filteredCommunities = query.length > 0
    ? communities.filter((item) =>
        item.communityName.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // Filter posts when searching or when a tag is selected
  const isSearching = query.length > 0 || selectedTag !== null;
  const filteredPosts = isSearching
    ? posts.filter((post) => {
        const matchesQuery = query.length === 0 || 
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.content.toLowerCase().includes(query.toLowerCase()) ||
          post.type.toLowerCase().includes(query.toLowerCase());
        const matchesTag = selectedTag === null || post.type === selectedTag;
        return matchesQuery && matchesTag;
      })
    : [];
  
  // Get community name helper
  const getCommunityName = (communityId: number) => {
    const community = communities.find(c => c.communityID === communityId);
    return community?.communityName || "Unknown Community";
  };

  // Clear filters
  const clearFilters = () => {
    setQuery("");
    setSelectedTag(null);
  };

  return (
    <LinearGradient
      colors={theme.colors.background as [string, string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.overlay}>
          <View style={styles.hero}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Communities</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              {isSearching ? "Search results" : "Find and join Calvin communities"}
            </Text>
          </View>

          <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Ionicons name="search" size={22} color={theme.colors.textSecondary} style={styles.searchIconLeft} />
            <TextInput
              style={[styles.searchBar, { color: theme.colors.text }]}
              placeholder="Search communities, posts, or tags..."
              placeholderTextColor={theme.colors.textSecondary}
              value={query}
              onChangeText={setQuery}
            />
            {(query.length > 0 || selectedTag) && (
              <TouchableOpacity onPress={clearFilters}>
                <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Tags/Filter chips */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.tagsContainer}
            contentContainerStyle={styles.tagsContent}
          >
            {allTags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tagChip,
                  { 
                    backgroundColor: selectedTag === tag ? theme.colors.primary : theme.colors.surface,
                    borderColor: selectedTag === tag ? theme.colors.primary : theme.colors.border,
                  }
                ]}
                onPress={() => setSelectedTag(selectedTag === tag ? null : tag)}
              >
                <Text style={[
                  styles.tagChipText,
                  { color: selectedTag === tag ? '#FFF' : theme.colors.text }
                ]}>
                  #{tag}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            {/* Posts Section - Show when tag is selected or searching */}
            {isSearching && (
              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>
                  {selectedTag ? `#${selectedTag} Posts` : "Posts"}
                </Text>
                {filteredPosts.length === 0 ? (
                  <View style={[styles.emptyState, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Ionicons name="document-text-outline" size={32} color={theme.colors.textSecondary} />
                    <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>No posts found</Text>
                  </View>
                ) : (
                  <View style={styles.communitiesList}>
                    {filteredPosts.map((post) => (
                      <TouchableOpacity
                        key={post.id}
                        onPress={() => router.push({
                          pathname: `/CommunityPage`,
                          params: { id: post.communityId, postId: post.id },
                        })}
                        style={[styles.postCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.communityName, { color: theme.colors.text }]} numberOfLines={1}>
                            {post.title}
                          </Text>
                          <Text style={[styles.communityDesc, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                            {post.content}
                          </Text>
                          <View style={styles.postMeta}>
                            <View style={[styles.postTag, { backgroundColor: theme.colors.chip }]}>
                              <Text style={[styles.postTagText, { color: theme.colors.primary }]}>#{post.type}</Text>
                            </View>
                            <Text style={[styles.postCommunity, { color: theme.colors.textSecondary }]}>
                              in {getCommunityName(post.communityId)}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Search Results - Communities (only when searching) */}
            {isSearching && (
              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>Communities</Text>
                {filteredCommunities.length === 0 ? (
                  <View style={[styles.emptyState, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Ionicons name="people-outline" size={32} color={theme.colors.textSecondary} />
                    <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>No communities found</Text>
                  </View>
                ) : (
                  <View style={styles.communitiesList}>
                    {filteredCommunities.map((community) => {
                      const isMember = user?.communities?.includes(community.communityID.toString());
                      return (
                        <TouchableOpacity
                          key={community.communityID}
                          onPress={() => router.push({
                            pathname: `/CommunityPage`,
                            params: { id: community.communityID },
                          })}
                          style={[styles.communityCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                        >
                          <View style={[styles.communityIcon, { backgroundColor: theme.colors.chip }]}>
                            <Ionicons name="people" size={24} color={theme.colors.primary} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.communityName, { color: theme.colors.text }]}>{community.communityName}</Text>
                            <Text style={[styles.communityDesc, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                              {community.description}
                            </Text>
                          </View>
                          <View style={styles.cardRight}>
                            {isMember ? (
                              <TouchableOpacity
                                style={[styles.leaveButton, { borderColor: theme.colors.border }]}
                                onPress={(e) => { e.stopPropagation(); handleLeave(community.communityID); }}
                              >
                                <Text style={[styles.leaveText, { color: theme.colors.textSecondary }]}>Leave</Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                style={[styles.joinButton, { backgroundColor: theme.colors.primary }]}
                                onPress={(e) => { e.stopPropagation(); handleJoin(community.communityID); }}
                              >
                                <Text style={[styles.joinText, { color: '#FFF' }]}>Join</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            )}

            {/* My Communities Section (only when NOT searching) */}
            {!isSearching && (
              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>My Communities</Text>
                {joinedCommunities.length === 0 ? (
                  <View style={[styles.emptyState, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Ionicons name="people-outline" size={32} color={theme.colors.textSecondary} />
                    <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>You haven't joined any communities yet</Text>
                    <Text style={[styles.emptyHint, { color: theme.colors.textSecondary }]}>
                      Join a community below to get started
                    </Text>
                  </View>
                ) : (
                  <View style={styles.communitiesList}>
                    {joinedCommunities.map((community) => (
                      <TouchableOpacity
                        key={community.communityID}
                        onPress={() => router.push({
                          pathname: `/CommunityPage`,
                          params: { id: community.communityID },
                        })}
                        style={[styles.communityCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                      >
                        <View style={[styles.communityIcon, { backgroundColor: theme.colors.chip }]}>
                          <Ionicons name="people" size={24} color={theme.colors.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.communityName, { color: theme.colors.text }]}>{community.communityName}</Text>
                          <Text style={[styles.communityDesc, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                            {community.description}
                          </Text>
                        </View>
                        <View style={styles.cardRight}>
                          <TouchableOpacity
                            style={[styles.leaveButton, { borderColor: theme.colors.border }]}
                            onPress={(e) => { e.stopPropagation(); handleLeave(community.communityID); }}
                          >
                            <Text style={[styles.leaveText, { color: theme.colors.textSecondary }]}>Leave</Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Discover Communities Section (only when NOT searching) */}
            {!isSearching && discoverCommunities.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>Discover Communities</Text>
                <View style={styles.communitiesList}>
                  {discoverCommunities.map((community) => (
                    <TouchableOpacity
                      key={community.communityID}
                      onPress={() => router.push({
                        pathname: `/CommunityPage`,
                        params: { id: community.communityID },
                      })}
                      style={[styles.communityCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                    >
                      <View style={[styles.communityIcon, { backgroundColor: theme.colors.chip }]}>
                        <Ionicons name="people" size={24} color={theme.colors.primary} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.communityName, { color: theme.colors.text }]}>{community.communityName}</Text>
                        <Text style={[styles.communityDesc, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                          {community.description}
                        </Text>
                      </View>
                      <View style={styles.cardRight}>
                        <TouchableOpacity
                          style={[styles.joinButton, { backgroundColor: theme.colors.primary }]}
                          onPress={(e) => { e.stopPropagation(); handleJoin(community.communityID); }}
                        >
                          <Text style={[styles.joinText, { color: '#FFF' }]}>Join</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
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
  overlay: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  hero: {
    width: "100%",
    gap: 4,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    opacity: 0.8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    width: "100%",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  searchIconLeft: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
  },
  tagsContainer: {
    flexGrow: 0,
    marginBottom: 16,
  },
  tagsContent: {
    gap: 10,
    paddingRight: 20,
  },
  tagChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
  },
  tagChipText: {
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 14,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  communitiesList: {
    gap: 12,
  },
  communityCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  communityIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  communityName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 3,
  },
  communityDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  cardRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  leaveButton: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  leaveText: {
    fontSize: 13,
    fontWeight: "600",
  },
  joinButton: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: "#e63946",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  joinText: {
    fontSize: 13,
    fontWeight: "700",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  emptyHint: {
    fontSize: 13,
    textAlign: "center",
    opacity: 0.8,
  },
  postCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  postMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 8,
  },
  postTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  postTagText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  postCommunity: {
    fontSize: 12,
  },
});