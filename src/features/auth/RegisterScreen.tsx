import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/Screen';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { colors, spacing } from '../../app/theme';
import { useRegisterMutation } from './authApi';
import { setSession } from './authSlice';
import { useAppDispatch } from '../../app/store';
import { tokenStorage } from '../../services/tokenStorage';
import type { AuthStackParamList } from '../../app/navigation/types';

export function RegisterScreen({ navigation }: NativeStackScreenProps<AuthStackParamList, 'Register'>) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useAppDispatch();

  async function submit() {
    if (name.length < 2 || !email || phone.length < 10 || password.length < 6) {
      Alert.alert('Check the form', 'Name, email, 10-digit phone and a 6+ character password are required.');
      return;
    }
    try {
      const result = await register({
        name,
        email: email.trim(),
        phone,
        password,
        referralCode: referralCode || undefined,
      }).unwrap();
      if (!result.token) {
        throw new Error('No session token');
      }
      await tokenStorage.setSession(result);
      dispatch(
        setSession({
          token: result.token,
          user: result.user,
          profile: result.profile,
          walletBalance: result.walletBalance,
          coinBalance: result.coinBalance,
        }),
      );
    } catch (e) {
      Alert.alert('Could not register', e instanceof Error ? e.message : 'Try another email');
    }
  }

  return (
    <Screen>
      <Text style={styles.title}>Join LinenLane</Text>
      <Text style={styles.sub}>Customer registration only. Delivery riders are invited by admin.</Text>
      <Input label="Full name" value={name} onChangeText={setName} />
      <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <Input label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Input label="Referral code (optional)" value={referralCode} onChangeText={setReferralCode} />
      <Button title="Create account" onPress={submit} loading={isLoading} />
      <Pressable onPress={() => navigation.goBack()} style={{ marginTop: spacing.md }}>
        <Text style={{ color: colors.tealDark, fontWeight: '700', textAlign: 'center' }}>
          Already have an account
        </Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '800', color: colors.ink, marginBottom: 8 },
  sub: { color: colors.muted, marginBottom: spacing.lg, lineHeight: 20 },
});
