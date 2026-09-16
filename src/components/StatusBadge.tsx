import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../app/theme';
import { STATUS_LABEL } from '../utils/format';

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === 'DELIVERED' || status === 'PAID' || status === 'approved'
      ? colors.success
      : status === 'CANCELLED' || status === 'FAILED' || status === 'rejected'
        ? colors.danger
        : status === 'COD' || status === 'PENDING' || status === 'pending'
          ? colors.warning
          : colors.teal;
  return (
    <View style={[styles.badge, { backgroundColor: `${tone}22` }]}>
      <Text style={[styles.text, { color: tone }]}>{STATUS_LABEL[status] ?? status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  text: { fontSize: 12, fontWeight: '700' },
});
