import { useLocalSearchParams } from 'expo-router';

import { usePostContext } from '@/context/PostContext';
import { commonStyles } from '@/styles/common';
import { theme } from '@/styles/theme';
import { Post, defaultPost } from '@/types/Post';
import { Button } from '@react-navigation/elements';
import React, { useState } from 'react';
import {
    ScrollView, Text, TextInput, View,
} from 'react-native';

export default function PostDetails() {
  // We want to send the id of the post through the route params
  const { id } = useLocalSearchParams();
  //   const router = useRouter();
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  const { posts } = usePostContext();

  // If no posts are found we default to using the default post
  // The || operator in typescript handles this for us
  const selectedPost: Post = posts.find((post) => post.id.toString() === id) || defaultPost;

  return (

    // eslint-disable-next-line react/jsx-filename-extension
    <ScrollView style={[commonStyles.container, { backgroundColor: theme.colors.background }]}>
      <View>
        {/* TODO: Update this to get the author's name. */}
        <Text style={{ color: theme.colors.textPrimary }}>
          On
          {selectedPost.timePosted.toDateString()}
          ,
          {selectedPost.authorId}
          {' '}
          asked:
          {' '}
        </Text>
        <Text style={
            [commonStyles.titleText, { color: theme.colors.textPrimary, margin: 14 }]
        }
        >
          {selectedPost.title}
        </Text>
        <Text style={{ color: theme.colors.textPrimary }}>{selectedPost.content}</Text>

        <Button
          style={
            [commonStyles.button, { backgroundColor: theme.colors.primary }]
        }
          onPressOut={() => setReplying(!replying)}
        >
          Reply
        </Button>

        {replying
                    && (
                    <TextInput
                      placeholder="Share your insight"
                      placeholderTextColor={theme.colors.textSecondary}
                      style={
                        [
                          commonStyles.text_field,
                          {
                            backgroundColor: theme.colors.surface,
                            borderColor: theme.colors.border,
                            color: theme.colors.textPrimary,
                          }]
}
                      value={replyText}
                      onChangeText={setReplyText}
                      multiline
                    />
                    )}
      </View>
    </ScrollView>
  );
}
