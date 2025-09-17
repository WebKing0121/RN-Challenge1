import { useAuth } from '@/contexts/AuthContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type FormData = {
  email: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { mode = 'request', accessToken, refreshToken } =
    useLocalSearchParams<{
      mode?: 'request' | 'update';
      accessToken?: string;
      refreshToken?: string;
    }>();
  const { resetPassword, updatePassword } = useAuth();
  const isUpdateMode = mode === 'update';

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    // Handle deep link parameters if needed
    if (accessToken && refreshToken) {
      // Typically handled automatically by Supabase
    }
  }, [accessToken, refreshToken]);

  const onRequestReset = async (data: FormData) => {
    try {
      const { error } = await resetPassword(data.email);
      if (error) throw error;

      alert('Reset email sent. Check your inbox.');
      router.back();
    } catch (error: any) {
      alert(error.message || 'Unexpected error occurred');
    }
  };

  const onUpdatePassword = async (data: FormData) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      if (data.newPassword.length < 6) {
        alert('Password must be at least 6 characters');
        return;
      }

      const { error } = await updatePassword(data.newPassword);
      if (error) throw error;

      alert('Password updated successfully');
      router.replace('/journal');
    } catch (error: any) {
      alert(error.message || 'Unexpected error occurred');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <Text style={styles.title}>
            {isUpdateMode ? 'Update Password' : 'Reset Password'}
          </Text>
          <Text style={styles.subtitle}>
            {isUpdateMode
              ? 'Enter your new password below'
              : 'Enter your email to receive reset instructions'}
          </Text>

          <View style={styles.form}>
            {!isUpdateMode ? (
              <Controller
                control={control}
                name="email"
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Invalid email address',
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}
              />
            ) : (
              <>
                <Controller
                  control={control}
                  name="newPassword"
                  rules={{ required: 'New password is required' }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="New Password"
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="confirmPassword"
                  rules={{ required: 'Confirm password is required' }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm New Password"
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  )}
                />
              </>
            )}

            <TouchableOpacity
              style={[styles.button, isSubmitting && styles.buttonDisabled]}
              onPress={handleSubmit(isUpdateMode ? onUpdatePassword : onRequestReset)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {isUpdateMode ? 'Update Password' : 'Send Reset Email'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 32 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 8, color: '#333' },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 48, color: '#666', lineHeight: 24 },
  form: { gap: 16 },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: { backgroundColor: '#007AFF', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  backButton: { paddingVertical: 12, alignItems: 'center' },
  backButtonText: { color: '#007AFF', fontSize: 16, fontWeight: '500' },
});
