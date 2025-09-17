import React from 'react';
import { KeyboardAvoidingView, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  children: React.ReactNode;
  statusBarColor?: string; // default #fff
  keyboardAvoiding?: boolean; // default false
  contentStyle?: object;
};

const ScreenWrapper: React.FC<Props> = ({
  children,
  statusBarColor = '#fff',
  keyboardAvoiding = false,
  contentStyle = {},
}) => {
  const Container = keyboardAvoiding ? KeyboardAvoidingView : View;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={statusBarColor} />
      <Container
        style={[styles.container, contentStyle]}
        behavior={keyboardAvoiding && Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {children}
      </Container>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
});

export default ScreenWrapper;
