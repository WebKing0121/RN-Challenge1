import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type HeaderBarProps = {
  title: string;
  onBack?: () => void;
  onRight?: () => void;
  rightText?: string;
  rightType?: 'default' | 'red';
};

const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  onBack,
  onRight,
  rightText,
  rightType = 'default',
}) => (
  <View style={styles.header}>
    {/* Left Back Button */}
    {onBack ? (
      <TouchableOpacity style={styles.leftButton} onPress={onBack}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    ) : (
      <View style={styles.leftButton} />
    )}

    {/* Center Title */}
    <Text style={styles.title}>{title}</Text>

    {/* Right Button (Logout) */}
    {onRight && rightText ? (
      <TouchableOpacity style={styles.rightButton} onPress={onRight}>
        <Text
          style={[
            styles.rightText,
            rightType === 'red' && styles.rightTextRed,
          ]}
        >
          {rightText}
        </Text>
      </TouchableOpacity>
    ) : (
      <View style={styles.rightButton} />
    )}
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  leftButton: { width: 60 },
  title: { fontSize: 18, fontWeight: '600', color: '#333', textAlign: 'center', flex: 1 },
  rightButton: { width: 60, alignItems: 'flex-end' },
  backText: { color: '#007AFF', fontSize: 16, fontWeight: '500' },
  rightText: { color: '#007AFF', fontSize: 16, fontWeight: '500' },
  rightTextRed: { color: '#FF3B30' },
});

export default HeaderBar;
