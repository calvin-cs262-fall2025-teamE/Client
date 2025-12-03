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
    // toggleLike: (postId: number, userId: number) => void;
    // toggleRetweet: (postId: number, userId: number) => void;
    // sharePost: (postId: number) => void;
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
    // Initialize items as hard-coded for testing purposes
    // When we get this from the data service we should order them by date
    const [posts, setPosts] = useState<Post[]>([
        {id: 1,
        type: 'question',
        title: 'Where\'s the best study spot?',
        authorId: '0',
        communityId: 0,
        upvotes: 16,
        timePosted: new Date(2024, 11, 5, 13, 12, 51, 234),
        content: 'This is the default post',
        comments: [],},
        {id: 2,
        type: 'question',
        title: 'Is it true that there is a fire drill later today?',
        authorId: '4',
        communityId: 0,
        upvotes: 2,
        timePosted: new Date(),
        content: 'My roommate said this, but I have no idea if it\'s true.',
    comments: [],},
        {id: 3,
        type: 'question',
        title: 'Have people had success making pound cake in these dorms?',
        authorId: '6',
        communityId: 2,
        upvotes: 1,
        timePosted: new Date(),
        content: 'Was wondering if the dorm kitchens have served people well in the past',
        comments: [],},
        {id: 4,
        type: 'advice',
        title: 'Do not try to grow a tomato plant in the dorms',
        authorId: '9',
        communityId: 1,
        upvotes: 5,
        timePosted: new Date(2025, 9, 7, 4, 3, 24, 952),
        content: 'I tried it and it died',
        comments: [],},
    ])
    // Global comment/reply ID sequence to avoid collisions across nested threads
    const [commentIdSeq, setCommentIdSeq] = useState<number>(1);

    const nextCommentId = React.useCallback(() => {
        // Simple monotonically increasing counter; unique within session
        const id = commentIdSeq + 1;
        setCommentIdSeq(id);
        return id;
    }, [commentIdSeq]);
    // Initialize items from imported JSON data

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

    // A LOT OF THIS CODE IS GOOD, BUT COMMENTED OUT FOR THE SAKE OF GETTING USER TESTS TO WORK:

    /**
     * Toggles like status for a post by a specific user
     */
    // const toggleLike = React.useCallback((postId: number, userId: number) => {
    //     console.log('toggleLike called:', postId, userId);
    //     setPosts((prevPosts) => {
    //         const newPosts = prevPosts.map(post => {
    //             if (post.id === postId) {
    //                 const isLiked = post.likedBy.includes(userId);
    //                 console.log('Post found, isLiked:', isLiked);
    //                 return {
    //                     ...post,
    //                     likes: isLiked ? post.likes - 1 : post.likes + 1,
    //                     likedBy: isLiked 
    //                         ? post.likedBy.filter(id => id !== userId)
    //                         : [...post.likedBy, userId]
    //                 };
    //             }
    //             return post;
    //         });
    //         console.log('Updated posts:', newPosts);
    //         return newPosts;
    //     });
    // }, []);

    /**
     * Toggles retweet status for a post by a specific user
     */
    // const toggleRetweet = React.useCallback((postId: number, userId: number) => {
    //     console.log('toggleRetweet called:', postId, userId);
    //     setPosts((prevPosts) => {
    //         const newPosts = prevPosts.map(post => {
    //             if (post.id === postId) {
    //                 const isRetweeted = post.retweetedBy.includes(userId);
    //                 console.log('Post found, isRetweeted:', isRetweeted);
    //                 return {
    //                     ...post,
    //                     retweets: isRetweeted ? post.retweets - 1 : post.retweets + 1,
    //                     retweetedBy: isRetweeted 
    //                         ? post.retweetedBy.filter(id => id !== userId)
    //                         : [...post.retweetedBy, userId]
    //                 };
    //             }
    //             return post;
    //         });
    //         console.log('Updated posts:', newPosts);
    //         return newPosts;
    //     });
    // }, []);

    // /**
    //  * Increments share count for a post
    //  */
    // const sharePost = React.useCallback((postId: number) => {
    //     setPosts((prevPosts) => prevPosts.map(post => {
    //         if (post.id === postId) {
    //             return {
    //                 ...post,
    //                 shares: post.shares + 1
    //             };
    //         }
    //         return post;
    //     }));
    // }, []);

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
        // toggleLike,
        // toggleRetweet,
        // sharePost,
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
