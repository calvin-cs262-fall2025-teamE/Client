import { useCommunityContext } from '@/context/CommunityContext';
import { usePostContext } from '@/context/PostContext';
import { useTheme } from '@/context/ThemeContext';
import { Community } from '@/types/Community';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../AuthContext';

interface buttonProps {
  label?: string,
  selected?: boolean,
  onSelect: Function,
  theme: any,
}
// Implementation modified from on this webpage
// https://www.geeksforgeeks.org/react-native/how-to-implement-radio-button-in-react-native/
const CustomRadioButton = (props: buttonProps) => (
  <TouchableOpacity
    style={[
      {
        backgroundColor: props.selected ? props.theme.colors.primary : props.theme.colors.chip,
        borderColor: props.selected ? props.theme.colors.primary : props.theme.colors.border,
      },
      styles.type_button
    ]}
    onPress={() => props.onSelect()}
  >
    <Text
      style={[
        { color: props.selected ? '#FFF' : props.theme.colors.text }
      ]}
    >
      {props.label || ""}
    </Text>
  </TouchableOpacity>
);

export default function AboutScreen() {
  const { theme } = useTheme();
  const { addPost } = usePostContext();
  const router = useRouter();

  // UI information:
  const [currentSelected, setCurrentSelected] = useState(0);
  const [questionText, setQuestionText] = useState('');
  const [detailsText, setDetailsText] = useState('');
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [drafts, setDrafts] = useState<any[]>([]);

  // Contextual information:
  const { user } = useAuth();

  const { id } = useLocalSearchParams();
  const { communities } = useCommunityContext();
  const [selectedCommunity, setSelectedCommunity] = useState<Community | undefined>(undefined);

  // Drafts key
  const DRAFTS_KEY = 'postDrafts';

  // Load drafts on mount
  useEffect(() => {
    const loadDrafts = async () => {
      try {
        const d = await AsyncStorage.getItem(DRAFTS_KEY);
        if (d) setDrafts(JSON.parse(d));
        else setDrafts([]);
      } catch {
        setDrafts([]);
      }
    };
    loadDrafts();
  }, [communities]);

  // Save draft handler
  const handleSaveDraft = async () => {
    try {
      const draftData = {
        id: Date.now().toString(),
        questionText,
        detailsText,
        selectedCommunityId: selectedCommunity?.communityID,
        currentSelected,
        savedAt: new Date().toISOString(),
      };
      const updatedDrafts = [...drafts, draftData];
      await AsyncStorage.setItem(DRAFTS_KEY, JSON.stringify(updatedDrafts));
      setDrafts(updatedDrafts);
      Alert.alert('Draft Saved', 'Your draft has been saved.');
    } catch (e) {
      Alert.alert('Error', 'Failed to save draft.');
    }
  };

  // Clear all drafts (on delete or post)
  const clearDrafts = async () => {
    try { 
      await AsyncStorage.removeItem(DRAFTS_KEY); 
      setDrafts([]);
    } catch {}
  };

  // Delete individual draft
  const deleteDraft = async (draftId: string) => {
    try {
      const updatedDrafts = drafts.filter(d => d.id !== draftId);
      await AsyncStorage.setItem(DRAFTS_KEY, JSON.stringify(updatedDrafts));
      setDrafts(updatedDrafts);
    } catch {}
  };

  // Load individual draft into form
  const loadDraft = (draft: any) => {
    setQuestionText(draft.questionText || '');
    setDetailsText(draft.detailsText || '');
    setCurrentSelected(draft.currentSelected || 0);
    if (draft.selectedCommunityId !== undefined && communities.length > 0) {
      const comm = communities.find(c => c.communityID === draft.selectedCommunityId);
      if (comm) setSelectedCommunity(comm);
    }
  };

  // Set the community from URL params when component mounts or id changes
  useEffect(() => {
    if (id !== undefined) {
      const community = communities.find(comm => comm.communityID.toString() === id);
      if (community) {
        setSelectedCommunity(community);
      }
    }
  }, [id, communities]);

  const handlePost = async () => {
    // Validate inputs
    if (!questionText.trim()) {
      Alert.alert('Missing Information', 'Please enter your ' + (currentSelected === 0 ? 'question' : 'advice'));
      return;
    }

    if (selectedCommunity?.communityID === undefined || selectedCommunity?.communityID === null) {
      Alert.alert('Missing Information', 'Please select a community');
      return;
    }

    // Create the post
    addPost({
      type: currentSelected === 0 ? 'question' : 'advice',
      title: questionText.trim(),
      content: detailsText.trim() || questionText.trim(),
      authorId: user!.id,
      communityId: selectedCommunity.communityID,
      upvotes: 0,
      likes: 0,
      retweets: 0,
      shares: 0,
      likedBy: [],
      retweetedBy: [],
      comments: [],
    });

    // Clear form
    setQuestionText('');
    setDetailsText('');
    setCurrentSelected(0);
    setSelectedCommunity(undefined);

    // Show success and navigate
    Alert.alert('Success!', 'Your post has been created', [
      {
        text: 'OK',
        onPress: () => router.back(),
      },
    ]);
  };

  const handleDelete = () => {
    setQuestionText('');
    setDetailsText('');
    setSelectedCommunity(undefined);
    setCurrentSelected(0);
    Alert.alert('Cleared', 'Your current post has been cleared.');
  };

  const handleCommunitySelect = (community: Community) => {
    setSelectedCommunity(community);
    setDropdownVisible(false);
  }

  return (
    <LinearGradient
      colors={theme.colors.background as [string, string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Create Post</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Share your question or advice</Text>
          </View>

          {/* Community Selector */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Community</Text>
            <TouchableOpacity
              onPress={() => setDropdownVisible(true)}
              style={[styles.communitySelector, { 
                backgroundColor: theme.colors.surfaceElev,
                borderColor: theme.colors.border 
              }]}
            >
              <View style={styles.communitySelectorContent}>
                <Ionicons 
                  name="people" 
                  size={20} 
                  color={selectedCommunity ? theme.colors.primary : theme.colors.textSecondary} 
                />
                <Text style={[
                  styles.communitySelectorText,
                  { color: selectedCommunity ? theme.colors.text : theme.colors.textSecondary }
                ]}>
                  {selectedCommunity?.communityName || "Select a community"}
                </Text>
              </View>
              <Ionicons 
                name="chevron-down" 
                size={20} 
                color={theme.colors.textSecondary} 
              />
            </TouchableOpacity>
          </View>

          {/* Community Modal */}
          <Modal
            visible={isDropdownVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setDropdownVisible(false)}
          >
            <TouchableOpacity 
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setDropdownVisible(false)}
            >
              <TouchableOpacity 
                activeOpacity={1}
                onPress={(e) => e.stopPropagation()}
              >
                <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                  <View style={styles.modalHeader}>
                    <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Select Community</Text>
                    <TouchableOpacity onPress={() => setDropdownVisible(false)}>
                      <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={communities}
                    keyExtractor={(item) => item.communityID.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => handleCommunitySelect(item)}
                        style={[
                          styles.communityOption,
                          { 
                            backgroundColor: selectedCommunity?.communityID === item.communityID 
                              ? `${theme.colors.primary}20` 
                              : 'transparent',
                            borderColor: theme.colors.border
                          }
                        ]}
                      >
                        <View style={styles.communityOptionContent}>
                          <Ionicons 
                            name="people" 
                            size={18} 
                            color={selectedCommunity?.communityID === item.communityID 
                              ? theme.colors.primary 
                              : theme.colors.textSecondary
                            } 
                          />
                          <Text style={[
                            styles.communityOptionText,
                            { color: theme.colors.text }
                          ]}>
                            {item.communityName}
                          </Text>
                        </View>
                        {selectedCommunity?.communityID === item.communityID && (
                          <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                        )}
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Post Type</Text>
            <View style={styles.button_container}>
              <CustomRadioButton
                label='Question'
                selected={currentSelected === 0}
                onSelect={() => setCurrentSelected(0)}
                theme={theme}
              />
              <CustomRadioButton
                label='Advice'
                selected={currentSelected === 1}
                onSelect={() => setCurrentSelected(1)}
                theme={theme}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Your {currentSelected === 0 ? 'Question' : 'Advice'}</Text>
            <TextInput
              placeholder={currentSelected === 0 ? 'What is your question?' : 'What is your advice?'}
              placeholderTextColor={theme.colors.textSecondary}
              style={[styles.text_field, { backgroundColor: theme.colors.surfaceElev, borderColor: theme.colors.border, color: theme.colors.text }]}
              value={questionText}
              onChangeText={setQuestionText}
              multiline
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Details</Text>
            <TextInput
              placeholder='Any additional context or information?'
              placeholderTextColor={theme.colors.textSecondary}
              style={[styles.text_field, styles.text_field_large, { backgroundColor: theme.colors.surfaceElev, borderColor: theme.colors.border, color: theme.colors.text }]}
              value={detailsText}
              onChangeText={setDetailsText}
              multiline
            />
          </View>

          <View style={[styles.button_container, { marginBottom: 20 }]}>
            <TouchableOpacity
              style={[styles.action_button, { backgroundColor: theme.colors.surfaceElev, borderColor: theme.colors.border }]}
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.action_button_text, { color: theme.colors.textSecondary }]}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.action_button, { backgroundColor: theme.colors.surfaceElev, borderColor: theme.colors.border }]}
              onPress={handleSaveDraft}
            >
              <Ionicons name="bookmark-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.action_button_text, { color: theme.colors.textSecondary }]}>Save Draft</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.post_button, { backgroundColor: theme.colors.primary}]}
            onPress={handlePost}
          >
            <Ionicons name="send" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.button_text}>Post</Text>
          </TouchableOpacity>

          {/* Saved Drafts Section */}
          <View style={{ marginTop: 32, marginBottom: 20 }}>
            <Text style={[styles.label, { color: theme.colors.text, marginBottom: 12 }]}>Saved Drafts</Text>
            {drafts.length > 0 ? (
              <View style={{ gap: 12 }}>
                {drafts.map((draft) => (
                  <TouchableOpacity
                    key={draft.id}
                    style={[styles.draftCard, { 
                      backgroundColor: theme.colors.surfaceElev, 
                      borderColor: theme.colors.primary,
                      borderWidth: 1.5,
                      borderRadius: 12,
                      padding: 16,
                    }]}
                    onPress={() => loadDraft(draft)}
                    activeOpacity={0.7}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                      <Ionicons name="document-text" size={20} color={theme.colors.primary} style={{ marginRight: 10 }} />
                      <Text style={[styles.draftTitle, { color: theme.colors.text, fontSize: 16, flex: 1 }]} numberOfLines={1}>
                        {draft.questionText || 'Untitled draft'}
                      </Text>
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          deleteDraft(draft.id);
                        }}
                        style={{ padding: 4 }}
                      >
                        <Ionicons name="trash-outline" size={18} color={theme.colors.textSecondary} />
                      </TouchableOpacity>
                    </View>
                    {draft.detailsText && (
                      <Text style={[styles.draftText, { color: theme.colors.textSecondary, fontSize: 14 }]} numberOfLines={2}>
                        {draft.detailsText}
                      </Text>
                    )}
                    <Text style={[styles.draftMeta, { color: theme.colors.textSecondary, fontSize: 12, marginTop: 8 }]}>
                      {new Date(draft.savedAt).toLocaleString()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={{ 
                alignItems: 'center', 
                justifyContent: 'center', 
                paddingVertical: 32,
                paddingHorizontal: 24,
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: 12,
                borderStyle: 'dashed',
              }}>
                <Ionicons name="document-outline" size={40} color={theme.colors.textSecondary} />
                <Text style={{ color: theme.colors.textSecondary, fontSize: 14, marginTop: 8, textAlign: 'center' }}>No saved drafts</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  hero: {
    width: "100%",
    gap: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 14,
    letterSpacing: 0.3,
  },
  button_container: {
    flexDirection: 'row',
    gap: 14,
  },
  type_button: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  communitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  communitySelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  communitySelectorText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '70%',
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  communityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1.5,
  },
  communityOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  communityOptionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  text_field: {
    padding: 18,
    borderWidth: 1.5,
    borderRadius: 14,
    fontSize: 16,
    minHeight: 58,
  },
  text_field_large: {
    minHeight: 150,
    textAlignVertical: 'top',
  },
  action_button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    gap: 8,
    borderWidth: 1.5,
  },
  action_button_text: {
    fontSize: 14,
    fontWeight: '700',
  },
  post_button: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 18,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  button_text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  draftCard: {
    borderWidth: 2,
    marginBottom: 12,
    marginTop: 0,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  draftTitle: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  draftText: {
    fontWeight: '500',
  },
  draftMeta: {
    fontStyle: 'italic',
    marginTop: 4,
  },
});