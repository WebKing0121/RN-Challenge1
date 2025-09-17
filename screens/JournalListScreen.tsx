import EmptyList from '@/components/EmptyList';
import FAB from '@/components/FAB';
import HeaderBar from '@/components/HeaderBar';
import JournalCard from '@/components/JournalCard';
import MoodFilterModal from '@/components/MoodFilterModal';
import ScreenWrapper from '@/components/ScreenWrapper';
import { useAuth } from '@/contexts/AuthContext';
import { getAllMoods, getMoodEmoji } from '@/lib/moodAnalyzer';
import { useJournalStore } from '@/store/journalStore';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function JournalListScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { entries, loading, loaded, fetchEntries } = useJournalStore();
  const [selectedMood, setSelectedMood] = useState<string>('All');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const moods = ['All', ...getAllMoods()];

  useEffect(() => {
    if (!user && loaded) return;
    if (user) fetchEntries(user.id); // fetch only if store empty
  }, [user, loaded]);

  const filteredEntries =
    selectedMood === 'All' ? entries : entries.filter((e) => e.mood === selectedMood);

  const onRefresh = async () => {
    if (!user && loaded) return;
    if (user) {
      setRefreshing(true);
      await fetchEntries(user.id);
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/auth');
    } catch (err) {
      console.error(err);
      alert('Failed to logout');
    }
  };

  const handlePressEntry = (entryId: number) => {
    router.push(`/journal/${entryId}`);
  };

  const handleSelectMood = (mood: string) => {
    setSelectedMood(mood);
    setShowFilterModal(false);
  };

  return (
    <ScreenWrapper>
      <HeaderBar title="My Journal" onRight={handleLogout} rightText="Logout" rightType="red" />

      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilterModal(true)}>
          <Text style={styles.filterButtonText}>
            {selectedMood === 'All' ? 'All Entries' : `${getMoodEmoji(selectedMood)} ${selectedMood}`}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={filteredEntries}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <JournalCard entry={item} onPress={() => handlePressEntry(item.id)} />
          )}
          ListEmptyComponent={<EmptyList />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <FAB onPress={() => router.push('/journal/new')} />

      <MoodFilterModal
        visible={showFilterModal}
        moods={moods}
        selectedMood={selectedMood}
        onSelect={handleSelectMood}
        onClose={() => setShowFilterModal(false)}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContainer: { padding: 16, paddingBottom: 80 },
  filterContainer: { flexDirection: 'row', justifyContent: 'flex-end', padding: 16 },
  filterButton: { backgroundColor: '#007AFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  filterButtonText: { color: '#fff', fontWeight: '600' },
});
