
// import { useEffect } from 'react';
// import {
//   ActivityIndicator,
//   StyleSheet,
//   Text,
//   View,
// } from 'react-native';

// import { Screen } from '../../components/Screen';
// import { colors, spacing } from '../../app/theme';

// import {
//   useGetMyServiceRequestQuery,
// } from './customerApi';
// import type { NativeStackScreenProps } from '@react-navigation/native-stack';
// import type { CustomerStackParamList } from '../../app/navigation/types';

// export function WaitingForApproval({
//   navigation,
// }: NativeStackScreenProps<CustomerStackParamList, 'WaitingForApproval'>) {
//   const {
//     data,
//     isLoading,
//     isFetching,
//     isError,
//   } = useGetMyServiceRequestQuery(undefined, {
//     pollingInterval: 10000,
//     refetchOnFocus: true,
//     refetchOnReconnect: true,
//   });

//   const status = data?.request?.status;

//   useEffect(() => {
//     // Admin approved the request
//     if (status === 'approved') {
//       navigation.replace('Tabs');
//     }

//     // Admin rejected the request
//     if (status === 'rejected') {
//       navigation.replace('ServiceRequestRejected');
//     }
//   }, [status, navigation]);

//   // Initial loading
//   if (isLoading) {
//     return (
//       <Screen>
//         <View style={styles.container}>
//           <ActivityIndicator
//             size="large"
//             color={colors.terracotta}
//           />

//           <Text style={styles.loadingText}>
//             Checking your request...
//           </Text>
//         </View>
//       </Screen>
//     );
//   }

//   // API error
//   if (isError) {
//     return (
//       <Screen>
//         <View style={styles.container}>
//           <View style={styles.iconCircle}>
//             <Text style={styles.errorIcon}>!</Text>
//           </View>

//           <Text style={styles.title}>
//             Unable to check your request
//           </Text>

//           <Text style={styles.description}>
//             We couldn't get your latest request status.
//             Please check your internet connection.
//           </Text>

//           <Text style={styles.retryText}>
//             We will automatically try again.
//           </Text>

//           {isFetching && (
//             <ActivityIndicator
//               size="small"
//               color={colors.terracotta}
//               style={styles.bottomLoader}
//             />
//           )}
//         </View>
//       </Screen>
//     );
//   }

//   return (
//     <Screen>
//       <View style={styles.container}>
//         {/* Success Icon */}
//         <View style={styles.successCircle}>
//           <Text style={styles.checkIcon}>✓</Text>
//         </View>

//         {/* Title */}
//         <Text style={styles.title}>
//           Request Submitted
//         </Text>

//         {/* Description */}
//         <Text style={styles.description}>
//           Your service request has been submitted
//           successfully.
//         </Text>

//         {/* Status Card */}
//         <View style={styles.statusCard}>
//           <Text style={styles.statusLabel}>
//             Request Status
//           </Text>

//           <View style={styles.statusRow}>
//             <View style={styles.pendingDot} />

//             <Text style={styles.statusText}>
//               Waiting for Admin Approval
//             </Text>
//           </View>
//         </View>

//         {/* Information */}
//         <Text style={styles.infoText}>
//           Our admin team is reviewing your request.
//           You don't need to do anything right now.
//         </Text>

//         <Text style={styles.infoText}>
//           Once your request is approved, you will
//           automatically be taken to your dashboard.
//         </Text>

//         {/* Checking indicator */}
//         <View style={styles.checkingContainer}>
//           <ActivityIndicator
//             size="small"
//             color={colors.terracotta}
//           />

//           <Text style={styles.checkingText}>
//             {isFetching
//               ? 'Checking approval status...'
//               : 'Waiting for approval...'}
//           </Text>
//         </View>

//         {/* Current status */}
//         <Text style={styles.statusSmall}>
//           Status: {status ?? 'pending'}
//         </Text>
//       </View>
//     </Screen>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: spacing.lg,
//   },

//   successCircle: {
//     width: 96,
//     height: 96,
//     borderRadius: 48,
//     borderWidth: 3,
//     borderColor: colors.terracotta,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: spacing.lg,
//   },

//   checkIcon: {
//     fontSize: 48,
//     fontWeight: '800',
//     color: colors.terracotta,
//   },

//   iconCircle: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     borderWidth: 3,
//     borderColor: colors.terracotta,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: spacing.lg,
//   },

//   errorIcon: {
//     fontSize: 40,
//     fontWeight: '800',
//     color: colors.terracotta,
//   },

//   title: {
//     fontSize: 28,
//     lineHeight: 34,
//     fontWeight: '800',
//     color: colors.ink,
//     textAlign: 'center',
//   },

//   description: {
//     marginTop: spacing.md,
//     fontSize: 16,
//     lineHeight: 24,
//     color: colors.muted,
//     textAlign: 'center',
//     maxWidth: 340,
//   },

//   statusCard: {
//     width: '100%',
//     marginTop: spacing.xl,
//     padding: spacing.lg,
//     borderRadius: 16,
//     backgroundColor: '#F7F7F7',
//   },

//   statusLabel: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: colors.muted,
//     marginBottom: spacing.sm,
//     textTransform: 'uppercase',
//   },

//   statusRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },

//   pendingDot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: colors.terracotta,
//     marginRight: spacing.sm,
//   },

//   statusText: {
//     flex: 1,
//     fontSize: 16,
//     fontWeight: '700',
//     color: colors.ink,
//   },

//   infoText: {
//     marginTop: spacing.md,
//     fontSize: 14,
//     lineHeight: 21,
//     color: colors.muted,
//     textAlign: 'center',
//     maxWidth: 340,
//   },

//   checkingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: spacing.xl,
//   },

//   checkingText: {
//     marginLeft: spacing.sm,
//     fontSize: 13,
//     color: colors.muted,
//   },

//   statusSmall: {
//     marginTop: spacing.md,
//     fontSize: 12,
//     color: colors.muted,
//     textTransform: 'capitalize',
//   },

//   loadingText: {
//     marginTop: spacing.md,
//     fontSize: 15,
//     color: colors.muted,
//   },

//   retryText: {
//     marginTop: spacing.md,
//     fontSize: 14,
//     color: colors.muted,
//     textAlign: 'center',
//   },

//   bottomLoader: {
//     marginTop: spacing.lg,
//   },
// });





import { useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';

import { colors, spacing } from '../../app/theme';

import {
  useAppDispatch,
} from '../../app/store';

import {
  logout,
} from '../auth/authSlice';

import {
  useGetMyServiceRequestQuery,
} from './customerApi';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CustomerStackParamList } from '../../app/navigation/types';

type Props = NativeStackScreenProps<
  CustomerStackParamList,
  'WaitingForApproval'
>;

export function WaitingForApproval({
  navigation,
}: Props) {
  const dispatch = useAppDispatch();

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useGetMyServiceRequestQuery(undefined, {
    pollingInterval: 10000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const status = data?.request?.status;

 useEffect(() => {
  if (status === 'approved') {
    navigation.replace('Tabs');
  }

  if (status === 'rejected') {
    navigation.replace(
      'ServiceRequestRejected',
    );
  }
}, [status, navigation]);

  function handleLogout() {
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
          onPress: () => {
            dispatch(logout());
          },
        },
      ],
    );
  }

  // Initial loading
  if (isLoading) {
    return (
      <Screen>
        <View style={styles.container}>
          <ActivityIndicator
            size="large"
            color={colors.terracotta}
          />

          <Text style={styles.loadingText}>
            Checking your request...
          </Text>
        </View>
      </Screen>
    );
  }

  // API error
  if (isError) {
    return (
      <Screen>
        <View style={styles.container}>
          <View style={styles.iconCircle}>
            <Text style={styles.errorIcon}>
              !
            </Text>
          </View>

          <Text style={styles.title}>
            Unable to check your request
          </Text>

          <Text style={styles.description}>
            We couldn't get your latest request status.
            Please check your internet connection.
          </Text>

          <Text style={styles.retryText}>
            We will automatically try again.
          </Text>

          {isFetching && (
            <ActivityIndicator
              size="small"
              color={colors.terracotta}
              style={styles.bottomLoader}
            />
          )}

          <View style={styles.logoutContainer}>
            <Button
              title="Logout"
              onPress={handleLogout}
            />
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.container}>
        {/* Success Icon */}
        <View style={styles.successCircle}>
          <Text style={styles.checkIcon}>
            ✓
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          Request Submitted
        </Text>

        {/* Description */}
        <Text style={styles.description}>
          Your service request has been submitted
          successfully.
        </Text>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>
            Request Status
          </Text>

          <View style={styles.statusRow}>
            <View style={styles.pendingDot} />

            <Text style={styles.statusText}>
              Waiting for Admin Approval
            </Text>
          </View>
        </View>

        {/* Information */}
        <Text style={styles.infoText}>
          Our admin team is reviewing your request.
          You don't need to do anything right now.
        </Text>

        <Text style={styles.infoText}>
          Once your request is approved, you will
          automatically be taken to your dashboard.
        </Text>

        {/* Checking indicator */}
        <View style={styles.checkingContainer}>
          <ActivityIndicator
            size="small"
            color={colors.terracotta}
          />

          <Text style={styles.checkingText}>
            {isFetching
              ? 'Checking approval status...'
              : 'Waiting for approval...'}
          </Text>
        </View>

        {/* Current status */}
        <Text style={styles.statusSmall}>
          Status: {status ?? 'pending'}
        </Text>

        {/* Logout */}
        <View style={styles.logoutContainer}>
          <Button
            title="Logout"
            onPress={handleLogout}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },

  successCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: colors.terracotta,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  checkIcon: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.terracotta,
  },

  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.terracotta,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  errorIcon: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.terracotta,
  },

  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center',
  },

  description: {
    marginTop: spacing.md,
    fontSize: 16,
    lineHeight: 24,
    color: colors.muted,
    textAlign: 'center',
    maxWidth: 340,
  },

  statusCard: {
    width: '100%',
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: 16,
    backgroundColor: '#F7F7F7',
  },

  statusLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.muted,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  pendingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.terracotta,
    marginRight: spacing.sm,
  },

  statusText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
  },

  infoText: {
    marginTop: spacing.md,
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
    textAlign: 'center',
    maxWidth: 340,
  },

  checkingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
  },

  checkingText: {
    marginLeft: spacing.sm,
    fontSize: 13,
    color: colors.muted,
  },

  statusSmall: {
    marginTop: spacing.md,
    fontSize: 12,
    color: colors.muted,
    textTransform: 'capitalize',
  },

  loadingText: {
    marginTop: spacing.md,
    fontSize: 15,
    color: colors.muted,
  },

  retryText: {
    marginTop: spacing.md,
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
  },

  bottomLoader: {
    marginTop: spacing.lg,
  },

  logoutContainer: {
    width: '100%',
    marginTop: spacing.xl,
  },
});
