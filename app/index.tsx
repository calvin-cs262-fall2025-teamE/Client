import { View, TextInput, Text, TouchableOpacity, ImageBackground, StyleSheet, SafeAreaView } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const suggestions = ["RVD"];

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../assets/images/calvin-bg.jpg")}
        style={styles.background}
        imageStyle={{ resizeMode: "cover" }}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Welcome to APP-NAME</Text>
          <Text style={styles.title}>Select Location</Text>

          <TextInput
            style={styles.searchBar}
            placeholder="Search..."
            placeholderTextColor="#aaa"
            value={query}
            onChangeText={setQuery}
          />

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
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    // justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
    
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    margin: 50,
  },
  title: {
    fontSize: 28,
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  searchBar: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
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