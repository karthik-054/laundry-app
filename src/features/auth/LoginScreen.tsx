import { useState } from 'react';

import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Screen } from '../../components/Screen';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

import { colors, spacing } from '../../app/theme';

import { useLoginMutation } from './authApi';

import { setSession } from './authSlice';

import { useAppDispatch } from '../../app/store';

import { tokenStorage } from '../../services/tokenStorage';

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import type {
  AuthStackParamList,
} from '../../app/navigation/types';

export function LoginScreen({
  navigation,
}: NativeStackScreenProps<AuthStackParamList, 'Login'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [login, { isLoading }] =
    useLoginMutation();

  const dispatch = useAppDispatch();

  async function submit() {
    if (!email || !password) {
      Alert.alert(
        'Missing details',
        'Enter email and password.',
      );

      return;
    }

    try {
      const result = await login({
        email: email.trim(),
        password,
      }).unwrap();

      console.log('LOGIN RESPONSE:', result);
      console.log('USER ROLE:', result.user.role);

      if (!result.token) {
        throw new Error('No session token received');
      }

      // Save token permanently
      await tokenStorage.setSession(result);

      // Save token in Redux
      dispatch(
        setSession({
          token: result.token,
          user: result.user,
          profile: result.profile,
          walletBalance: result.walletBalance,
          coinBalance: result.coinBalance,
        }),
      );

      console.log('Login successful');

    } catch (error: any) {
      console.log('LOGIN ERROR:', error);

      Alert.alert(
        'Login failed',
        error?.data?.message ||
          error?.message ||
          'Check your credentials',
      );
    }
  }

  return (
    <Screen>
      <Text style={styles.kicker}>
        LinenLane
      </Text>

      <Text style={styles.title}>
        Cloth care,{'\n'}
        collected at the door.
      </Text>

      <Text style={styles.sub}>
        Sign in with your account.
      </Text>

      <View
        style={{
          height: spacing.lg,
        }}
      />

      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button
        title="Continue"
        onPress={submit}
        loading={isLoading}
      />

      <Pressable
        onPress={() =>
          navigation.navigate('Register')
        }
        style={styles.linkWrap}
      >
        <Text style={styles.link}>
          New customer? Create an account
        </Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    color: colors.terracotta,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 8,
  },

  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.ink,
    lineHeight: 36,
  },

  sub: {
    color: colors.muted,
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
  },

  linkWrap: {
    marginTop: spacing.md,
    alignItems: 'center',
  },

  link: {
    color: colors.tealDark,
    fontWeight: '700',
  },
});