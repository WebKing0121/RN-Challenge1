import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const EmptyList = () => (
  <View style={styles.container}>
    <Text style={styles.title}>No journal entries yet</Text>
    <Text style={styles.subtitle}>Tap the + button to create your first entry</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  title: { fontSize: 18, color: '#666', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#999', textAlign: 'center' },
});

export default EmptyList;
