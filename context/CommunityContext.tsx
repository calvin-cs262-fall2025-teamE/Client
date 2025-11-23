/**
 * CommunityContext - React Context for managing selected communities
 *
 * Holds centralized states for which community is being browsed.
 * Will later need to be updated to correctly use the data service
 */

import { Community } from '@/types/Community';
import React, {
    createContext, ReactNode, useContext, useState,
} from 'react';

/**
 * This context type defines the shape of the context value that includes
 * the items array and a function to delete items by their unique identifier.
 *
 * @interface CommunityContextType
 * @property items - Array of all available items
 * @property deleteItem - Function to remove an item by its ID
 */
interface CommunityContextType {
    communities: Community[]; // We'll work this in with our schema
    deleteCommunity: (id: number) => void;
}

/**
 * This creates and exports the context for item state management.
 * It returns undefined if used outside of ItemProvider, which allows
 * components to detect if they're properly wrapped.
 */
export const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

/**
 * This creates and exports the provider component.
 *
 */
export const CommunityProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Initialize items from imported JSON data
  const [communities, setCommunities] = useState<Community[]>([{
    communityID: 0,
    communityName: 'RVD',
    description: 'The Rooks-Van Dellen Hall at Calvin University',
    location: 'Calvin University Knollcrest Campus',
  },
  {
    communityID: 1,
    communityName: 'BHT',
    description: 'The Bolt-Heyns-Timmer Hall at Calvin University',
    location: 'Calvin University Knollcrest Campus',
  },
  {
    communityID: 2,
    communityName: 'BV',
    description: 'The Beets-Veenstra Hall at Calvin University',
    location: 'Calvin University Knollcrest Campus',
  },
  {
    communityID: 3,
    communityName: 'KE',
    description: 'The Knollcrest-East appartments at Calvin University',
    location: 'Calvin University Knollcrest Campus',
  },
  ]); // Hard-coded default communities

  /**
     * Removes an item from the list by filtering out the matching ID
     *
     * Almost got this working, but it's only necessary for out Communitys
     */
  const deleteCommunity = React.useCallback((id: number) => {
    setCommunities((prevItems) => prevItems.filter((community) => community.communityID !== id));
  }, []); // Empty dependency array - function doesn't depend on any props or state

  // Context value object containing all state and actions
  const value: CommunityContextType = {
    communities,
    deleteCommunity,
  };

  return <CommunityContext.Provider value={value}>{children}</CommunityContext.Provider>;
};

/**
 * Custom hook to safely access CommunityContext
 *
 * It handles the null check and provides a helpful error message if used
 * outside of ItemProvider. This eliminates boilerplate in components.
 *
 * Copied from lab05
 *
 * @returns The context value containing items and deleteItem function
 * @throws Error if used outside of ItemProvider
 */
export const useCommunityContext = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunityContext must be used within an CommunityProvider');
  }
  return context;
};
