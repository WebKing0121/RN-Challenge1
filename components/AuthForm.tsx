import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FormButton from './FormButton';
import InputField from './InputField';

type FormData = { email: string; password: string };

const AuthForm: React.FC = () => {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: FormData, type: 'login' | 'register') => {
    setLoading(true);
    try {
      const result = type === 'login' ? await signIn(data.email, data.password) : await signUp(data.email, data.password);

      if (result.error) {
        Alert.alert(type === 'login' ? 'Login Failed' : 'Registration Failed', result.error.message || 'Invalid credentials');
      } else {
        if (type === 'register') Alert.alert('Success', 'Account created successfully!');
        router.replace('/journal');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/reset-password'); // navigate to reset password screen
  };

  return (
    <View>
      <InputField
        control={control}
        name="email"
        placeholder="Email"
        rules={{
          required: 'Email is required',
          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
        }}
      />
      <InputField
        control={control}
        name="password"
        placeholder="Password"
        secureTextEntry
        rules={{
          required: 'Password is required',
          minLength: { value: 6, message: 'Min 6 chars' },
        }}
      />

      <FormButton title="Login" loading={loading} onPress={handleSubmit((d) => onSubmit(d, 'login'))} />
      <FormButton
        title="Register"
        loading={loading}
        onPress={handleSubmit((d) => onSubmit(d, 'register'))}
        style={{ backgroundColor: '#34C759' }}
      />

      {/* Forgot Password */}
      <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotButton}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  forgotButton: {
    marginTop: 12,
    alignSelf: 'center',
  },
  forgotText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AuthForm;
