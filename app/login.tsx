import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from './AuthContext';

export default function SignInScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSignIn = async () => {
    if (!email || !password) return;
    try {
      setLoading(true);
      const userData = {
        id: '1',
        email,
        firstName: 'Yaw',
        lastName: 'Owusu',
      };

      signIn(userData);
      router.replace('/(tabs)/profile'); // Change this to your preferred landing page
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = email.trim().length > 0 && password.trim().length > 0;

  return (
    <LinearGradient
      colors={theme.colors.background}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.bg}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.hero}>
          <LinearGradient
            colors={[`${theme.colors.primary}40`, `${theme.colors.accent}30`, "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGlow}
            pointerEvents="none"
          />
          <Text style={[styles.brand, { color: theme.colors.text, textShadowColor: `${theme.colors.primary}40` }]}>CommUnity</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Welcome back — let's connect you in.</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.primary, borderColor: `${theme.colors.primary}20` }]}>
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Email</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface, color: theme.colors.text }]}
              placeholder="you@example.com"
              placeholderTextColor={theme.colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface, color: theme.colors.text }]}
                placeholder="••••••••"
                placeholderTextColor={theme.colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                textContentType="password"
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

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary, shadowColor: theme.colors.primary }, (!canSubmit || loading) && styles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={!canSubmit || loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Signing in…' : 'Sign in'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/forgot-password')} style={styles.linkBtn}>
            <Text style={[styles.linkText, { color: theme.colors.primary }]}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/create-account')} style={[styles.linkBtn, { marginTop: 8 }]}>
            <Text style={[styles.linkText, { fontWeight: '700', color: theme.colors.primary }]}>Create an account</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.footerNote, { color: theme.colors.textSecondary }]}>
          By signing in, you agree to our Terms & Privacy.
        </Text>
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
    padding: 24,
    justifyContent: 'flex-start',
    paddingTop: 90,
    alignItems: 'center',
  },
  hero: {
    alignItems: 'center',
    marginBottom: 28,
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
    opacity: 0.5,
  },
  brand: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 10,
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 24,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.85,
  },
  card: {
    width: '100%',
    maxWidth: CARD_MAX,
    borderRadius: 24,
    padding: 28,
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
    borderWidth: 1,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '700',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
  },
  passwordContainer: {
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
    right: 14,
    padding: 10,
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
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  linkBtn: {
    marginTop: 16,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  linkText: {
    fontWeight: '700',
    fontSize: 15,
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