import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function ForgotPasswordScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSend = () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Please enter a valid email address');
      return;
    }

    // Placeholder: call your backend to send a reset link.
    Alert.alert('Password reset', `If an account exists for ${email}, you will receive reset instructions.`);
    router.back();
  };

  return (
    <LinearGradient colors={theme.colors.background} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <View style={[styles.heroGlow, { backgroundColor: theme.colors.primary }]} />
        
        <Text style={[styles.title, { color: theme.colors.text }]}>Reset your password</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Enter your email to receive a reset link</Text>

        <View style={styles.formContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Email</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
            placeholder="you@example.com"
            placeholderTextColor={theme.colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary, shadowColor: theme.colors.primary }]} onPress={handleSend}>
            <Text style={styles.buttonText}>Send reset link</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    zIndex: 20,
  },
  heroGlow: {
    position: 'absolute',
    top: 100,
    left: '50%',
    marginLeft: -100,
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.15,
    zIndex: -1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: '7.5%',
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    width: '85%',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    width: '85%',
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
