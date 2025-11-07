import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Platform,
} from 'react-native';

// Optional: If you use Expo, you can enable image picking by running:
//   expo install expo-image-picker
// and then uncommenting the imports/use below. The component falls back to a simple "no picker" message when ImagePicker isn't available.

let ImagePicker: any = null;
try {
  // dynamic require so app doesn't crash if package isn't installed during static analysis
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ImagePicker = require('expo-image-picker');
} catch (e) {
  ImagePicker = null;
}

type PostType = 'Question' | 'Advice';

export default function PostsPage() {
  const [postType, setPostType] = useState<PostType>('Question');
  const [postText, setPostText] = useState<string>('');
  const [images, setImages] = useState<Array<{ uri: string }>>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState<string>('');

  const togglePostType = (type: PostType) => setPostType(type);

  const handleAddTag = () => {
    const t = currentTag.trim();
    if (!t) return;
    if (tags.includes(t.toLowerCase())) {
      setCurrentTag('');
      return;
    }
    setTags(prev => [...prev, t.toLowerCase()]);
    setCurrentTag('');
  };

  const handleRemoveTag = (t: string) => {
    setTags(prev => prev.filter(x => x !== t));
  };

  const handlePickImage = async () => {
    if (!ImagePicker) {
      Alert.alert(
        'Image picker not available',
        'Install expo-image-picker and restart the app to enable image uploads.'
      );
      return;
    }

    try {
      // Ask for permission on native platforms
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission required', 'Permission to access photos is required.');
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.6,
        selectionLimit: 5, // iOS only when allowsMultipleSelection true in newer SDKs
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // result.assets is an array of { uri }
        const picked = result.assets.map((a: any) => ({ uri: a.uri }));
        setImages(prev => [...prev, ...picked]);
      } else if (!result.canceled && result.uri) {
        // older return format
        setImages(prev => [...prev, { uri: result.uri }]);
      }
    } catch (e) {
      // In case the runtime image picker API differs
      console.warn('Image pick error', e);
      Alert.alert('Image pick error', String(e));
    }
  };

  const removeImageAt = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // Simulate submit - in production you'd validate and call an API here
    const payload = {
      postType,
      postText,
      tags,
      images,
      createdAt: new Date().toISOString(),
    };
    console.log('POST submit payload:', payload);
    Alert.alert('Posted', 'Your post was submitted (simulated).');

    // clear form
    setPostText('');
    setTags([]);
    setImages([]);
  };

  const handleSaveDraft = () => {
    const draft = {
      postType,
      postText,
      tags,
      images,
      savedAt: new Date().toISOString(),
    };
    console.log('Saved draft:', draft);
    Alert.alert('Saved as draft', 'Your draft was saved locally (simulated).');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Create a Post</Text>

        <View style={styles.toggleRow}>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => togglePostType('Question')}
            style={[
              styles.toggleButton,
              postType === 'Question' && styles.toggleButtonActive,
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                postType === 'Question' && styles.toggleTextActive,
              ]}
            >
              Question
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => togglePostType('Advice')}
            style={[
              styles.toggleButton,
              postType === 'Advice' && styles.toggleButtonActive,
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                postType === 'Advice' && styles.toggleTextActive,
              ]}
            >
              Advice
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.textArea}
          multiline
          placeholder="Write your question or advice here..."
          value={postText}
          onChangeText={setPostText}
          textAlignVertical="top"
        />

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Images</Text>
          <TouchableOpacity style={styles.smallButton} onPress={handlePickImage}>
            <Text style={styles.smallButtonText}>Upload</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
          {images.length === 0 ? (
            <Text style={styles.hint}>No images selected</Text>
          ) : (
            images.map((img, i) => (
              <View key={String(i)} style={styles.thumbWrap}>
                <Image source={{ uri: img.uri }} style={styles.thumb} />
                <TouchableOpacity style={styles.removeThumb} onPress={() => removeImageAt(i)}>
                  <Text style={styles.removeThumbText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>

        <View style={{ height: 12 }} />

        <Text style={styles.sectionTitle}>Tags</Text>
        <View style={styles.tagInputRow}>
          <TextInput
            placeholder="Add tags (e.g. college, car, coding)"
            style={styles.tagInput}
            value={currentTag}
            onChangeText={setCurrentTag}
            onSubmitEditing={handleAddTag}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addTagButton} onPress={handleAddTag}>
            <Text style={styles.addTagButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tagsRow}>
          {tags.map(t => (
            <View key={t} style={styles.tagPill}>
              <Text style={styles.tagText}>{t}</Text>
              <TouchableOpacity onPress={() => handleRemoveTag(t)}>
                <Text style={styles.tagRemove}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.footerRow}>
          <TouchableOpacity style={[styles.actionButton, styles.draftButton]} onPress={handleSaveDraft}>
            <Text style={styles.draftText}>Save as Draft</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.postButton]} onPress={handleSubmit}>
            <Text style={styles.postText}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 24 }} />

      <Text style={styles.smallHint}>Note: Image picker requires <Text style={{ fontWeight: '700' }}>expo-image-picker</Text> to be installed.</Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 800,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#f0f0f0',
  },
  toggleButtonActive: {
    backgroundColor: '#2563eb',
  },
  toggleText: {
    color: '#333',
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#fff',
  },
  textArea: {
    minHeight: 140,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  smallButton: {
    backgroundColor: '#efefef',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  smallButtonText: {
    color: '#111',
    fontWeight: '600',
  },
  imageRow: {
    marginBottom: 12,
  },
  thumbWrap: {
    marginRight: 10,
    position: 'relative',
  },
  thumb: {
    width: 88,
    height: 88,
    borderRadius: 8,
    backgroundColor: '#ddd',
  },
  removeThumb: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#111',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeThumbText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  hint: {
    color: '#666',
    marginVertical: 8,
  },
  tagInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  addTagButton: {
    backgroundColor: '#111',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addTagButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    marginBottom: 12,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 999,
    marginRight: 8,
  },
  tagText: {
    marginRight: 8,
    color: '#111',
    fontWeight: '600',
  },
  tagRemove: {
    color: '#666',
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  draftButton: {
    backgroundColor: '#f3f4f6',
  },
  postButton: {
    backgroundColor: '#2563eb',
  },
  draftText: {
    color: '#111',
    fontWeight: '700',
  },
  postText: {
    color: '#fff',
    fontWeight: '700',
  },
  smallHint: {
    color: '#666',
    fontSize: 12,
    maxWidth: 800,
    textAlign: 'center',
  },
});
