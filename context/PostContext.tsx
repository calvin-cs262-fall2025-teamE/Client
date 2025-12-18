/**
 * PostContext - React Context for managing application items
 *
 * Holds centralized states for which post is selected at any given moment, selected form a search list
 * Lots of this code was copied from the labs
 */

import { Post } from "@/types/Post";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getAllPosts, createPost as createPostAPI, CreatePostPayload } from "@/api/posts";

/**
 * This context type defines the shape of the context value that includes
 * the items array and a function to delete items by their unique identifier.
 *
 * @interface PostContextType
 * @property items - Array of all available items
 * @property deleteItem - Function to remove an item by its ID
 */
interface PostContextType {
    posts: Post[]; // This will work in with out schema
    loading: boolean; // Loading state for API calls
    refreshPosts: () => Promise<void>; // Refresh posts from API
    deletePost: (id: number) => void;
    addPost: (post: Omit<Post, 'id' | 'timePosted' | 'images'> & { images?: string[] }) => Promise<void>;
    toggleLike: (postId: number, userId: number) => void;
    addComment: (postId: number, authorId: number, text: string) => void;
    addReply: (postId: number, commentId: number, authorId: number, text: string) => void;
    toggleCommentLike: (postId: number, commentId: number, userId: number) => void;
}

/**
 * This creates and exports the context for item state management.
 * It returns undefined if used outside of ItemProvider, which allows
 * components to detect if they're properly wrapped.
 */
export const PostContext = createContext<PostContextType | undefined>(undefined);

/**
 * This creates and exports the provider component.
 *
 */
export const PostProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    // Initialize posts from API - no hardcoded data
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    // Global comment/reply ID sequence to avoid collisions across nested threads
    const [commentIdSeq, setCommentIdSeq] = useState<number>(1);

    const nextCommentId = React.useCallback(() => {
        // Simple monotonically increasing counter; unique within session
        const id = commentIdSeq + 1;
        setCommentIdSeq(id);
        return id;
    }, [commentIdSeq]);

    // Fetch posts from API on mount and when refresh is called
    const refreshPosts = React.useCallback(async () => {
        try {
            setLoading(true);
            const fetchedPosts = await getAllPosts();
            setPosts(fetchedPosts);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            // Keep existing posts on error
        } finally {
            setLoading(false);
        }
    }, []);

    // Load posts on mount
    useEffect(() => {
        refreshPosts();
    }, [refreshPosts]);

    /**
     * Removes an item from the list by filtering out the matching ID
     *
     * Almost got this working, but it's only necessary for out posts
     */
    const deletePost = React.useCallback((id: number) => {
        setPosts((prevItems) => prevItems.filter((post) => post.id !== id));
    }, []); // Empty dependency array - function doesn't depend on any props or state

    /**
     * Adds a new post via API and refreshes the list
     */
    const addPost = React.useCallback(async (post: Omit<Post, 'id' | 'timePosted' | 'images'> & { images?: string[] }) => {
        try {
            // Prepare payload for API - MUST match backend exactly
            const payload: CreatePostPayload = {
                type: post.type as 'question' | 'advice',
                title: post.title,
                content: post.content,
                authorId: Number(post.authorId), // Convert string to number for API
                communityId: post.communityId,
                images: post.images && post.images.length > 0 ? post.images : undefined, // Only send if images exist (pure base64)
            };

            // Create post via API - NO local state mutation
            await createPostAPI(payload);

            // MUST re-fetch from backend - never mutate local state
            await refreshPosts();
        } catch (error) {
            console.error('Failed to create post:', error);
            throw error; // Re-throw so UI can handle error
        }
    }, [refreshPosts]);

    /**
     * Toggles like status for a post by a specific user
     */
    const toggleLike = React.useCallback((postId: number, userId: number) => {
        console.log('toggleLike called:', postId, userId);
        setPosts((prevPosts) => {
            const newPosts = prevPosts.map(post => {
                if (post.id === postId) {
                    const likedBy = post.likedBy || [];
                    const isLiked = likedBy.includes(userId);
                    console.log('Post found, isLiked:', isLiked);
                    return {
                        ...post,
                        likes: isLiked ? (post.likes || 1) - 1 : (post.likes || 0) + 1,
                        likedBy: isLiked 
                            ? likedBy.filter(id => id !== userId)
                            : [...likedBy, userId]
                    };
                }
                return post;
            });
            console.log('Updated posts:', newPosts);
            return newPosts;
        });
    }, []);

    /**
     * Adds a comment to a post
     */
    const addComment = React.useCallback((postId: number, authorId: number, text: string) => {
        setPosts((prevPosts) => prevPosts.map(post => {
            if (post.id === postId) {
                const newComment = {
                    id: nextCommentId(),
                    authorId,
                    text,
                    timePosted: new Date(),
                    replies: [],
                    likes: 0,
                    retweets: 0,
                    shares: 0,
                    likedBy: [],
                    retweetedBy: [],
                };
                return {
                    ...post,
                    comments: [...post.comments, newComment]
                };
            }
            return post;
        }));
    }, [nextCommentId]);

    /**
     * Adds a reply to a comment
     */
    const addReply = React.useCallback((postId: number, commentId: number, authorId: number, text: string) => {
        setPosts((prevPosts) => prevPosts.map(post => {
            if (post.id === postId) {
                const updateCommentReplies = (comments: typeof post.comments): typeof post.comments => {
                    return comments.map(comment => {
                        if (comment.id === commentId) {
                            const newReply = {
                                id: nextCommentId(),
                                authorId,
                                text,
                                timePosted: new Date(),
                                replies: [],
                                likes: 0,
                                retweets: 0,
                                shares: 0,
                                likedBy: [],
                                retweetedBy: [],
                            };
                            return {
                                ...comment,
                                replies: [...(comment.replies || []), newReply]
                            };
                        }
                        // Recursively check replies for nested comments
                        if (comment.replies && comment.replies.length > 0) {
                            return {
                                ...comment,
                                replies: updateCommentReplies(comment.replies)
                            };
                        }
                        return comment;
                    });
                };
                return {
                    ...post,
                    comments: updateCommentReplies(post.comments)
                };
            }
            return post;
        }));
    }, [nextCommentId]);

    /**
     * Helper to update a specific comment by ID recursively
     */
    const updateCommentById = React.useCallback((comments: typeof posts[number]['comments'], targetId: number, updater: (c: typeof comments[number]) => typeof comments[number]) => {
        return comments.map(c => {
            if (c.id === targetId) {
                return updater(c);
            }
            if (c.replies && c.replies.length > 0) {
                return { ...c, replies: updateCommentById(c.replies, targetId, updater) };
            }
            return c;
        });
    }, [posts]);

    const toggleCommentLike = React.useCallback((postId: number, commentId: number, userId: number) => {
        setPosts(prev => prev.map(post => {
            if (post.id !== postId) return post;
            const updatedComments = updateCommentById(post.comments, commentId, (c) => {
                const isLiked = c.likedBy.includes(userId);
                return {
                    ...c,
                    likes: isLiked ? c.likes - 1 : c.likes + 1,
                    likedBy: isLiked ? c.likedBy.filter(id => id !== userId) : [...c.likedBy, userId],
                };
            });
            return { ...post, comments: updatedComments };
        }));
    }, [updateCommentById]);

    // Context value object containing all state and actions
    const value: PostContextType = {
        posts,
        loading,
        refreshPosts,
        deletePost,
        addPost,
        toggleLike,
        addComment,
        addReply,
        toggleCommentLike,
    };

    return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

/**
 * Custom hook to safely access PostContext
 *
 * It handles the null check and provides a helpful error message if used
 * outside of ItemProvider. This eliminates boilerplate in components.
 * 
 * Copied from lab05
 *
 * @returns The context value containing items and deleteItem function
 * @throws Error if used outside of ItemProvider
 */
export const usePostContext = () => {
    const context = useContext(PostContext);
    if (!context) {
        throw new Error("usePostContext must be used within an PostProvider");
    }
    return context;
};
