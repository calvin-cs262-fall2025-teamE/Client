import { useCommunityContext } from "@/context/CommunityContext";
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
  const { communities } = useCommunityContext();
  const { user, updateUser } = useAuth();
  const router = useRouter();

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

  // Show only joined communities by default, but show all when searching
  const userCommunities = user?.communities || [];
  const displayCommunities = query.length > 0 
    ? communities  // Show all communities when searching
    : communities.filter((c) => userCommunities.includes(c.communityID.toString())); // Only joined when not searching
  
  const filteredCommunities = query.length > 0
    ? displayCommunities.filter((item) =>
        item.communityName.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      )
    : displayCommunities;

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
            <Text style={[styles.title, { color: theme.colors.text }]}>Discover</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Find and join Calvin communities</Text>
          </View>

          <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Ionicons name="search" size={22} color={theme.colors.textSecondary} style={styles.searchIconLeft} />
            <TextInput
              style={[styles.searchBar, { color: theme.colors.text }]}
              placeholder="Search communities..."
              placeholderTextColor={theme.colors.textSecondary}
              value={query}
              onChangeText={setQuery}
            />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>
                {query ? "Search Results" : "All Communities"}
              </Text>
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
                      <Text style={[styles.communityName, { color: theme.colors.text }]}> 
                        {community.communityName}
                      </Text>
                      <Text style={[styles.communityDesc, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                        {community.description}
                      </Text>
                    </View>
                    <View style={styles.cardRight}>
                      {isMember ? (
                        <TouchableOpacity
                          style={[styles.leaveButton, { borderColor: theme.colors.border }]}
                          onPress={(e) => {
                            e.stopPropagation();
                            handleLeave(community.communityID);
                          }}
                        >
                          <Text style={[styles.leaveText, { color: theme.colors.textSecondary }]}>Leave</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={[styles.joinButton, { backgroundColor: theme.colors.primary }]}
                          onPress={(e) => {
                            e.stopPropagation();
                            handleJoin(community.communityID);
                          }}
                        >
                          <Text style={[styles.joinText, { color: '#FFF' }]}>Join</Text>
                        </TouchableOpacity>
                      )}
                      <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                    </View>
                  </TouchableOpacity>
                );
                })}
              </View>
            </View>
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
    paddingTop: 12,
    paddingBottom: 20,
  },
  hero: {
    width: "100%",
    gap: 6,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 15,
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
    paddingHorizontal: 12,
  },
  searchIconLeft: {
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    marginLeft: 2,
  },
  communitiesList: {
    gap: 12,
  },
  communityCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    gap: 12,
  },
  communityIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  communityName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  communityDesc: {
    fontSize: 13,
  },
  cardRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  leaveButton: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  leaveText: {
    fontSize: 12,
    fontWeight: "600",
  },
  joinButton: {
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  joinText: {
    fontSize: 12,
    fontWeight: "600",
  },
});