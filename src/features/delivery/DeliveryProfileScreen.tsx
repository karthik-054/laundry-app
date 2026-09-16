import { StyleSheet, Text } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { LogoutButton } from '../../components/LogoutButton';
import { useAppSelector } from '../../app/store';
import { colors, spacing } from '../../app/theme';

export function DeliveryProfileScreen() {
  const user = useAppSelector(s => s.auth.user);

  return (
    <Screen>
      <Text style={styles.title}>Profile</Text>
      <Card style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{user?.name ?? 'Delivery rider'}</Text>
        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>{user?.phone ?? 'Not available'}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email ?? 'Not available'}</Text>
      </Card>
      <LogoutButton />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '800', color: colors.ink, marginBottom: spacing.md },
  card: { marginBottom: spacing.md },
  label: { color: colors.muted, fontSize: 12, marginTop: 10 },
  value: { color: colors.ink, fontSize: 18, fontWeight: '700' },
});
