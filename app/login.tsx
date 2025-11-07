import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from './AuthContext';

export default function SignInScreen() {
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
    <ImageBackground
      source={{
        uri: 'https://calvin.edu/sites/default/files/styles/photo_gallery_popup/public/2025-05/calvin-university-dorm-residence-hall_4.jpg?itok=50eeSb0w',
      }}
      resizeMode="cover"
      style={styles.bg}
    >
      <View style={styles.overlay} />

      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButtonAbsolute}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.brand}>CommUnity</Text>
        <Text style={styles.subtitle}>Welcome back — let’s connect you in.</Text>

        <View style={styles.card}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#777"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="••••••••"
                placeholderTextColor="#777"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                textContentType="password"
              />
              <TouchableOpacity
                onPress={() => setShowPassword((s) => !s)}
                style={styles.showBtn}
              >
                <Text style={styles.showBtnText}>{showPassword ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, (!canSubmit || loading) && styles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={!canSubmit || loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Signing in…' : 'Sign in'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/forgot-password')} style={styles.linkBtn}>
            <Text style={styles.linkText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/create-account')} style={[styles.linkBtn, { marginTop: 8 }]}>
            <Text style={[styles.linkText, { fontWeight: '700' }]}>Create an account</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerNote}>
          By signing in, you agree to our Terms & Privacy.
        </Text>
      </SafeAreaView>
    </ImageBackground>
  );
}

const CARD_MAX = 420;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)', // slightly darkened for better contrast
  },

  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-start',
    paddingTop: 90,
    alignItems: 'center',
  },

  brand: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#fff',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#f2f2f2',
    marginBottom: 18,
    textAlign: 'center',
  },

  card: {
    width: '100%',
    maxWidth: CARD_MAX,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  formGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    color: '#333',
    marginBottom: 6,
    fontWeight: '600',
  },

  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fbfbfb',
    fontSize: 16,
    color: '#111',
  },

  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    marginRight: 10,
  },
  showBtn: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  showBtnText: {
    color: '#007BFF',
    fontWeight: '600',
  },

  button: {
    marginTop: 6,
    width: '100%',
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#8CB9FF',
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
    color: '#007BFF',
    fontWeight: '600',
  },

  backButtonAbsolute: {
    position: 'absolute',
    top: 60,
    left: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    zIndex: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  footerNote: {
    marginTop: 14,
    fontSize: 12,
    color: '#f2f2f2',
    textAlign: 'center',
  },
});