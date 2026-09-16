import { Alert } from 'react-native';

import { Button } from './Button';

import {
  useAppDispatch,
} from '../app/store';

import {
  logout,
} from '../features/auth/authSlice';

import {
  tokenStorage,
} from '../services/tokenStorage';

export function LogoutButton() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',

          onPress: async () => {
            try {
              // 1. Remove saved session
              await tokenStorage.clear();

              // 2. Clear Redux session
              dispatch(logout());

              console.log(
                'User logged out successfully',
              );
            } catch (error) {
              console.error(
                'Logout error:',
                error,
              );

              // Still clear Redux state
              dispatch(logout());
            }
          },
        },
      ],
    );
  };

  return (
    <Button
      title="Logout"
      variant="ghost"
      onPress={handleLogout}
    />
  );
}