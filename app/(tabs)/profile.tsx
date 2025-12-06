import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../AuthContext';

export default function AboutScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { theme, themeMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'Posts' | 'Communities'>('Posts');

  const handleSignOut = () => {
    signOut();
    router.replace('/login');
  };

  const posts = [
    { id: '1', user: 'User A', text: 'Excited to join the Calvin Community Hub!', time: '2h ago' },
    { id: '2', user: 'User B', text: 'Looking forward to connecting with new communities.', time: '1d ago' },
    { id: '3', user: 'User C', text: 'Sharing a quick update on my latest project.', time: '3d ago' },
  ];

  const communities = [
    { id: '1', name: 'Calvin Developers', members: 128 },
    { id: '2', name: 'Calvin Designers', members: 76 },
    { id: '3', name: 'Calvin Entrepreneurs', members: 54 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={theme.colors.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      >
        <View style={styles.headerRow}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Profile</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              activeOpacity={0.7} 
              style={[styles.iconButton, { backgroundColor: theme.colors.chip }]} 
              onPress={toggleTheme}
            >
              <Ionicons 
                name={themeMode === 'dark' ? 'sunny' : 'moon'} 
                size={20} 
                color={theme.colors.primary} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              activeOpacity={0.7} 
              style={[styles.signOutButton, { backgroundColor: theme.colors.chip }]} 
              onPress={handleSignOut}
            >
              <Ionicons name="log-out-outline" size={22} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.profileSection}>
            <View style={[styles.avatarLarge, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              {user?.profileImage ? (
                <Image 
                  source={{ uri: user.profileImage }} 
                  style={styles.avatarImage}
                />
              ) : (
                <Ionicons name="person" size={48} color={theme.colors.text} />
              )}
            </View>
            <Text style={[styles.username, { color: theme.colors.text }]}>
              {user ? `${user.firstName} ${user.lastName}` : 'User Name'}
            </Text>
            <Text style={[styles.bio, { color: theme.colors.textSecondary }]} numberOfLines={2}>
              {user?.email || 'Short bio goes here. This is a placeholder for a quick introduction.'}
            </Text>
            <TouchableOpacity 
              activeOpacity={0.8} 
              style={[styles.editButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => router.push('/edit-profile')}
            >
              <Ionicons name="create-outline" size={18} color="white" style={{ marginRight: 6 }} />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.tabsRow, { borderBottomColor: theme.colors.border }]}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.tabItem, activeTab === 'Posts' && { borderBottomColor: theme.colors.primary, borderBottomWidth: 2 }]}
              onPress={() => setActiveTab('Posts')}
            >
              <Text style={[styles.tabText, { color: activeTab === 'Posts' ? theme.colors.text : theme.colors.textSecondary }]}>Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.tabItem, activeTab === 'Communities' && { borderBottomColor: theme.colors.primary, borderBottomWidth: 2 }]}
              onPress={() => setActiveTab('Communities')}
            >
              <Text style={[styles.tabText, { color: activeTab === 'Communities' ? theme.colors.text : theme.colors.textSecondary }]}>Communities</Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'Posts' ? (
            <View style={styles.listContainer}>
              {posts.map((post) => (
                <View key={post.id} style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.avatarSmall, { backgroundColor: theme.colors.chip }]}>
                      <Ionicons name="person" size={18} color={theme.colors.text} />
                    </View>
                    <View style={styles.cardHeaderText}>
                      <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{post.user}</Text>
                      <Text style={[styles.cardTimestamp, { color: theme.colors.textSecondary }]}>{post.time}</Text>
                    </View>
                  </View>
                  <Text style={[styles.cardBody, { color: theme.colors.text }]}>{post.text}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.listContainer}>
              {communities.map((c) => (
                <TouchableOpacity key={c.id} style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.communityBadge, { backgroundColor: theme.colors.chip }]}>
                      <Ionicons name="people" size={20} color={theme.colors.primary} />
                    </View>
                    <View style={styles.cardHeaderText}>
                      <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{c.name}</Text>
                      <Text style={[styles.cardTimestamp, { color: theme.colors.textSecondary }]}>{c.members} members</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
  signOutButton: {
    padding: 8,
    borderRadius: 8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  username: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: '700',
  },
  bio: {
    marginTop: 6,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  editButton: {
    marginTop: 14,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  tabsRow: {
    flexDirection: 'row',
    marginTop: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    marginTop: 16,
    gap: 12,
  },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardTimestamp: {
    marginTop: 2,
    fontSize: 12,
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  communityBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  draftCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    flexDirection: 'column',
    justifyContent: 'center',
    elevation: 2,
  },
  draftTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  draftText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  draftMeta: {
    fontSize: 12,
    marginTop: 4,
  },
  draftDeleteBtn: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderRadius: 12,
    borderStyle: 'dashed',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
});