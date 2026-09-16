import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '../app/theme';
import { Button } from './Button';

export function Loading({ label = 'Loading' }: { label?: string }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.teal} size="large" />
      <Text style={styles.muted}>{label}</Text>
    </View>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.muted}>{body}</Text>
    </View>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.muted}>{message}</Text>
      {onRetry ? <View style={{ width: '100%', marginTop: 16 }}><Button title="Try again" onPress={onRetry} /></View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { paddingVertical: 40, alignItems: 'center', gap: 8 },
  title: { fontSize: 18, fontWeight: '700', color: colors.ink, textAlign: 'center' },
  muted: { color: colors.muted, textAlign: 'center', marginTop: 4 },
});
