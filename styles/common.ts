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
    },
    background: {
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    listPadding: {
        padding: 16,
    },

    button: {
        padding: 16,
        borderRadius: 5,
        alignItems: 'center',
        flex: 1,
        paddingVertical: 16,
        marginTop: 8,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    helpCloseButton: {
        // Slightly modified from above for closing the help screen
        padding: 16,
        borderRadius: 5,
        alignItems: 'center',
        paddingVertical: 16,
        marginTop: 8,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
        backgroundColor: 'black',

        position: 'absolute',
        right: 22,
        bottom: 32,
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

    titleText: {
        fontSize: 28,
        textAlign: "left",
        marginBottom: 2,
        fontWeight: "700",
    },

    headerStyle: {
        backgroundColor: '#FF9176',
    },
    text_field: {
        padding: 14,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 12,
        fontSize: 16,
        minHeight: 50,
    },
    helpPage: {
        flex: 1,
        padding: 40,
        marginTop: 35, 
    },
    helpText: {
        fontSize: 20,
        marginBottom: 10,
    },
    helpTitle: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: '600',
    },
});
