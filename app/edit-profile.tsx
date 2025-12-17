import { useTheme } from '@/context/ThemeContext';
import { commonStyles } from '@/styles/common';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

  //Logic for on-line help:
  const [helpVisible, setHelpVisible] = useState(false);
  

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
    <LinearGradient
      colors={theme.colors.background as [string, string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Edit Profile
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="help-circle-outline" size={24} color={theme.colors.primary} onPress={() => setHelpVisible(true)}/>
            </TouchableOpacity>
          </Text>
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

        {/* On-line help popup */}
        <Modal
          visible={helpVisible}
          onRequestClose={() => {
            setHelpVisible(!helpVisible);
        }}>
          <View style={commonStyles.helpPage}>
            <Text style={commonStyles.helpTitle}>Editing Your Profile</Text>
            <Text style={commonStyles.helpText}>
              Using this the edit profile page, you can change anything about your account
            </Text>
            <Text style={commonStyles.helpText}>
              Simply enter a new value for a field and tab the <Ionicons name="checkmark" size={18} /> in the upper left corner to confirm the change. You can edit your: 
            </Text>
            <Text style={commonStyles.helpText}>
            - Profile photo. Click the change photo button to upload an new photo
            </Text>
            <Text style={commonStyles.helpText}>
            - First name
            </Text>
            <Text style={commonStyles.helpText}>
            - Last name
            </Text>
            <Text style={commonStyles.helpText}>
            - Email address (must be a valid email)
            </Text>
            <Text style={commonStyles.helpText}>
            - Phone number
            </Text>
            <Text style={commonStyles.helpText}>
            - Password (you must enter the same password twice to confirm that you haven't mistyped)
            </Text>
            <Text style={commonStyles.helpText}>
            - Bio
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
    backgroundColor: 'transparent',
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  saveButton: {
    padding: 8,
    borderRadius: 12,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 20,
  },
  avatarLarge: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  changePhotoButton: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  changePhotoText: {
    fontSize: 15,
    fontWeight: '700',
  },
  formSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderRadius: 20,
    marginHorizontal: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    paddingTop: 14,
  },
  iconButton: {
    padding: 6,
    borderRadius: 8,
  },
});
