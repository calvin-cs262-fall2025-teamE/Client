import { useLocalSearchParams, useRouter } from "expo-router";

import { usePostContext } from "@/context/PostContext";
import { commonStyles } from "@/styles/common";
import { theme } from "@/styles/theme";
import { Post, defaultPost } from "@/types/Post";
import { Button } from "@react-navigation/elements";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";

export default function PostDetails() {
    const { id } = useLocalSearchParams(); // We want to send the id of the post through the route params
    const router = useRouter();
    const [replyText, setReplyText] = useState('');

    const { posts } = usePostContext();

    let replying = false;

    // If no posts are found we default to using the default post
    // The || operator in typescript handles this for us
    const selectedPost: Post = posts.find(post => post.id.toString() === id) || defaultPost;

    return (
        <ScrollView style={[commonStyles.container, { backgroundColor: theme.colors.background }]}>
            <View>
                {/* TODO: Update this to get the author's name. Do this once the service is up and running. */}
                <Text>On {selectedPost.timePosted.toDateString()}, {selectedPost.authorId} asked: </Text>
                <Text style={[commonStyles.titleText, {color: theme.colors.textPrimary}]}>{selectedPost.title}</Text>
                <Text>{selectedPost.content}</Text>

                <Button style={{ backgroundColor: theme.colors.primary }} onPressOut={() => replying = !replying}>Reply</Button>

                {replying &&
                    <TextInput
                        placeholder='Share your insight'
                        placeholderTextColor={theme.colors.textSecondary}
                        style={[commonStyles.text_field, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
                        value={replyText}
                        onChangeText={setReplyText}
                        multiline
                    />
                }
            </View>
        </ScrollView>
    );
}
