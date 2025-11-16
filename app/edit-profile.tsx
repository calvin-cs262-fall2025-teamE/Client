import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from './AuthContext';

export default function EditProfileScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState('');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions to change your profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && user) {
      updateUser({
        ...user,
        profileImage: result.assets[0].uri,
      });
    }
  };

  const handleSave = () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Validation', 'Please enter your first and last name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Validation', 'Please enter a valid email.');
      return;
    }

    const updatedUser = {
      ...user!,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
    };

    updateUser(updatedUser);
    Alert.alert('Success', 'Profile updated successfully!');
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={theme.colors.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      >
        <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Ionicons name="checkmark" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.avatarSection, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.avatarLarge, { backgroundColor: theme.colors.chip, borderColor: theme.colors.border }]}>
              {user?.profileImage ? (
                <Image 
                  source={{ uri: user.profileImage }} 
                  style={styles.avatarImage}
                />
              ) : (
                <Ionicons name="person" size={48} color={theme.colors.text} />
              )}
            </View>
            <TouchableOpacity style={[styles.changePhotoButton, { backgroundColor: theme.colors.chip }]} onPress={pickImage}>
              <Ionicons name="camera" size={18} color={theme.colors.primary} style={{ marginRight: 6 }} />
              <Text style={[styles.changePhotoText, { color: theme.colors.primary }]}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.formSection, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>First Name</Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: theme.colors.surface }]}
                placeholder="First Name"
                placeholderTextColor={theme.colors.textSecondary}
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Last Name</Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: theme.colors.surface }]}
                placeholder="Last Name"
                placeholderTextColor={theme.colors.textSecondary}
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Email</Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: theme.colors.surface }]}
                placeholder="you@example.com"
                placeholderTextColor={theme.colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Phone (optional)</Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: theme.colors.surface }]}
                placeholder="+1 (555) 123-4567"
                placeholderTextColor={theme.colors.textSecondary}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Bio (optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea, { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: theme.colors.surface }]}
                placeholder="Tell us about yourself..."
                placeholderTextColor={theme.colors.textSecondary}
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  saveButton: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 16,
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
  changePhotoButton: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  changePhotoText: {
    fontSize: 15,
    fontWeight: '600',
  },
  formSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginHorizontal: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
});
