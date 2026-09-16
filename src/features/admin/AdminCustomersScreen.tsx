import {
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

import {
  Loading,
  ErrorState,
} from '../../components/States';

import {
  useApproveServiceRequestMutation,
  useGetServiceRequestsQuery,
  useRejectServiceRequestMutation,
} from './adminApi';

import {
  colors,
  spacing,
} from '../../app/theme';

import { useAppDispatch } from '../../app/store';

export function AdminCustomersScreen() {
  const dispatch = useAppDispatch();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useGetServiceRequestsQuery();

  const [
    approveRequest,
    {
      isLoading: approving,
    },
  ] = useApproveServiceRequestMutation();

  const [
    rejectRequest,
    {
      isLoading: rejecting,
    },
  ] = useRejectServiceRequestMutation();

  async function handleApprove(
    id: string,
  ) {
    try {
      await approveRequest(id).unwrap();

      Alert.alert(
        'Success',
        'Customer request approved successfully.',
      );

      refetch();
    } catch (error: any) {
      Alert.alert(
        'Approval failed',
        error?.data?.message ||
          'Unable to approve request.',
      );
    }
  }

  async function handleReject(
    id: string,
  ) {
    try {
      await rejectRequest(id).unwrap();

      Alert.alert(
        'Success',
        'Customer request rejected successfully.',
      );

      refetch();
    } catch (error: any) {
      Alert.alert(
        'Rejection failed',
        error?.data?.message ||
          'Unable to reject request.',
      );
    }
  }


  if (isLoading) {
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  }

  if (error || !data) {
    return (
      <Screen>
        <ErrorState
          message="Customers unavailable"
          onRetry={refetch}
        />

      </Screen>
    );
  }

  const requests = data.data ?? [];

  return (
    <Screen>
      <Text style={styles.title}>
        Customer approvals
      </Text>

      {requests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            No customer requests
          </Text>

          <Text style={styles.emptyText}>
            There are no service requests available.
          </Text>
        </View>
      ) : (
        requests.map(item => (
          <Card
            key={item._id}
            style={styles.card}
          >
            <Text style={styles.name}>
              {item.name}
            </Text>

            <Text style={styles.meta}>
              {item.phone}
            </Text>

            <Text style={styles.meta}>
              {item.email}
            </Text>

            <Text style={styles.meta}>
              {item.address}
            </Text>

            <Text style={styles.meta}>
              Landmark: {item.landmark}
            </Text>

            <Text style={styles.meta}>
              {item.city} {item.pincode}
            </Text>

            <Text style={styles.meta}>
              Status: {item.status}
            </Text>

            {item.status === 'pending' && (
              <View style={styles.actions}>
                <Button
                  title={
                    approving
                      ? 'Approving...'
                      : 'Approve'
                  }
                  variant="primary"
                  onPress={() =>
                    handleApprove(item._id)
                  }
                  loading={approving}
                />

                <Button
                  title={
                    rejecting
                      ? 'Rejecting...'
                      : 'Reject'
                  }
                  variant="ghost"
                  onPress={() =>
                    handleReject(item._id)
                  }
                  loading={rejecting}
                />
              </View>
            )}
          </Card>
        ))
      )}

    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: spacing.md,
  },

  card: {
    marginBottom: spacing.md,
  },

  name: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink,
  },

  meta: {
    color: colors.muted,
    marginTop: 4,
  },

  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: spacing.md,
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.ink,
  },

  emptyText: {
    marginTop: spacing.sm,
    color: colors.muted,
    textAlign: 'center',
  },


});