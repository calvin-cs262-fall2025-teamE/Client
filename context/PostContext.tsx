/**
 * PostContext - React Context for managing application items
 *
 * Holds centralized states for which post is selected at any given moment, selected form a search list
 * Lots of this code was copied from the labs
 */

import React, { createContext, ReactNode, useState } from "react";


interface Post {
    id: number;
}

/**
 * This context type defines the shape of the context value that includes
 * the items array and a function to delete items by their unique identifier.
 *
 * @interface ItemContextType
 * @property items - Array of all available items
 * @property deleteItem - Function to remove an item by its ID
 */
interface PostContextType {
    posts: Post[]; // We'll work this in with our schema
    deletePost: (id: number) => void;
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
    // Initialize items from imported JSON data
    const [posts, setPosts] = useState<Post[]>([]);

    /**
     * Removes an item from the list by filtering out the matching ID
     *
     * Almost got this working, but it's only necessary for out posts
     */
    const deletePost = React.useCallback((id: number) => {
        setPosts((prevItems) => prevItems.filter((post) => post.id !== id));
    }, []); // Empty dependency array - function doesn't depend on any props or state

    // Context value object containing all state and actions
    const value: PostContextType = {
        posts,
        deletePost,
    };

    return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};