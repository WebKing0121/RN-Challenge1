import Card from '@/components/Card';
import HeaderBar from '@/components/HeaderBar';
import JournalStats from '@/components/JournalStats';
import ScreenWrapper from '@/components/ScreenWrapper';
import { useAuth } from '@/contexts/AuthContext';
import { getMoodEmoji } from '@/lib/moodAnalyzer';
import { useJournalStore } from '@/store/journalStore';
import { useRouter } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';
import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

export default function JournalDetailScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const id = useSearchParams().get('id');
  const { entries } = useJournalStore();
  const entry = entries.find(e => e.id == (id as string));
  const content = entry?.content || '';
  const wordsCount = content.split(/\s+/).filter(w => w.length > 0).length;

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/auth');
    } catch (err) { console.error(err); }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <ScreenWrapper statusBarColor="#fff">
      <HeaderBar
        title="Journal Entry"
        onBack={() => router.back()}
        onRight={handleLogout}
        rightText="Logout"
        rightType="red"
      />

      <ScrollView style={styles.scroll}>
        <Card style={styles.dateCard}>
          <Text style={styles.dateText}>
            {entry?.created_at ? formatDate(entry.created_at) : ''}
          </Text>
        </Card>

        <Card style={styles.moodCard}>
          <Text style={styles.moodEmoji}>{getMoodEmoji(entry?.mood || '')}</Text>
          <Text style={styles.moodText}>{entry?.mood}</Text>
        </Card>

        <Card style={styles.contentCard}>
          <Text style={styles.contentText}>{content}</Text>
        </Card>

        <Card style={styles.statsCard}>
          <JournalStats characters={content.length} words={wordsCount} />
        </Card>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, padding: 20 },
  dateCard: { alignItems: 'center' },
  dateText: { fontSize: 16, color: '#666', fontWeight: '500' },
  moodCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  moodEmoji: { fontSize: 32, marginRight: 12 },
  moodText: { fontSize: 20, fontWeight: '600', color: '#333' },
  contentCard: {},
  contentText: { fontSize: 16, lineHeight: 24, color: '#333' },
  statsCard: {},
});
