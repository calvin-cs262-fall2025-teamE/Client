import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ImageBackground, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const suggestions = ["RVD"];

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/calvin-bg.jpg")}
        style={styles.background}
        imageStyle={{ resizeMode: "cover" }}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Welcome</Text>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search..."
              placeholderTextColor="#aaa"
              value={query}
              onChangeText={setQuery}
            />
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="search" size={22} color="white" />
            </TouchableOpacity>
          </View>

          {query.length > 0 &&
            suggestions
              .filter((item) => item.toLowerCase().includes(query.toLowerCase()))
              .map((item) => (
                <TouchableOpacity key={item} onPress={() => router.push(`/${item}`)} style={styles.suggestion}>
                  <Text style={styles.suggestionText}>{item}</Text>
                </TouchableOpacity>
              ))}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
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
    width: "80%",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
    width: "100%",
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  iconButton: {
    backgroundColor: "#333",
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    padding: 10,
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