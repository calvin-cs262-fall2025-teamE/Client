import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Alert,
  Pressable
} from 'react-native';
import { Feather } from '@expo/vector-icons';

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
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 12,
    backgroundColor: LIGHT_BLUE,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: DARK_BLUE,
  },
  gearButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DARK_BLUE,
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  editButton: {
    backgroundColor: DARK_BLUE,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: 8,
  },
  editButtonText: {
    color: WHITE,
    fontWeight: 'bold',
    fontSize: 15,
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  tabItem: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  tabItemActive: {
    backgroundColor: WHITE,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 16,
    color: DARK_BLUE,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#2563EB',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: LIGHT_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarSmallEmoji: {
    fontSize: 20,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: DARK_BLUE,
  },
  cardTimestamp: {
    fontSize: 12,
    color: '#737373',
  },
  cardBody: {
    fontSize: 15,
    color: '#374151',
  },
  communityBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: LIGHT_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  communityBadgeText: {
    fontSize: 18,
    color: DARK_BLUE,
    fontWeight: 'bold',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 16,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  settingsList: {
    maxHeight: '80%',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  settingsLabel: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
});

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<'Posts' | 'Communities'>('Posts');
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  const settingsOptions: Array<{
    id: string;
    icon: keyof typeof Feather.glyphMap;
    label: string;
  }> = [
    { id: 'edit', icon: 'edit-2', label: 'Edit Profile' },
    { id: 'saved', icon: 'bookmark', label: 'Saved Posts' },
    { id: 'activity', icon: 'activity', label: 'My Activity' },
    { id: 'message', icon: 'message-circle', label: 'Comments' },
    { id: 'bell', icon: 'bell', label: 'Notifications' },
    { id: 'lock', icon: 'lock', label: 'Privacy Settings' },
    { id: 'help-circle', icon: 'help-circle', label: 'Help / Support' },
    { id: 'info', icon: 'info', label: 'About' },
    { id: 'log-out', icon: 'log-out', label: 'Log Out' },
  ];

  const handleSettingsOption = (id: string) => {
    setIsSettingsVisible(false);
    console.log(`${id} option clicked`);
    if (id === 'log-out') {
      Alert.alert('Log Out', 'Are you sure you want to log out?');
    } else {
      Alert.alert(settingsOptions.find(opt => opt.id === id)?.label || '', 'This feature is coming soon!');
    }
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
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.gearButton}
          onPress={() => setIsSettingsVisible(true)}
        >
          <Feather name="settings" size={24} color="#374151" />
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={isSettingsVisible}
        onRequestClose={() => setIsSettingsVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsSettingsVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <ScrollView style={styles.settingsList}>
              {settingsOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.settingsItem}
                  onPress={() => handleSettingsOption(option.id)}
                  activeOpacity={0.7}
                >
                  <Feather name={option.icon} size={22} color="#374151" />
                  <Text style={styles.settingsLabel}>{option.label}</Text>
                  <Feather name="chevron-right" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}