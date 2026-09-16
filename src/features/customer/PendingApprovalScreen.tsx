import { StyleSheet, Text } from 'react-native';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { colors, spacing } from '../../app/theme';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { logout } from '../auth/authSlice';

export function PendingApprovalScreen() {
  const profile = useAppSelector(s => s.auth.profile);
  const dispatch = useAppDispatch();
  const rejected = profile?.approvalStatus === 'rejected';

  return (
    <Screen>
      <Text style={styles.kicker}>{rejected ? 'Needs attention' : 'In review'}</Text>
      <Text style={styles.title}>
        {rejected ? 'Your request was declined' : 'Waiting for the studio'}
      </Text>
      <Text style={styles.sub}>
        {rejected
          ? profile?.rejectionReason ?? 'Update your details and ask support to reopen the request.'
          : 'An admin will approve pickup at your address. You will get a notification when the dashboard unlocks.'}
      </Text>
      <Button title="Sign out" variant="ghost" onPress={() => dispatch(logout())} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: { color: colors.terracotta, fontWeight: '700', marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '800', color: colors.ink, marginBottom: spacing.md },
  sub: { color: colors.muted, lineHeight: 22, marginBottom: spacing.xl },
});
