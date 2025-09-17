import { getMoodEmoji } from '@/lib/moodAnalyzer';
import { JournalEntry } from '@/lib/supabase';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  entry: JournalEntry;
  onPress: () => void;
};

const JournalCard: React.FC<Props> = ({ entry, onPress }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSnippet = (content: string) => {
    return content.length > 100 ? content.substring(0, 100) + '...' : content;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.date}>{formatDate(entry.created_at)}</Text>
        <View style={styles.mood}>
          <Text style={styles.emoji}>{getMoodEmoji(entry.mood)}</Text>
          <Text style={styles.text}>{entry.mood}</Text>
        </View>
      </View>
      <Text style={styles.content}>{getSnippet(entry.content)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  date: { fontSize: 12, color: '#666' },
  mood: { flexDirection: 'row', alignItems: 'center' },
  emoji: { fontSize: 16, marginRight: 4 },
  text: { fontSize: 12, color: '#666', fontWeight: '600' },
  content: { fontSize: 14, color: '#333', lineHeight: 20 },
});

export default JournalCard;
