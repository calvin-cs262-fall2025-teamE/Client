import { useCommunityContext } from "@/context/CommunityContext";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const router = useRouter();
  // const suggestions = ["RVD"];
  // const fixedTags = ["RVD", "BHT", "BV", "KE", "SE"];

  const { communities } = useCommunityContext();
  // const fixedTags = communities.map(comm => comm.communityName); //Extracts all the names from the community array
  // const suggestions = fixedTags; // Currently just a copy

  const featured = [
    { key: "RVD", name: "Rodenhouse–Van Dellen", colors: [theme.colors.accent, theme.colors.primary] as [string, string] },
    { key: "BHT", name: "Bolt–Heyns–TerAvest", colors: ["#6CA0FF", "#9BD0FF"] as [string, string] },
    { key: "SE", name: "Schultze–Eldersveld", colors: ["#9B8CFF", "#C9BEFF"] as [string, string] },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={theme.colors.background as [string, string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      >
        <View style={styles.overlay}>
          <View style={styles.hero}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Welcome</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Find and follow Calvin communities</Text>
          </View>
          <LinearGradient
            colors={[`${theme.colors.accent}55`, "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGlow}
            pointerEvents="none"
          />

          <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <TextInput
              style={[styles.searchBar, { color: theme.colors.text }]}
              placeholder="Search..."
              placeholderTextColor={theme.colors.textSecondary}
              value={query}
              onChangeText={setQuery}
            />
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="search" size={22} color="white" />
            </TouchableOpacity>
          </View>

          {query.length > 0 && (
            <View style={[styles.suggestionsContainer, { backgroundColor: theme.colors.surfaceElev, borderColor: theme.colors.border }]}>
              {communities
                .filter((item) =>
                  item.communityName.toLowerCase().includes(query.toLowerCase())
                )
                .map((item) => (
                  <TouchableOpacity
                    key={item.communityID}
                    onPress={() => router.push({
                     pathname: `/CommunityPage`,
                     params: {id: item.communityID},
                    })}
                    
                    style={styles.suggestion}
                  >
                    <Text style={[styles.suggestionText, { color: theme.colors.text }]}>{item.communityName}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          )}

          <View style={styles.tagsContainer}>
            <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>Quick Tags</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 10 }}
            >
              <View style={styles.tagsRow}>
                {communities.map((community) => (
                  <TouchableOpacity
                    key={community.communityID}
                    onPress={() => router.push({
                     pathname: `/join-redirect`,
                     params: {id: community.communityID},
                    })}
                    style={[styles.tagButton, { backgroundColor: theme.colors.chip, borderColor: theme.colors.border }]}
                  >
                    <Text style={[styles.tagText, { color: theme.colors.text }]}>#{community.communityName}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* I think we need more reasons why to add this */}
          {/* <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>Featured Communities</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
              <View style={styles.cardsRow}>
                {featured.map((c) => (
                  <TouchableOpacity key={c.key} onPress={() => router.push(`/${c.key}` as any)} activeOpacity={0.9} style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <LinearGradient colors={c.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardAccent} />
                    <View style={styles.cardBody}>
                      <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{c.name}</Text>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <Text style={[styles.cardMeta, { color: theme.colors.textSecondary }]}>Tap to explore</Text>
                        <Ionicons name="arrow-forward" size={16} color={theme.colors.textSecondary} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View> */}

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
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "transparent",
    padding: 20,
    borderRadius: 16,
    width: "92%",
    alignItems: "center",
    position: "relative",
  },
  hero: {
    width: "100%",
    gap: 6,
    marginBottom: 10,
  },
  heroGlow: {
    position: "absolute",
    top: -20,
    left: -10,
    width: 220,
    height: 220,
    borderRadius: 999,
    opacity: 0.6,
  },
  title: {
    fontSize: 28,
    textAlign: "left",
    marginBottom: 2,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "left",
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    width: "100%",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: StyleSheet.hairlineWidth,
  },
  searchBar: {
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
  tagsContainer: {
    width: "100%",
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 13,
    marginLeft: 6,
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 6,
  },
  tagButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: StyleSheet.hairlineWidth,
  },
  tagText: {
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    width: "100%",
    marginTop: 4,
  },
  cardsRow: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 6,
  },
  card: {
    width: 240,
    height: 120,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  cardAccent: {
    height: 48,
    width: "100%",
    opacity: 0.6,
  },
  cardBody: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  cardMeta: {
    fontSize: 13,
  },
  suggestionsContainer: {
    width: "100%",
    borderRadius: 12,
    padding: 6,
    borderWidth: StyleSheet.hairlineWidth,
  },
  suggestion: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "transparent",
    borderRadius: 8,
    marginTop: 4,
    width: "100%",
  },
  suggestionText: {
    fontSize: 16,
  },
});