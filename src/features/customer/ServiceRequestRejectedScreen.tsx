import { StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../../components/Button';
import { Screen } from '../../components/Screen';
import { colors, spacing } from '../../app/theme';
import type { CustomerStackParamList } from '../../app/navigation/types';

export function ServiceRequestRejectedScreen({ navigation }: NativeStackScreenProps<CustomerStackParamList, 'ServiceRequestRejected'>) {
  return (
    <Screen>
      <Text style={styles.kicker}>Needs attention</Text>
      <Text style={styles.title}>Service Request Rejected</Text>
      <Text style={styles.message}>Your request was rejected by the admin.</Text>
      <Button title="Submit Again" onPress={() => navigation.replace('Onboarding')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: { color: colors.terracotta, fontWeight: '700', marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '800', color: colors.ink, marginBottom: spacing.md },
  message: { color: colors.muted, lineHeight: 22, marginBottom: spacing.xl },
});