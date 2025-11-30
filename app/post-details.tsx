import { useLocalSearchParams } from "expo-router";

import PostCard from "@/components/PostCard";
import { usePostContext } from "@/context/PostContext";
import { useTheme } from "@/context/ThemeContext";
import { Post, defaultPost } from "@/types/Post";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";

export default function PostDetails() {
    const { id } = useLocalSearchParams();
    const { posts } = usePostContext();
    const { theme } = useTheme();

    // Simulated current user ID - replace with actual auth context when available
    const currentUserId = 1;

    // If no posts are found we default to using the default post
    const selectedPost: Post = posts.find(post => post.id.toString() === id) || defaultPost;

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background[0] }]}>
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
    },
});
