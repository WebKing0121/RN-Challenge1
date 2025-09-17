import HeaderBar from '@/components/HeaderBar';
import ScreenWrapper from '@/components/ScreenWrapper';
import { useAuth } from '@/contexts/AuthContext';
import { analyzeMood, getMoodEmoji } from '@/lib/moodAnalyzer';
import { JournalEntry, supabase } from '@/lib/supabase';
import { useJournalStore } from '@/store/journalStore';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function NewEntryScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const addEntry = useJournalStore((state) => state.addEntry);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleSaveAndAnalyze = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please write something before saving');
      return;
    }
    if (!user) {
      Alert.alert('Error', 'You must be logged in to save entries');
      return;
    }

    setLoading(true);
    setAnalyzing(true);

    try {
      const moodResult = await analyzeMood(content);

      const { data, error } = await supabase
        .from('journal_entries')
        .insert([
          {
            user_id: user.id,
            content: content.trim(),
            mood: moodResult.mood,
          },
        ])
        .select()
        .single();

      addEntry(data as JournalEntry);

      if (error) {
        Alert.alert('Error', `Failed to save journal entry: ${error.message || 'Unknown error'}`);
        return;
      }

      Alert.alert(
        'Success!',
        `Entry saved with mood: ${getMoodEmoji(moodResult.mood)} ${moodResult.mood}`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  return (
    <ScreenWrapper statusBarColor="#fff" keyboardAvoiding contentStyle={styles.container}>
      <HeaderBar
        title="New Entry"
        onBack={() => router.back()}
        onRight={handleSaveAndAnalyze}
      />

      <ScrollView style={styles.content}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            placeholder="Write your thoughts..."
            autoFocus
          />
          <TouchableOpacity
            style={[styles.saveButton, !content.trim() && styles.saveButtonDisabled]}
            onPress={handleSaveAndAnalyze}
            disabled={!content.trim() || loading}
          >
            <Text style={styles.saveButtonText}>Save & Analyze</Text>
          </TouchableOpacity>
        </View>

        {analyzing && (
          <View style={styles.analyzingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.analyzingText}>Analyzing your mood...</Text>
          </View>
        )}

        <View style={styles.tipContainer}>
          <Text style={styles.tipTitle}>💡 Tip</Text>
          <Text style={styles.tipText}>
            Write freely about your day, feelings, or thoughts. Our AI will analyze your text and determine your mood automatically.
          </Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { flex: 1, padding: 20 },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    minHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textInput: { fontSize: 16, lineHeight: 24, color: '#333', minHeight: 250, textAlignVertical: 'top' },
  analyzingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
  },
  analyzingText: { marginLeft: 8, color: '#007AFF', fontSize: 14 },
  tipContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  tipTitle: { fontSize: 16, fontWeight: '600', color: '#856404', marginBottom: 4 },
  tipText: { fontSize: 14, color: '#856404', lineHeight: 20 },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
