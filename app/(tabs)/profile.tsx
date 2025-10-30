import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AboutScreen() {
  const [activeTab, setActiveTab] = useState<'Posts' | 'Communities'>('Posts');

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
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity activeOpacity={0.7} style={styles.gearButton}>
          <Text style={styles.gearIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
          <Text style={styles.username}>User Name</Text>
          <Text style={styles.bio} numberOfLines={2}>
            Short bio goes here. This is a placeholder for a quick introduction.
          </Text>
          <TouchableOpacity activeOpacity={0.8} style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabsRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.tabItem, activeTab === 'Posts' && styles.tabItemActive]}
            onPress={() => setActiveTab('Posts')}
          >
            <Text style={[styles.tabText, activeTab === 'Posts' && styles.tabTextActive]}>Posts</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.tabItem, activeTab === 'Communities' && styles.tabItemActive]}
            onPress={() => setActiveTab('Communities')}
          >
            <Text style={[styles.tabText, activeTab === 'Communities' && styles.tabTextActive]}>Communities</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'Posts' ? (
          <View style={styles.listContainer}>
            {posts.map((post) => (
              <View key={post.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.avatarSmall}>
                    <Text style={styles.avatarSmallEmoji}>👤</Text>
                  </View>
                  <View style={styles.cardHeaderText}>
                    <Text style={styles.cardTitle}>{post.user}</Text>
                    <Text style={styles.cardTimestamp}>{post.time}</Text>
                  </View>
                </View>
                <Text style={styles.cardBody}>{post.text}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.listContainer}>
            {communities.map((c) => (
              <View key={c.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.communityBadge}>
                    <Text style={styles.communityBadgeText}>#</Text>
                  </View>
                  <View style={styles.cardHeaderText}>
                    <Text style={styles.cardTitle}>{c.name}</Text>
                    <Text style={styles.cardTimestamp}>{c.members} members</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const LIGHT_BLUE = '#ADD8E6';
const DARK_BLUE = '#003366';
const WHITE = '#FFFFFF';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_BLUE,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: DARK_BLUE,
  },
  gearButton: {
    padding: 8,
    borderRadius: 999,
  },
  gearIcon: {
    fontSize: 20,
    color: DARK_BLUE,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: DARK_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 44,
    color: WHITE,
  },
  username: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: '700',
    color: DARK_BLUE,
  },
  bio: {
    marginTop: 6,
    fontSize: 14,
    color: DARK_BLUE,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  editButton: {
    marginTop: 12,
    backgroundColor: DARK_BLUE,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  editButtonText: {
    color: WHITE,
    fontWeight: '600',
  },
  tabsRow: {
    flexDirection: 'row',
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_BLUE,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: DARK_BLUE,
  },
  tabText: {
    fontSize: 16,
    color: 'rgba(0, 51, 102, 0.65)',
    fontWeight: '600',
  },
  tabTextActive: {
    color: DARK_BLUE,
  },
  listContainer: {
    marginTop: 12,
    gap: 12,
  },
  card: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: LIGHT_BLUE,
    borderRadius: 10,
    padding: 12,
    // Subtle shadow (Android + iOS)
    shadowColor: DARK_BLUE,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
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
    backgroundColor: DARK_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarSmallEmoji: {
    fontSize: 18,
    color: WHITE,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: DARK_BLUE,
  },
  cardTimestamp: {
    marginTop: 2,
    fontSize: 12,
    color: 'rgba(0, 51, 102, 0.7)',
  },
  cardBody: {
    fontSize: 14,
    color: DARK_BLUE,
  },
  communityBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: LIGHT_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  communityBadgeText: {
    color: WHITE,
    fontWeight: '900',
  },
});