import { getMoodEmoji } from '@/lib/moodAnalyzer';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  visible: boolean;
  moods: string[];
  selectedMood: string;
  onSelect: (mood: string) => void;
  onClose: () => void;
};

const MoodFilterModal: React.FC<Props> = ({ visible, moods, selectedMood, onSelect, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.container}>
          <Text style={styles.title}>Filter by Mood</Text>
          {moods.map((mood) => (
            <TouchableOpacity
              key={mood}
              style={[styles.option, selectedMood === mood && styles.optionSelected]}
              onPress={() => onSelect(mood)}
            >
              <Text style={[styles.optionText, selectedMood === mood && styles.optionTextSelected]}>
                {mood === 'All' ? 'All Entries' : `${getMoodEmoji(mood)} ${mood}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  container: { backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '80%', maxHeight: '60%' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  option: { padding: 12, borderRadius: 8, marginBottom: 8 },
  optionSelected: { backgroundColor: '#007AFF' },
  optionText: { fontSize: 16, color: '#333' },
  optionTextSelected: { color: '#fff', fontWeight: '600' },
});

export default MoodFilterModal;
