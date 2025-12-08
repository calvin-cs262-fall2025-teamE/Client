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
    top: -60,
    left: '50%',
    marginLeft: -175,
    width: 350,
    height: 350,
    borderRadius: 999,
    opacity: 0.5,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 10,
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 24,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  card: {
    width: '100%',
    maxWidth: CARD_MAX,
    borderRadius: 24,
    padding: 28,
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
    borderWidth: 1,
  },
  formGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
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
    marginTop: 12,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  backButtonAbsolute: {
    position: 'absolute',
    top: 60,
    left: 20,
    padding: 10,
    zIndex: 20,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  footerNote: {
    marginTop: 20,
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.7,
  },
});
