import { useState } from 'react';

import {
  Alert,
  StyleSheet,
  Text,
} from 'react-native';

import { Screen } from '../../components/Screen';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

import {
  colors,
  spacing,
} from '../../app/theme';

import {
  useAppSelector,
} from '../../app/store';

import {
  useSubmitServiceRequestMutation,
} from './customerApi';

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import type {
  CustomerStackParamList,
} from '../../app/navigation/types';

type Props = NativeStackScreenProps<
  CustomerStackParamList,
  'Onboarding'
>;

export function OnboardingScreen({
  navigation,
}: Props) {
  const user = useAppSelector(
    state => state.auth.user,
  );

  const profile = useAppSelector(
    state => state.auth.profile,
  );

  const [name, setName] = useState(
    user?.name ?? '',
  );

  const [phone, setPhone] = useState(
    user?.phone ?? '',
  );

  const [email, setEmail] = useState(
    user?.email ?? '',
  );

  const [address, setAddress] = useState(
    profile?.address ?? '',
  );

  const [landmark, setLandmark] = useState(
    profile?.landmark ?? '',
  );

  const [city, setCity] = useState(
    profile?.city ?? '',
  );

  const [pincode, setPincode] = useState(
    profile?.pincode ?? '',
  );

  const [
    submitServiceRequest,
    { isLoading },
  ] = useSubmitServiceRequestMutation();

  async function submit() {
    if (name.trim().length < 2) {
      Alert.alert(
        'Invalid name',
        'Please enter a valid name.',
      );
      return;
    }

    if (phone.trim().length < 10) {
      Alert.alert(
        'Invalid phone',
        'Please enter a valid phone number.',
      );
      return;
    }

    if (email.trim().length < 5) {
      Alert.alert(
        'Invalid email',
        'Please enter a valid email address.',
      );
      return;
    }

    if (address.trim().length < 6) {
      Alert.alert(
        'Invalid address',
        'Please enter your complete address.',
      );
      return;
    }

    if (landmark.trim().length < 2) {
      Alert.alert(
        'Invalid landmark',
        'Please enter a landmark.',
      );
      return;
    }

    if (city.trim().length < 2) {
      Alert.alert(
        'Invalid city',
        'Please enter your city.',
      );
      return;
    }

    if (pincode.trim().length < 4) {
      Alert.alert(
        'Invalid pincode',
        'Please enter a valid pincode.',
      );
      return;
    }

    try {
      const response =
        await submitServiceRequest({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          address: address.trim(),
          landmark: landmark.trim(),
          city: city.trim(),
          pincode: pincode.trim(),
        }).unwrap();

      console.log(
        'Service request:',
        response.request,
      );

      navigation.replace(
        'WaitingForApproval',
      );
    } catch (error: any) {
      console.log(
        'Service request error:',
        error,
      );

      Alert.alert(
        'Could not submit',
        error?.data?.message ||
          error?.message ||
          'Something went wrong. Please try again.',
      );
    }
  }

  return (
    <Screen>
      <Text style={styles.kicker}>
        Step 1 of 2
      </Text>

      <Text style={styles.title}>
        Where should we collect?
      </Text>

      <Text style={styles.sub}>
        Admin reviews every new service request
        before orders open.
      </Text>

      <Input
        label="Name"
        value={name}
        onChangeText={setName}
      />

      <Input
        label="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Input
        label="Address"
        value={address}
        onChangeText={setAddress}
      />

      <Input
        label="Landmark"
        value={landmark}
        onChangeText={setLandmark}
      />

      <Input
        label="City"
        value={city}
        onChangeText={setCity}
      />

      <Input
        label="Pincode"
        value={pincode}
        onChangeText={setPincode}
        keyboardType="number-pad"
      />

      <Button
        title="Submit service request"
        onPress={submit}
        loading={isLoading}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    color: colors.terracotta,
    fontWeight: '700',
    marginBottom: 6,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.ink,
  },

  sub: {
    color: colors.muted,
    marginVertical: spacing.md,
    lineHeight: 20,
  },
});