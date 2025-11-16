import { usePostContext } from '@/context/PostContext';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
  const [currentSelected, setCurrentSelected] = useState(0);
  const [questionText, setQuestionText] = useState('');
  const [detailsText, setDetailsText] = useState('');

  const handlePost = () => {
    // Validate inputs
    if (!questionText.trim()) {
      Alert.alert('Missing Information', 'Please enter your ' + (currentSelected === 0 ? 'question' : 'advice'));
      return;
    }

    // Create the post
    addPost({
      type: currentSelected === 0 ? 'question' : 'advice',
      title: questionText.trim(),
      content: detailsText.trim() || questionText.trim(),
      authorId: 1, // TODO: Replace with actual user ID from auth context
      communityId: 0, // TODO: Allow user to select community
      upvotes: 0,
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
            <Text style={[styles.title, { color: theme.colors.text }]}>Create Post</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Share your question or advice</Text>
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

          <TouchableOpacity 
            style={[styles.post_button, { backgroundColor: theme.colors.primary }]}
            onPress={handlePost}
          >
            <Ionicons name="send" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.post_button_text}>Post</Text>
          </TouchableOpacity>
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
  post_button_text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});