import { useLocalSearchParams, useRouter } from "expo-router";

import PostCard from "@/components/PostCard";
import { usePostContext } from "@/context/PostContext";
import { useTheme } from "@/context/ThemeContext";
import { Post, defaultPost } from "@/types/Post";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PostDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { posts } = usePostContext();
    const { theme } = useTheme();

    // Simulated current user ID - replace with actual auth context when available
    const currentUserId = 1;

    // If no posts are found we default to using the default post
    const selectedPost: Post = posts.find(post => post.id.toString() === id) || defaultPost;

    return (
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={theme.colors.background}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.background}
        >
          <ScrollView 
            contentContainerStyle={styles.container}
          >
            <PostCard post={selectedPost} currentUserId={currentUserId} isDetailView={true} />
          </ScrollView>

                {/* Bottom Navigation Bar */}
                <View style={[styles.bottomNav, { backgroundColor: 'transparent', borderTopColor: theme.colors.border }]}>
                  <TouchableOpacity 
                    style={styles.navItem} 
                    onPress={() => router.push('/(tabs)/index')}
                  >
                    <Ionicons name="compass-outline" size={28} color={theme.colors.textSecondary} />
                    <Text style={[styles.navLabel, { color: theme.colors.textSecondary }]}>Home</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.navItem}
                    onPress={() => router.push('/(tabs)/search')}
                  >
                    <Ionicons name="search-outline" size={28} color={theme.colors.textSecondary} />
                    <Text style={[styles.navLabel, { color: theme.colors.textSecondary }]}>Search</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.navItem}
                    onPress={() => router.push('/(tabs)/post')}
                  >
                    <Ionicons name="add-circle-outline" size={28} color={theme.colors.textSecondary} />
                    <Text style={[styles.navLabel, { color: theme.colors.textSecondary }]}>Post</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.navItem}
                    onPress={() => router.push('/(tabs)/profile')}
                  >
                    <Ionicons name="person-outline" size={28} color={theme.colors.textSecondary} />
                    <Text style={[styles.navLabel, { color: theme.colors.textSecondary }]}>Profile</Text>
                  </TouchableOpacity>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    background: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
    container: {
      flexGrow: 1,
      paddingBottom: 140,
    },
    bottomNav: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      borderTopWidth: 1,
      height: 85,
      paddingBottom: 20,
      paddingTop: 10,
      backgroundColor: 'transparent',
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    navLabel: {
        fontSize: 11,
        fontWeight: '600',
    },
});
