import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from './AuthContext';

export default function CreateAccountScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signIn } = useAuth();

  const handleSignIn = () => {
    // Basic client-side validation
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Validation', 'Please enter your full name.');
      return;
    }
    if (!email.trim() || !confirmEmail.trim()) {
      Alert.alert('Validation', 'Please enter and confirm your email.');
      return;
    }
    if (email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
      Alert.alert('Validation', "Emails don't match.");
      return;
    }
    if (!password || !confirmPassword) {
      Alert.alert('Validation', 'Please enter and confirm your password.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Validation', "Passwords don't match.");
      return;
    }

    // Construct a minimal user object compatible with AuthContext
    const user = {
      id: Date.now().toString(),
      email: email.trim().toLowerCase(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    } as any;

    // Sign the user in via the app's AuthContext and navigate to the profile tab
    try {
      signIn(user);
      router.replace('/(tabs)/profile');
    } catch (err) {
      // Fallback error handling
      Alert.alert('Error', 'Could not complete account creation.');
    }
  };

  return (
    <LinearGradient
      colors={theme.colors.background}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.bg}
    >
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backButtonAbsolute, { backgroundColor: theme.colors.chip }]}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <LinearGradient
              colors={[`${theme.colors.primary}40`, `${theme.colors.accent}30`, "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGlow}
              pointerEvents="none"
            />
            <Text style={[styles.title, { color: theme.colors.text, textShadowColor: `${theme.colors.primary}40` }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Join Community today</Text>
          </View>

          <View style={[styles.card, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.primary, borderColor: `${theme.colors.primary}20` }]}>
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>First Name</Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceElev, color: theme.colors.text }]}
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
                style={[styles.input, { borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceElev, color: theme.colors.text }]}
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
                style={[styles.input, { borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceElev, color: theme.colors.text }]}
                placeholder="you@example.com"
                placeholderTextColor={theme.colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Confirm Email</Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceElev, color: theme.colors.text }]}
                placeholder="you@example.com"
                placeholderTextColor={theme.colors.textSecondary}
                value={confirmEmail}
                onChangeText={setConfirmEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, styles.passwordInput, { borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceElev, color: theme.colors.text }]}
                  placeholder="••••••••"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((s) => !s)}
                  style={styles.showBtn}
                >
                  <Ionicons 
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={22} 
                    color={theme.colors.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Confirm Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, styles.passwordInput, { borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceElev, color: theme.colors.text }]}
                  placeholder="••••••••"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword((s) => !s)}
                  style={styles.showBtn}
                >
                  <Ionicons 
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={22} 
                    color={theme.colors.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary, shadowColor: theme.colors.primary }]} onPress={handleSignIn}>
              <Text style={styles.buttonText}>Create account</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.footerNote, { color: theme.colors.textSecondary }]}>
            By creating an account, you agree to our Terms & Privacy.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const CARD_MAX = 420;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 90,
    alignItems: 'center',
  },
  hero: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  heroGlow: {
    position: 'absolute',
    top: -40,
    left: '50%',
    marginLeft: -150,
    width: 300,
    height: 300,
    borderRadius: 999,
    opacity: 0.4,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    maxWidth: CARD_MAX,
    borderRadius: 20,
    padding: 24,
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    borderWidth: 1,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
    paddingRight: 50,
  },
  showBtn: {
    position: 'absolute',
    right: 12,
    padding: 8,
  },
  button: {
    marginTop: 8,
    width: '100%',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  backButtonAbsolute: {
    position: 'absolute',
    top: 60,
    left: 20,
    padding: 8,
    zIndex: 20,
    borderRadius: 8,
  },
  footerNote: {
    marginTop: 16,
    fontSize: 12,
    textAlign: 'center',
  },
});
