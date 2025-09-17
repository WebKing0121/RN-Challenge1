import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  characters: number;
  words: number;
};

const JournalStats: React.FC<Props> = ({ characters, words }) => (
  <View style={styles.container}>
    <View style={styles.item}>
      <Text style={styles.label}>Characters</Text>
      <Text style={styles.value}>{characters}</Text>
    </View>
    <View style={styles.item}>
      <Text style={styles.label}>Words</Text>
      <Text style={styles.value}>{words}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-around' },
  item: { alignItems: 'center' },
  label: { fontSize: 14, color: '#666', marginBottom: 4 },
  value: { fontSize: 18, fontWeight: '600', color: '#333' },
});

export default JournalStats;
