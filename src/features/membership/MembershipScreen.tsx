import { Alert, StyleSheet, Text } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { colors, spacing } from '../../app/theme';
import { useCatalogSettingsQuery } from '../laundry/serviceApi';
import { useSubscribeMutation } from '../admin/adminApi';
import { inr } from '../../utils/format';
import { useAppDispatch } from '../../app/store';
import { setSession } from '../auth/authSlice';
import { useAppSelector } from '../../app/store';

export function MembershipScreen() {
  const { data } = useCatalogSettingsQuery();
  const [sub] = useSubscribeMutation();
  const dispatch = useAppDispatch();
  const token = useAppSelector(s => s.auth.token);

  return (
    <Screen>
      <Text style={styles.title}>Monthly plans</Text>
      <Text style={styles.muted}>Paid from wallet. Benefits apply on the next quote.</Text>
      {data?.membershipPlans.map(p => (
        <Card key={p.id} style={{ marginTop: spacing.md }}>
          <Text style={{ fontWeight: '800', fontSize: 18 }}>{p.name}</Text>
          <Text>{inr(p.priceMonthly)} / month · {p.discountPercent}% off · +{p.bonusCoins} coins</Text>
          <Text style={styles.muted}>{p.priorityDelivery ? 'Priority delivery' : 'Standard queue'}</Text>
          <Button
            title="Subscribe"
            onPress={async () => {
              try {
                const session = await sub(p.id).unwrap();
                if (token) {
                  dispatch(
                    setSession({
                      token,
                      user: session.user,
                      profile: session.profile,
                      walletBalance: session.walletBalance,
                      coinBalance: session.coinBalance,
                    }),
                  );
                }
                Alert.alert('Active', `${p.name} is on`);
              } catch (e) {
                Alert.alert('Could not subscribe', e instanceof Error ? e.message : 'Add wallet funds');
              }
            }}
          />
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '800', color: colors.ink },
  muted: { color: colors.muted, marginTop: 8 },
});
