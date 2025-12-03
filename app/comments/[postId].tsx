import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Sample post content (should match RVD posts)
const POSTS_DATA = {
  1: 'Just started a new React Native project! 🚀',
  2: 'Check out this beautiful sunset!',
  3: 'Dogs make everything better 🐶',
  4: 'Nature walks are the best therapy.',
  5: 'Working on a cool new app idea!',
};

export default function CommentScreen() {
  const { theme } = useTheme();
  const { postID } = useLocalSearchParams();
  const postText = POSTS_DATA[postID as string] || 'Post not found';

  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<string[]>([]);

  const submitComment = () => {
    if (!commentText.trim()) return;

    setComments((prev) => [...prev, commentText]);
    setCommentText('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>

        {/* Post Content */}
        <View
          style={[
            styles.postBox,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <Text style={[styles.postTitle, { color: theme.colors.text }]}>Post</Text>
          <Text style={[styles.postText, { color: theme.colors.textSecondary }]}>
            {postText}
          </Text>
        </View>

        {/* Comments Label */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Comments</Text>

        {/* Comment List */}
        <FlatList
          data={comments}
          keyExtractor={(_, index) => index.toString()}
          style={styles.commentList}
          renderItem={({ item }) => (
            <View
              style={[
                styles.commentItem,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
              ]}
            >
              <Ionicons
                name="person-circle-outline"
                size={28}
                color={theme.colors.textSecondary}
              />
              <Text style={[styles.commentText, { color: theme.colors.text }]}>{item}</Text>
            </View>
          )}
        />

        {/* Input Area */}
        <View
          style={[
            styles.inputRow,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <TextInput
            value={commentText}
            onChangeText={setCommentText}
            placeholder="Write a comment..."
            placeholderTextColor={theme.colors.textSecondary}
            style={[styles.input, { color: theme.colors.text }]}
          />
          <TouchableOpacity onPress={submitComment} style={styles.sendButton}>
            <Ionicons name="send" size={22} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 16 },
  postBox: {
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    marginBottom: 20,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  postText: {
    fontSize: 15,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
    marginLeft: 4,
  },
  commentList: {
    flex: 1,
    marginBottom: 16,
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    marginBottom: 10,
  },
  commentText: {
    fontSize: 15,
    flexShrink: 1,
  },
  inputRow: {
    flexDirection: 'row',
    padding: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  sendButton: {
    paddingLeft: 10,
  },
});
