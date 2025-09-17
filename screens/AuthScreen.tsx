import AuthForm from '@/components/AuthForm';
import ScreenWrapper from '@/components/ScreenWrapper';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function AuthScreen() {
  return (
    <ScreenWrapper statusBarColor="#f5f5f5" keyboardAvoiding contentStyle={styles.content}>
      <Text style={styles.title}>Journal App</Text>
      <Text style={styles.subtitle}>Write your thoughts and track your mood</Text>
      <View style={styles.form}>
        <AuthForm />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: { justifyContent: 'center', paddingHorizontal: 20 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 8, color: '#333' },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 20, color: '#666' },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
