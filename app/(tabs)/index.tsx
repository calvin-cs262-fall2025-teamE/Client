import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const suggestions = ["RVD"];
  const fixedTags = ["RVD", "BHT", "BV", "KE", "SE"];

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/calvin-bg.jpg")}
        style={styles.background}
        imageStyle={{ resizeMode: "cover" }}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Welcome</Text>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search..."
              placeholderTextColor="#888"
              value={query}
              onChangeText={setQuery}
            />
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="search" size={22} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.tagsContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 10 }}
            >
              <View style={styles.tagsRow}>
                {fixedTags.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    onPress={() => router.push(`/${tag}`)}
                    style={styles.tagButton}
                  >
                    <Text style={styles.tagText}>#{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {query.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {suggestions
                .filter((item) =>
                  item.toLowerCase().includes(query.toLowerCase())
                )
                .map((item) => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => router.push(`/${item}`)}
                    style={styles.suggestion}
                  >
                    <Text style={styles.suggestionText}>{item}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          )}
        </View>
      </ImageBackground>
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
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
    borderRadius: 10,
    width: "85%",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    color: "white",
    textAlign: "center",
    marginBottom: 25,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    width: "100%",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  searchBar: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  iconButton: {
    backgroundColor: "#4a90e2",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  tagsContainer: {
    width: "100%",
    marginBottom: 15,
  },
  tagsRow: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 5,
  },
  tagButton: {
    backgroundColor: "#4a90e2",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tagText: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
  },
  suggestionsContainer: {
    width: "100%",
  },
  suggestion: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginTop: 5,
    width: "100%",
  },
  suggestionText: {
    fontSize: 18,
    color: "#333",
  },
});