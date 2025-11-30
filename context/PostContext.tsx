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
        content: 'This is the default post',},
        {id: 2,
        type: 'question',
        title: 'Is it true that there is a fire drill later today?',
        authorId: '4',
        communityId: 0,
        upvotes: 2,
        timePosted: new Date(),
        content: 'My roommate said this, but I have no idea if it\'s true.',},
        {id: 3,
        type: 'question',
        title: 'Have people had success making pound cake in these dorms?',
        authorId: '6',
        communityId: 2,
        upvotes: 1,
        timePosted: new Date(),
        content: 'Was wondering if the dorm kitchens have served people well in the past',},
        {id: 4,
        type: 'advice',
        title: 'Do not try to grow a tomato plant in the dorms',
        authorId: '9',
        communityId: 1,
        upvotes: 5,
        timePosted: new Date(2025, 9, 7, 4, 3, 24, 952),
        content: 'I tried it and it died',},
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
            },
            ...prevPosts,
        ]);
    }, []);

    // Context value object containing all state and actions
    const value: PostContextType = {
        posts,
        deletePost,
        addPost,
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
