import React from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Card } from '../../components/Card';
import { Screen } from '../../components/Screen';
import { StatusBadge } from '../../components/StatusBadge';

import { colors, spacing } from '../../app/theme';

import {
  useDeliveryPickupsQuery,
  useUpdateDeliveryStatusMutation,
} from './deliveryApi';

export function DeliveryPickupsScreen() {
  const {
    data: pickups = [],
    isLoading,
    isError,
    refetch,
  } = useDeliveryPickupsQuery(undefined, {
    pollingInterval: 10000,
  });

  const [
    updateStatus,
    { isLoading: updating },
  ] = useUpdateDeliveryStatusMutation();

  const handleStatus = async (
    orderId: string,
    status:
      | 'OUT_FOR_PICKUP'
      | 'PICKED_UP',
  ) => {
    try {
      await updateStatus({
        orderId,
        status,
      }).unwrap();

      refetch();
    } catch (error: any) {
      Alert.alert(
        'Update failed',
        error?.data?.message ||
          'Unable to update order status.',
      );
    }
  };

  if (isLoading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>
            Loading pickups...
          </Text>
        </View>
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen>
        <Text style={styles.error}>
          Unable to load pickup assignments.
        </Text>

        <Pressable
          style={styles.retryButton}
          onPress={() => refetch()}
        >
          <Text style={styles.retryText}>
            Retry
          </Text>
        </Pressable>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.title}>
        Pickup queue
      </Text>

      <Text style={styles.subtitle}>
        Orders assigned to you
      </Text>

      {pickups.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>
            📦
          </Text>

          <Text style={styles.emptyTitle}>
            No pickups assigned
          </Text>

          <Text style={styles.emptyText}>
            New assignments from the admin will
            appear here.
          </Text>
        </Card>
      ) : (
        pickups.map(order => {
          const orderId =
            order._id ||
            order.id ||
            '';

          return (
            <Card
              key={orderId}
              style={styles.card}
            >
              <View style={styles.row}>
                <View>
                  <Text style={styles.id}>
                    {order.orderNumber ||
                      orderId}
                  </Text>

                  <Text style={styles.service}>
                    {order.serviceName ||
                      order.service?.name ||
                      'Laundry Service'}
                  </Text>
                </View>

                <StatusBadge
                  status={order.status}
                />
              </View>

              <View style={styles.divider} />

              <Text style={styles.label}>
                CUSTOMER
              </Text>

              <Text style={styles.customer}>
                {order.customer?.name ||
                  'Customer'}
              </Text>

              <Text style={styles.meta}>
                Phone:{' '}
                {order.customer?.phone ||
                  'Not available'}
              </Text>

              <View style={styles.addressBox}>
                <Text style={styles.label}>
                  PICKUP ADDRESS
                </Text>

                <Text style={styles.address}>
                  {order.pickupAddress ||
                    'Pickup address not available'}
                </Text>
              </View>

              <Text style={styles.meta}>
                Pickup:{' '}
                {order.pickupAt
                  ? new Date(
                      order.pickupAt,
                    ).toLocaleString()
                  : 'Not scheduled'}
              </Text>

              {order.status ===
                'PICKUP_ASSIGNED' && (
                <Pressable
                  disabled={updating}
                  style={styles.primaryButton}
                  onPress={() =>
                    handleStatus(
                      orderId,
                      'OUT_FOR_PICKUP',
                    )
                  }
                >
                  <Text style={styles.buttonText}>
                    {updating
                      ? 'Updating...'
                      : 'Start Pickup'}
                  </Text>
                </Pressable>
              )}

              {order.status ===
                'OUT_FOR_PICKUP' && (
                <Pressable
                  disabled={updating}
                  style={styles.primaryButton}
                  onPress={() =>
                    Alert.alert(
                      'Confirm pickup',
                      'Have you collected this order from the customer?',
                      [
                        {
                          text: 'Cancel',
                          style: 'cancel',
                        },
                        {
                          text: 'Confirm',
                          onPress: () =>
                            handleStatus(
                              orderId,
                              'PICKED_UP',
                            ),
                        },
                      ],
                    )
                  }
                >
                  <Text style={styles.buttonText}>
                    {updating
                      ? 'Updating...'
                      : 'Confirm Pickup'}
                  </Text>
                </Pressable>
              )}

              {order.status === 'PICKED_UP' && (
                <View style={styles.completedBox}>
                  <Text style={styles.completedText}>
                    ✓ Pickup completed
                  </Text>
                </View>
              )}
            </Card>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 4,
  },

  subtitle: {
    color: colors.muted,
    marginBottom: spacing.lg,
  },

  card: {
    marginBottom: spacing.md,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  id: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.ink,
  },

  service: {
    marginTop: 3,
    color: colors.tealDark,
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 14,
  },

  label: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.muted,
    marginBottom: 5,
  },

  customer: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 3,
  },

  meta: {
    color: colors.muted,
    marginTop: 8,
    lineHeight: 20,
  },

  addressBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#F7F7F8',
  },

  address: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '600',
  },

  primaryButton: {
    marginTop: 16,
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: colors.tealDark,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },

  completedBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#EAF7EE',
  },

  completedText: {
    fontWeight: '800',
    color: '#267A43',
    textAlign: 'center',
  },

  emptyCard: {
    alignItems: 'center',
    paddingVertical: 30,
  },

  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink,
  },

  emptyText: {
    marginTop: 6,
    textAlign: 'center',
    color: colors.muted,
    lineHeight: 20,
  },

  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },

  loadingText: {
    marginTop: 10,
    color: colors.muted,
  },

  error: {
    color: colors.ink,
    fontWeight: '600',
  },

  retryButton: {
    marginTop: 15,
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.tealDark,
  },

  retryText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});