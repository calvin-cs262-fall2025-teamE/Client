import { usePostContext } from "@/context/PostContext";
import { useTheme } from "@/context/ThemeContext";
import { Comment, Post } from "@/types/Post";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface PostCardProps {
  post: Post;
  currentUserId: number;
  isDetailView?: boolean;
}

export default function PostCard({ post, currentUserId, isDetailView = false }: PostCardProps) {
  const { theme } = useTheme();
  const { addComment, addReply, toggleCommentLike, toggleCommentRetweet, shareComment } = usePostContext();
  // toggleLike, toggleRetweet, sharePost
  const router = useRouter();
  const [commenting, setCommenting] = useState(false);
  const [showComments, setShowComments] = useState(isDetailView);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set());

  // const handleLike = () => {
  //   toggleLike(post.id, currentUserId);
  // };

  // const handleRetweet = () => {
  //   toggleRetweet(post.id, currentUserId);
  // };

  // const handleShare = async () => {
  //   try {
  //     await Share.share({
  //       message: `Check out this post: ${post.title}`,
  //       title: post.title,
  //     });
  //     sharePost(post.id);
  //   } catch (error) {
  //     console.error('Error sharing:', error);
  //   }
  // };

  const handleComment = () => {
    setShowComments(!showComments);
    if (!showComments) {
      setCommenting(false);
    }
  };

  const handleSendComment = () => {
    if (commentText.trim()) {
      addComment(post.id, currentUserId, commentText.trim());
      console.log('Comment on post', post.id, ':', commentText);
      setCommentText('');
      setCommenting(false);
    }
  };

  const handleSendReply = (commentId: number) => {
    if (replyText.trim()) {
      addReply(post.id, commentId, currentUserId, replyText.trim());
      console.log('Reply to comment', commentId, ':', replyText);
      setReplyText('');
      setReplyingTo(null);
    }
  };

  const toggleReplies = (commentId: number) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const renderComment = (comment: Comment, depth: number = 0) => {
    const isExpanded = expandedReplies.has(comment.id);
    const hasReplies = comment.replies && comment.replies.length > 0;

    return (
      <View key={comment.id} style={[styles.commentItem, depth > 0 && { marginLeft: 20, paddingLeft: 12, borderLeftWidth: 2, borderLeftColor: theme.colors.border }]}>
        <Text style={[styles.commentAuthor, { color: theme.colors.text }]}>
          User {comment.authorId}
        </Text>
        <Text style={[styles.commentText, { color: theme.colors.text }]}>
          {comment.text}
        </Text>
        <View style={styles.commentFooter}>
          <Text style={[styles.commentTime, { color: theme.colors.textSecondary }]}>
            {new Date(comment.timePosted).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>

        {/* Comment action buttons */}
        <View style={styles.commentActions}>
          <TouchableOpacity 
            style={styles.commentActionBtn}
            onPress={() => hasReplies ? toggleReplies(comment.id) : setReplyingTo(replyingTo === comment.id ? null : comment.id)}
          >
            <Ionicons 
              name={isExpanded ? "chatbubble" : "chatbubble-outline"} 
              size={16} 
              color={theme.colors.textSecondary} 
            />
            {hasReplies && (
              <Text style={[styles.commentActionCount, { color: theme.colors.textSecondary }]}>
                {comment.replies!.length}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.commentActionBtn} onPress={() => toggleCommentRetweet(post.id, comment.id, currentUserId)}>
            <Ionicons name={comment.retweetedBy.includes(currentUserId) ? "repeat" : "repeat-outline"} size={16} color={comment.retweetedBy.includes(currentUserId) ? theme.colors.accent : theme.colors.textSecondary} />
            {comment.retweets > 0 && (
              <Text style={[styles.commentActionCount, { color: comment.retweetedBy.includes(currentUserId) ? theme.colors.accent : theme.colors.textSecondary }]}>
                {comment.retweets}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.commentActionBtn} onPress={() => toggleCommentLike(post.id, comment.id, currentUserId)}>
            <Ionicons name={comment.likedBy.includes(currentUserId) ? "heart" : "heart-outline"} size={16} color={comment.likedBy.includes(currentUserId) ? "#e74c3c" : theme.colors.textSecondary} />
            {comment.likes > 0 && (
              <Text style={[styles.commentActionCount, { color: comment.likedBy.includes(currentUserId) ? "#e74c3c" : theme.colors.textSecondary }]}>
                {comment.likes}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.commentActionBtn} onPress={() => shareComment(post.id, comment.id)}>
            <Ionicons name="share-outline" size={16} color={theme.colors.textSecondary} />
            {comment.shares > 0 && (
              <Text style={[styles.commentActionCount, { color: theme.colors.textSecondary }]}>
                {comment.shares}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}>
            <Text style={[styles.replyButton, { color: theme.colors.primary }]}>Reply</Text>
          </TouchableOpacity>
        </View>
        
        {/* Reply input for this comment */}
        {replyingTo === comment.id && (
          <View style={styles.commentInputContainer}>
            <TextInput
              placeholder='Write a reply...'
              placeholderTextColor={theme.colors.textSecondary}
              style={[styles.commentInput, { 
                backgroundColor: theme.colors.chip, 
                borderColor: theme.colors.border, 
                color: theme.colors.text 
              }]}
              value={replyText}
              onChangeText={setReplyText}
              multiline
              autoFocus
            />
            <TouchableOpacity 
              style={[
                styles.sendButton, 
                { backgroundColor: replyText.trim() ? theme.colors.primary : theme.colors.border }
              ]}
              onPress={() => handleSendReply(comment.id)}
              disabled={!replyText.trim()}
            >
              <Ionicons name="send" size={18} color={replyText.trim() ? "#fff" : theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}

        {/* Render nested replies - only when expanded */}
        {hasReplies && isExpanded && (
          <View style={styles.repliesContainer}>
            {comment.replies!.map(reply => renderComment(reply, depth + 1))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.postCard, { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.border }]}>
      <View style={{ flex: 1 }}>
        <View style={styles.postHeader}>
          <Text style={[styles.postName, { color: theme.colors.text }]}>User {post.authorId}</Text>
          <Text style={[styles.postHandle, { color: theme.colors.textSecondary }]}>
            {new Date(post.timePosted).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        
        <TouchableOpacity onPress={() => router.push({
          pathname: "./post-details",
          params: { id: post.id }
        })}>
          <Text style={[styles.postText, { color: theme.colors.text }]}>{post.title}</Text>
        </TouchableOpacity>
        
        <View style={styles.postActions}>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={handleComment}
          >
            <Ionicons 
              name={showComments ? "chatbubble" : "chatbubble-outline"} 
              size={20} 
              color={showComments ? theme.colors.primary : theme.colors.textSecondary} 
            />
            {post.comments.length > 0 && (
              <Text style={[styles.actionCount, { color: showComments ? theme.colors.primary : theme.colors.textSecondary }]}>
                {post.comments.length}
              </Text>
            )}
          </TouchableOpacity>
          
          {/* <TouchableOpacity 
            style={styles.actionBtn}
            onPress={handleRetweet}
          >
            <Ionicons 
              name={post.retweetedBy.includes(currentUserId) ? "repeat" : "repeat-outline"} 
              size={20} 
              color={post.retweetedBy.includes(currentUserId) ? theme.colors.accent : theme.colors.textSecondary} 
            />
            {post.retweets > 0 && (
              <Text style={[styles.actionCount, { color: post.retweetedBy.includes(currentUserId) ? theme.colors.accent : theme.colors.textSecondary }]}>
                {post.retweets}
              </Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={handleLike}
          >
            <Ionicons 
              name={post.likedBy.includes(currentUserId) ? "heart" : "heart-outline"} 
              size={20} 
              color={post.likedBy.includes(currentUserId) ? "#e74c3c" : theme.colors.textSecondary} 
            />
            {post.likes > 0 && (
              <Text style={[styles.actionCount, { color: post.likedBy.includes(currentUserId) ? "#e74c3c" : theme.colors.textSecondary }]}>
                {post.likes}
              </Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={20} color={theme.colors.textSecondary} />
            {post.shares > 0 && (
              <Text style={[styles.actionCount, { color: theme.colors.textSecondary }]}>
                {post.shares}
              </Text>
            )}
          </TouchableOpacity> */}
        </View>

        {/* Display Comments Section - Only when showComments is true */}
        {showComments && (
          <View style={[styles.commentsSection, { borderTopColor: theme.colors.border }]}>
            {/* Display existing comments */}
            {post.comments.length > 0 && (
              <View style={styles.commentsList}>
                {post.comments.map((comment) => renderComment(comment))}
              </View>
            )}

            {/* Add comment button/input */}
            {!commenting ? (
              <TouchableOpacity 
                style={[styles.addCommentButton, { borderColor: theme.colors.border }]}
                onPress={() => setCommenting(true)}
              >
                <Text style={[styles.addCommentText, { color: theme.colors.textSecondary }]}>
                  Write a comment...
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.commentInputContainer}>
                <TextInput
                  placeholder='Write a comment...'
                  placeholderTextColor={theme.colors.textSecondary}
                  style={[styles.commentInput, { 
                    backgroundColor: theme.colors.chip, 
                    borderColor: theme.colors.border, 
                    color: theme.colors.text 
                  }]}
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                  autoFocus
                />
                <TouchableOpacity 
                  style={[
                    styles.sendButton, 
                    { backgroundColor: commentText.trim() ? theme.colors.primary : theme.colors.border }
                  ]}
                  onPress={handleSendComment}
                  disabled={!commentText.trim()}
                >
                  <Ionicons name="send" size={18} color={commentText.trim() ? "#fff" : theme.colors.textSecondary} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  postCard: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  postName: {
    fontWeight: '700',
    fontSize: 15,
    marginRight: 6,
  },
  postHandle: {
    fontSize: 13,
  },
  postText: {
    fontSize: 15,
    marginBottom: 6,
    marginTop: 2,
    lineHeight: 20,
  },
  postActions: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 2,
    gap: 24,
  },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 40,
  },
  actionCount: {
    fontSize: 13,
    fontWeight: '500',
  },
  commentsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  commentsList: {
    gap: 10,
    marginBottom: 10,
  },
  commentItem: {
    paddingVertical: 6,
    marginBottom: 8,
  },
  commentFooter: {
    marginTop: 4,
    marginBottom: 6,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 4,
  },
  commentActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentActionCount: {
    fontSize: 12,
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 2,
  },
  commentTime: {
    fontSize: 11,
  },
  replyButton: {
    fontSize: 12,
    fontWeight: '600',
  },
  repliesContainer: {
    marginTop: 8,
  },
  addCommentButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 4,
  },
  addCommentText: {
    fontSize: 14,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginTop: 4,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 80,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
