import { StyleSheet, Text } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { EmptyState, Loading } from '../../components/States';
import { colors, spacing } from '../../app/theme';
import { useNotificationsQuery, useReadNotificationMutation } from '../admin/adminApi';
import { formatWhen } from '../../utils/format';

export function NotificationsScreen() {
  const { data, isLoading } = useNotificationsQuery();
  const [read] = useReadNotificationMutation();
  if (isLoading) return <Screen><Loading /></Screen>;
  if (!data?.length) {
    return (
      <Screen>
        <EmptyState title="Quiet for now" body="Order and wallet alerts will appear here." />
      </Screen>
    );
  }
  return (
    <Screen>
      <Text style={styles.title}>Notifications</Text>
      {data.map(n => (
        <Card key={n.id} style={{ marginBottom: 8, opacity: n.read ? 0.6 : 1 }} onPress={() => read(n.id)}>
          <Text style={{ fontWeight: '800', color: colors.ink }}>{n.title}</Text>
          <Text style={{ color: colors.muted, marginTop: 4 }}>{n.body}</Text>
          <Text style={{ color: colors.muted, marginTop: 6, fontSize: 12 }}>{formatWhen(n.createdAt)}</Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '800', color: colors.ink, marginBottom: spacing.md },
});
