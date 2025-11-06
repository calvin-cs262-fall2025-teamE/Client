/**
 * Common Styles - Shared styling definitions for the application
 *
 * This module contains reusable style definitions that are used across
 * multiple components. It helps maintain consistency and reduces code
 * duplication in the styling layer.
 * 
 * Copied from lab 05, this file did not specify an author
 */

import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    listPadding: {
        padding: 16,
    },

    button: {
        padding: 16,
        borderRadius: 5,
        alignItems: 'center',
        flex: 1,
    },
    primaryButton: {
        backgroundColor: '#FF9898',
    },
    dangerButton: {
        backgroundColor: '#FF3B30',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },

    headerStyle: {
        backgroundColor: '#FF9176',
    },
});

// Header (non-style) configuration constants
export const headerConfig = {
    tintColor: 'white',
};
