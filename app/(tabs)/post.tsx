import { useCommunityContext } from '@/context/CommunityContext';
import { usePostContext } from '@/context/PostContext';
import { useTheme } from '@/context/ThemeContext';
import { commonStyles } from '@/styles/common';
import { Community } from '@/types/Community';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
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

  // Contextual information:
  const { user } = useAuth();

  const { id } = useLocalSearchParams();
  const { communities } = useCommunityContext();
  const [selectedCommunity, setSelectedCommunity] = useState(communities.find(comm => comm.communityID.toString() === id));

  //Logic for on-line help:
  const [helpVisible, setHelpVisible] = useState(false);

  const handlePost = () => {
    // Validate inputs
    if (!questionText.trim()) {
      Alert.alert('Missing Information', 'Please enter your ' + (currentSelected === 0 ? 'question' : 'advice'));
      return;
    }

    if (!selectedCommunity?.communityID) {
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

    // Show success and navigate
    Alert.alert('Success!', 'Your post has been created', [
      {
        text: 'OK',
        onPress: () => router.back(),
      },
    ]);
  };

  const handleCommunitySelect = (community: Community) => {
    setSelectedCommunity(community);
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={theme.colors.background as [string, string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Text style={[styles.title, { color: theme.colors.text, justifyContent: 'center' }]}>Create Post
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="help-circle-outline" size={24} color={theme.colors.primary} onPress={() => setHelpVisible(true)}/>
              </TouchableOpacity>
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Share your question or advice</Text>
          </View>

          <View>
            {/* This the code here is copied and modified from this webpage: https://builtin.com/articles/react-native-dropdown */}
            {/* Credit to Aneeqa Khan */}
            
            <TouchableOpacity
              onPress={() => setDropdownVisible(!isDropdownVisible)}
              style={[styles.small_button, { backgroundColor: theme.colors.primary }]}
            >
              <Text
                style={{color: theme.colors.text, fontSize: 14}}
              >{selectedCommunity?.communityName ? "Posting in " + selectedCommunity.communityName : "Please select a community"}</Text>
            </TouchableOpacity>

            {isDropdownVisible && (
              <FlatList
                data={communities}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleCommunitySelect(item)}
                    style={styles.dropdownOption}
                  >
                    <Text style={{color: theme.colors.text, fontSize: 18}}>{item.communityName}</Text>
                  </TouchableOpacity>
                )}
              />

            )}
          </View>

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

          {/* <View style={styles.section}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Community</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.communityScroll}
            >
              {communities.map((community) => (
                <TouchableOpacity
                  key={community.communityID}
                  style={[
                    styles.communityChip,
                    {
                      backgroundColor: selectedCommunityId === community.communityID ? theme.colors.primary : theme.colors.chip,
                      borderColor: selectedCommunityId === community.communityID ? theme.colors.primary : theme.colors.border,
                    }
                  ]}
                  onPress={() => setSelectedCommunityId(community.communityID)}
                >
                  <Text style={[
                    styles.communityChipText,
                    { color: selectedCommunityId === community.communityID ? '#FFF' : theme.colors.text }
                  ]}>
                    {community.communityName}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View> */}

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Your {currentSelected === 0 ? 'Question' : 'Advice'}</Text>
            <TextInput
              placeholder={currentSelected === 0 ? 'What is your question?' : 'What is your advice?'}
              placeholderTextColor={theme.colors.textSecondary}
              style={[styles.text_field, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
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
              style={[styles.text_field, styles.text_field_large, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
              value={detailsText}
              onChangeText={setDetailsText}
              multiline
            />
          </View>

          <View style={[styles.button_container, {marginBottom: 30}]}>
            <TouchableOpacity
             style={[styles.small_button, { backgroundColor: '#f11'}]} 
            >
              <Ionicons name="trash" size={14} color="white" style={{ marginRight: 4 }} />
              <Text style={styles.small_button_text}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
             style={[styles.small_button, { backgroundColor: theme.colors.primary }]} 
            >
              <Ionicons name="arrow-down" size={14} color="white" style={{ marginRight: 4 }} />
              <Text style={styles.small_button_text}>Save Draft</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.post_button, { backgroundColor: theme.colors.primary}]}
            onPress={handlePost}
          >
            <Ionicons name="send" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.button_text}>Post</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>

      {/* On-line help popup */}
      <Modal
        visible={helpVisible}
        onRequestClose={() => {
          setHelpVisible(!helpVisible);
      }}>
        <View style={commonStyles.helpPage}>
          <Text style={commonStyles.helpTitle}>The Post Page</Text>
          <Text style={commonStyles.helpText}>
            On this page you can make your own post
          </Text>
          <Text style={commonStyles.helpText}>
            Let's say you wanted to share advice in the RVD community. You should:
          </Text>
          <Text style={commonStyles.helpText}>
            1. Tap the button at the top of the page to bring up a selector for community.
          </Text>
          <Text style={commonStyles.helpText}>
            2. Select RVD on the selector. You don't need to do this if the button already says 'Posting in RVD'.
          </Text>
          <Text style={commonStyles.helpText}>
            3. Tap the 'Advice' button to switch to an advice type post.
          </Text>
          <Text style={commonStyles.helpText}>
            4. Enter a consise statement of your advice in the upper text field.
          </Text>
          <Text style={commonStyles.helpText}>
            5. If you have more information to add, or an image, use the fields below.
          </Text>
          <Text style={commonStyles.helpText}>
            6. Tap the 'Post' button at the bottom of the page. You should see confirmation that this worked.
          </Text>
          <TouchableOpacity
          style={[commonStyles.helpCloseButton, {backgroundColor: 'black'}]}
          onPress={() => setHelpVisible(!helpVisible)}
          >
            <Text style={[commonStyles.buttonText, {fontSize: 20}]}>Hide Help</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dropdownOption: {
    margin: 2,
    padding: 2,
    backgroundColor: '#555',
  },
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
    padding: 20,
  },
  hero: {
    width: "100%",
    gap: 6,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 15,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  button_container: {
    flexDirection: 'row',
    gap: 12,
  },
  type_button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  text_field: {
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    fontSize: 16,
    minHeight: 50,
  },
  text_field_large: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  post_button: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  button_text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  small_button_text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  small_button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  communityScroll: {
    gap: 10,
    paddingVertical: 4,
  },
  communityChip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  communityChipText: {
    fontSize: 15,
    fontWeight: '600',
  },
  iconButton: {
    padding: 4,
  },
});