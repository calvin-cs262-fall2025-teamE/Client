import { useCommunityContext } from '@/context/CommunityContext';
import { usePostContext } from '@/context/PostContext';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../AuthContext';

export default function AboutScreen() {
  const router = useRouter();
  const { user, signOut, updateUser } = useAuth();
  const { theme, themeMode, toggleTheme } = useTheme();
  const { posts } = usePostContext();
  const { communities } = useCommunityContext();
  const [activeTab, setActiveTab] = useState<'Posts' | 'Communities'>('Posts');

  //Logic for on-line help:
  const [helpVisible, setHelpVisible] = useState(false);
  
  const userPosts = useMemo(() => {
    if (!user) return [];
    return posts.filter((p) => p.authorId === user.id);
  }, [posts, user]);

  const [joinedCommunities, setJoinedCommunities] = useState(() => {
    if (!user?.communities) return [];
    return communities.filter((c) => user.communities!.includes(c.communityID.toString()));
  });

  React.useEffect(() => {
    if (!user?.communities) {
      setJoinedCommunities([]);
    } else {
      setJoinedCommunities(communities.filter((c) => user.communities!.includes(c.communityID.toString())));
    }
  }, [user, communities]);

  const handleLeave = (communityID: number) => {
    if (!user) return;
    const updated = (user.communities || []).filter((c) => c !== communityID.toString());
    updateUser({ ...user, communities: updated });
    setJoinedCommunities((prev) => prev.filter((c) => c.communityID !== communityID));
  };

  const handleJoin = (communityID: number) => {
    if (!user) return;
    const updated = Array.from(new Set([...(user.communities || []), communityID.toString()]));
    updateUser({ ...user, communities: updated });
  };

  const handleSignOut = () => {
    signOut();
    router.replace('/login');
  };
  return (
    <LinearGradient
      colors={theme.colors.background as [string, string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Profile
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="help-circle-outline" size={24} color={theme.colors.primary} onPress={() => setHelpVisible(true)}/>
            </TouchableOpacity>
          </Text>
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
              {userPosts.length === 0 ? (
                <View style={[styles.emptyState, { borderColor: theme.colors.border }]}> 
                  <Ionicons name="document-text-outline" size={32} color={theme.colors.textSecondary} />
                  <Text style={[styles.emptyStateText, { color: theme.colors.text }]}>No posts yet</Text>
                  <Text style={[styles.emptyStateSubtext, { color: theme.colors.textSecondary }]}>Share your first post to see it here.</Text>
                </View>
              ) : (
                  userPosts.map((post) => {
                    const postCommunity = communities.find((c) => c.communityID === post.communityId);
                    return (
                      <TouchableOpacity
                        key={post.id}
                        style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                        activeOpacity={0.85}
                        onPress={() => {
                          if (postCommunity) {
                            router.push({ pathname: `/CommunityPage`, params: { id: postCommunity.communityID, postId: post.id } });
                          }
                        }}
                      >
                        <View style={styles.cardHeader}>
                          <View style={[styles.avatarSmall, { backgroundColor: theme.colors.chip }]}> 
                            <Ionicons name="person" size={18} color={theme.colors.text} />
                          </View>
                          <View style={styles.cardHeaderText}>
                            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{post.title}</Text>
                            <Text style={[styles.cardTimestamp, { color: theme.colors.textSecondary }]}>{new Date(post.timePosted).toLocaleString()}</Text>
                          </View>
                        </View>
                        <Text style={[styles.cardBody, { color: theme.colors.text }]}>{post.content}</Text>
                        {postCommunity && (
                          <View style={[styles.communityTag, { backgroundColor: theme.colors.chip, borderColor: theme.colors.border }]}>
                            <Ionicons name="people" size={12} color={theme.colors.primary} style={{ marginRight: 4 }} />
                            <Text style={[styles.communityTagText, { color: theme.colors.text }]} numberOfLines={1}>
                              {postCommunity.communityName}
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })
              )}
            </View>
          ) : (
            <View style={styles.listContainer}>
              {joinedCommunities.length === 0 ? (
                <View style={[styles.emptyState, { borderColor: theme.colors.border }]}> 
                  <Ionicons name="people-outline" size={32} color={theme.colors.textSecondary} />
                  <Text style={[styles.emptyStateText, { color: theme.colors.text }]}>No communities yet</Text>
                  <Text style={[styles.emptyStateSubtext, { color: theme.colors.textSecondary }]}>Join a community to see it here.</Text>
                </View>
              ) : (
                joinedCommunities.map((c) => {
                  const isMember = user?.communities?.includes(c.communityID.toString());
                  return (
                    <TouchableOpacity 
                      key={c.communityID} 
                      style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                      onPress={() => router.push({ pathname: `/CommunityPage`, params: { id: c.communityID } })}
                    >
                      <View style={styles.cardHeader}>
                        <View style={[styles.communityBadge, { backgroundColor: theme.colors.chip }]}> 
                          <Ionicons name="people" size={20} color={theme.colors.primary} />
                        </View>
                        <View style={styles.cardHeaderText}>
                          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{c.communityName}</Text>
                          <Text style={[styles.cardTimestamp, { color: theme.colors.textSecondary }]}>{c.description}</Text>
                        </View>
                        <View style={styles.cardRight}>
                          {isMember ? (
                            <TouchableOpacity
                              style={[styles.leaveButton, { borderColor: theme.colors.border }]}
                              onPress={(e) => {
                                e.stopPropagation();
                                handleLeave(c.communityID);
                              }}
                            >
                              <Text style={[styles.leaveText, { color: theme.colors.textSecondary }]}>Leave</Text>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              style={[styles.joinButton, { backgroundColor: theme.colors.primary }]}
                              onPress={(e) => {
                                e.stopPropagation();
                                handleJoin(c.communityID);
                              }}
                            >
                              <Text style={[styles.joinText, { color: '#FFF' }]}>Join</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          )}
        </ScrollView>

        {/* On-line help popup */}
        <Modal
          visible={helpVisible}
          onRequestClose={() => {
            setHelpVisible(!helpVisible);
        }}>
          <View style={commonStyles.helpPage}>
            <Text style={commonStyles.helpTitle}>Your Profile Page</Text>
            <Text style={commonStyles.helpText}>
              On this page you you can change any settings related to the app or your account. You can also see your previous posts and a list of your communities
            </Text>
            <Text style={commonStyles.helpText}>
              - To change anything about your profile, tap the 'edit profile' button
            </Text>
            <Text style={commonStyles.helpText}>
            - To see your communities, select the posts tab by tapping it
            </Text>
            <Text style={commonStyles.helpText}>
            - To see your communities, select the communties tab by tapping it
            </Text>
            <Text style={commonStyles.helpText}>
              - To switch to {themeMode === 'dark' ? 'light' : 'dark'} mode, tap the <Ionicons name={themeMode === 'dark' ? 'sunny' : 'moon'} size={18} /> icon in the upper left corner
            </Text>
            <Text style={commonStyles.helpText}>
              - To exit the app, tap the <Ionicons name="log-out-outline" size={18} /> icon in the upper left
            </Text>
            
            <TouchableOpacity
            style={[commonStyles.helpCloseButton, {backgroundColor: 'black'}]}
            onPress={() => setHelpVisible(!helpVisible)}
            >
              <Text style={[commonStyles.buttonText, {fontSize: 20}]}>Hide Help</Text>
            </TouchableOpacity>
          </View>
        </Modal>
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
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    padding: 6,
    borderRadius: 8,
  },
  signOutButton: {
    padding: 10,
    borderRadius: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  avatarLarge: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarImage: {
    width: 104,
    height: 104,
    borderRadius: 52,
  },
  username: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  bio: {
    marginTop: 8,
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 21,
  },
  editButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#e63946",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  tabsRow: {
    flexDirection: 'row',
    marginTop: 8,
    borderBottomWidth: 1,
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
  communityTag: {
    marginTop: 10,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  communityTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  communityPill: {
    marginTop: 10,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  communityPillText: {
    fontSize: 13,
    fontWeight: '600',
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
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  leaveButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  leaveText: {
    fontSize: 13,
    fontWeight: '600',
  },
  joinButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  joinText: {
    fontSize: 13,
    fontWeight: '700',
  },
});