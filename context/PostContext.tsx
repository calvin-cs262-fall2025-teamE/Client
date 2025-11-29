/**
 * PostContext - React Context for managing application items
 *
 * Holds centralized states for which post is selected at any given moment, selected form a search list
 * Lots of this code was copied from the labs
 */

import { Post } from "@/types/Post";
import React, { createContext, ReactNode, useContext, useState } from "react";

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
    deletePost: (id: number) => void;
    addPost: (post: Omit<Post, 'id' | 'timePosted'>) => void;
    toggleLike: (postId: number, userId: number) => void;
    toggleRetweet: (postId: number, userId: number) => void;
    sharePost: (postId: number) => void;
    addComment: (postId: number, authorId: number, text: string) => void;
    addReply: (postId: number, commentId: number, authorId: number, text: string) => void;
    toggleCommentLike: (postId: number, commentId: number, userId: number) => void;
    toggleCommentRetweet: (postId: number, commentId: number, userId: number) => void;
    shareComment: (postId: number, commentId: number) => void;
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
    // Global comment/reply ID sequence to avoid collisions across nested threads
    const [commentIdSeq, setCommentIdSeq] = useState<number>(1);

    const nextCommentId = React.useCallback(() => {
        // Simple monotonically increasing counter; unique within session
        const id = commentIdSeq + 1;
        setCommentIdSeq(id);
        return id;
    }, [commentIdSeq]);
    // Initialize items from imported JSON data
    const [posts, setPosts] = useState<Post[]>([
        {
            id: 1,
            type: 'post',
            title: 'Just started a new React Native project! 🚀',
            authorId: 1,
            communityId: 0, // RVD community
            upvotes: 12,
            timePosted: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
            content: "Excited to be building with Expo and React Native!",
            likes: 8,
            retweets: 3,
            shares: 1,
            likedBy: [],
            retweetedBy: [],
            comments: [],
        },
        {
            id: 2,
            type: 'post',
            title: 'Check out this beautiful sunset!',
            authorId: 2,
            communityId: 0, // RVD community
            upvotes: 25,
            timePosted: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
            content: "Captured this amazing view from my dorm window.",
            likes: 15,
            retweets: 4,
            shares: 2,
            likedBy: [],
            retweetedBy: [],
            comments: [],
        },
        {
            id: 3,
            type: 'post',
            title: 'Dogs make everything better 🐶',
            authorId: 3,
            communityId: 0, // RVD community
            upvotes: 30,
            timePosted: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
            content: "Met the cutest dog on campus today!",
            likes: 22,
            retweets: 5,
            shares: 3,
            likedBy: [],
            retweetedBy: [],
            comments: [],
        },
        {
            id: 4,
            type: 'question',
            title: 'Where\'s the best study spot?',
            authorId: 4,
            communityId: 0, // RVD community
            upvotes: 16,
            timePosted: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
            content: "Looking for a quiet place to study for finals.",
            likes: 5,
            retweets: 2,
            shares: 1,
            likedBy: [],
            retweetedBy: [],
            comments: [],
        },
        {
            id: 5,
            type: 'question',
            title: 'Is it true that there is a fire drill later today?',
            authorId: 5,
            communityId: 0, // RVD community
            upvotes: 8,
            timePosted: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
            content: "Heard rumors about a fire drill this afternoon.",
            likes: 3,
            retweets: 1,
            shares: 0,
            likedBy: [],
            retweetedBy: [],
            comments: [],
        }
    ]);

    /**
     * Removes an item from the list by filtering out the matching ID
     *
     * Almost got this working, but it's only necessary for out posts
     */
    const deletePost = React.useCallback((id: number) => {
        setPosts((prevItems) => prevItems.filter((post) => post.id !== id));
    }, []); // Empty dependency array - function doesn't depend on any props or state

    /**
     * Adds a new post to the list
     */
    const addPost = React.useCallback((post: Omit<Post, 'id' | 'timePosted'>) => {
        setPosts((prevPosts) => [
            {
                ...post,
                id: Math.max(...prevPosts.map(p => p.id), 0) + 1,
                timePosted: new Date(),
                comments: [],
            },
            ...prevPosts,
        ]);
    }, []);

    /**
     * Toggles like status for a post by a specific user
     */
    const toggleLike = React.useCallback((postId: number, userId: number) => {
        console.log('toggleLike called:', postId, userId);
        setPosts((prevPosts) => {
            const newPosts = prevPosts.map(post => {
                if (post.id === postId) {
                    const isLiked = post.likedBy.includes(userId);
                    console.log('Post found, isLiked:', isLiked);
                    return {
                        ...post,
                        likes: isLiked ? post.likes - 1 : post.likes + 1,
                        likedBy: isLiked 
                            ? post.likedBy.filter(id => id !== userId)
                            : [...post.likedBy, userId]
                    };
                }
                return post;
            });
            console.log('Updated posts:', newPosts);
            return newPosts;
        });
    }, []);

    /**
     * Toggles retweet status for a post by a specific user
     */
    const toggleRetweet = React.useCallback((postId: number, userId: number) => {
        console.log('toggleRetweet called:', postId, userId);
        setPosts((prevPosts) => {
            const newPosts = prevPosts.map(post => {
                if (post.id === postId) {
                    const isRetweeted = post.retweetedBy.includes(userId);
                    console.log('Post found, isRetweeted:', isRetweeted);
                    return {
                        ...post,
                        retweets: isRetweeted ? post.retweets - 1 : post.retweets + 1,
                        retweetedBy: isRetweeted 
                            ? post.retweetedBy.filter(id => id !== userId)
                            : [...post.retweetedBy, userId]
                    };
                }
                return post;
            });
            console.log('Updated posts:', newPosts);
            return newPosts;
        });
    }, []);

    /**
     * Increments share count for a post
     */
    const sharePost = React.useCallback((postId: number) => {
        setPosts((prevPosts) => prevPosts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    shares: post.shares + 1
                };
            }
            return post;
        }));
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

    const toggleCommentRetweet = React.useCallback((postId: number, commentId: number, userId: number) => {
        setPosts(prev => prev.map(post => {
            if (post.id !== postId) return post;
            const updatedComments = updateCommentById(post.comments, commentId, (c) => {
                const isRetweeted = c.retweetedBy.includes(userId);
                return {
                    ...c,
                    retweets: isRetweeted ? c.retweets - 1 : c.retweets + 1,
                    retweetedBy: isRetweeted ? c.retweetedBy.filter(id => id !== userId) : [...c.retweetedBy, userId],
                };
            });
            return { ...post, comments: updatedComments };
        }));
    }, [updateCommentById]);

    const shareComment = React.useCallback((postId: number, commentId: number) => {
        setPosts(prev => prev.map(post => {
            if (post.id !== postId) return post;
            const updatedComments = updateCommentById(post.comments, commentId, (c) => ({
                ...c,
                shares: c.shares + 1,
            }));
            return { ...post, comments: updatedComments };
        }));
    }, [updateCommentById]);

    // Context value object containing all state and actions
    const value: PostContextType = {
        posts,
        deletePost,
        addPost,
        toggleLike,
        toggleRetweet,
        sharePost,
        addComment,
        addReply,
        toggleCommentLike,
        toggleCommentRetweet,
        shareComment,
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
