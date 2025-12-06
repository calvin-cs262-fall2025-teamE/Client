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
  brand: {
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
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  linkBtn: {
    marginTop: 12,
    alignSelf: 'center',
  },
  linkText: {
    fontWeight: '600',
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