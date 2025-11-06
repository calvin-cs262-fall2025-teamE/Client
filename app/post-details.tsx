import { useLocalSearchParams, useRouter } from "expo-router";

import { usePostContext } from "@/context/PostContext";
import { commonStyles } from "@/styles/common";
import { Post, defaultPost } from "@/types/Post";
import { ScrollView, Text, View } from "react-native";

export default function PostDetails() {
    const { id } = useLocalSearchParams(); // We want to send the id of the post through the route params
    const router = useRouter();

    const { posts, deletePost } = usePostContext();

    // If no posts are found we default to using the default post
    // The || operator in typescript handles this for us
    const selectedPost: Post = posts.find(post => post.id.toString() === id) || defaultPost;

    return (
        <ScrollView style={commonStyles.container}>
            <View>
                <Text style={commonStyles.titleText}>{selectedPost.title}</Text>
            </View>
        </ScrollView>
    );
}
