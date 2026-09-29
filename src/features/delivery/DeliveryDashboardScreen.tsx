import React from 'react';

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Card } from '../../components/Card';
import { Screen } from '../../components/Screen';
import { colors, spacing } from '../../app/theme';
import { useAppSelector } from '../../app/store';

import {
  useDeliveryDashboardQuery,
} from './deliveryApi';
import { NotificationsScreen } from '../notifications/NotificationsScreen';

export function DeliveryDashboardScreen() {
  const user = useAppSelector(s => s.auth.user);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useDeliveryDashboardQuery(undefined, {
    pollingInterval: 10000,
  });

  if (isLoading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator size="large" />

          <Text style={styles.loadingText}>
            Loading dashboard...
          </Text>
        </View>
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.errorTitle}>
            Unable to load dashboard
          </Text>

          <Text style={styles.errorText}>
            Please check your connection.
          </Text>

          <Pressable
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryText}>
              Retry
            </Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  const stats = [
    {
      label: 'Pickups',
      value: data?.stats?.pickups ?? 0,
    },
    {
      label: 'Deliveries',
      value: data?.stats?.deliveries ?? 0,
    },
    {
      label: 'Completed',
      value: data?.stats?.completed ?? 0,
    },
    {
      label: 'Today',
      value: data?.stats?.todayCompleted ?? 0,
    },
  ];

  const nextOrder = data?.activeOrders?.[0];

  return (
    <Screen>
      <Text style={styles.eyebrow}>
        Delivery overview
      </Text>

      <Text style={styles.title}>
        Good morning, {user?.name ?? 'Rider'}
      </Text>

      <View style={styles.grid}>
        {stats.map(item => (
          <Card
            key={item.label}
            style={styles.statCard}
          >
            <Text style={styles.statLabel}>
              {item.label}
            </Text>

            <Text style={styles.statValue}>
              {item.value}
            </Text>
          </Card>
        ))}
      </View>

      <Text style={styles.section}>
        Next assignment
      </Text>

      <Card style={styles.summaryCard}>
        {nextOrder ? (
          <>
            <View style={styles.summaryHeader}>
              <View>
                <Text style={styles.orderNumber}>
                  {nextOrder.orderNumber ||
                    nextOrder._id ||
                    nextOrder.id}
                </Text>

                <Text style={styles.service}>
                  {nextOrder.serviceName ||
                    nextOrder.service?.name ||
                    'Laundry Service'}
                </Text>
              </View>

              <Text style={styles.status}>
                {nextOrder.status}
              </Text>
            </View>

            <Text style={styles.summaryRow}>
              <Text style={styles.bold}>
                Customer:
              </Text>{' '}
              {nextOrder.customer?.name ||
                'Customer'}
            </Text>

            <Text style={styles.summaryRow}>
              <Text style={styles.bold}>
                Pickup:
              </Text>{' '}
              {nextOrder.pickupAddress ||
                'Not available'}
            </Text>

            <Text style={styles.summaryRow}>
              <Text style={styles.bold}>
                Pickup time:
              </Text>{' '}
              {nextOrder.pickupAt
                ? new Date(
                    nextOrder.pickupAt,
                  ).toLocaleString()
                : 'Not available'}
            </Text>
          </>
        ) : (
          <Text style={styles.noAssignment}>
            No active assignments.
          </Text>
        )}
      </Card>

      <NotificationsScreen/>

      <Text style={styles.section}>
        Rider checklist
      </Text>

      <Card style={styles.summaryCard}>
        <Text style={styles.check}>
          ✓ Check route before leaving the hub
        </Text>

        <Text style={styles.check}>
          ✓ Confirm parcel condition at pickup
        </Text>

        <Text style={styles.check}>
          ✓ Verify customer and order number
        </Text>

        <Text style={styles.check}>
          ✓ Update status after pickup
        </Text>

        <Text style={styles.check}>
          ✓ Update status after delivery
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: colors.terracotta,
    fontWeight: '700',
    marginBottom: 6,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: spacing.lg,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: spacing.lg,
  },

  statCard: {
    width: '47%',
  },

  statLabel: {
    color: colors.muted,
    fontSize: 12,
  },

  statValue: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: '800',
    color: colors.tealDark,
  },

  section: {
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 8,
    marginTop: spacing.md,
  },

  summaryCard: {
    marginBottom: spacing.md,
  },

  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  orderNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
  },

  service: {
    color: colors.tealDark,
    marginTop: 3,
    fontWeight: '600',
  },

  status: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.terracotta,
  },

  summaryRow: {
    color: colors.ink,
    lineHeight: 22,
    marginBottom: 5,
  },

  bold: {
    fontWeight: '700',
  },

  noAssignment: {
    color: colors.muted,
  },

  check: {
    color: colors.ink,
    lineHeight: 24,
    marginBottom: 3,
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

  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink,
  },

  errorText: {
    marginTop: 6,
    color: colors.muted,
  },

  retryButton: {
    marginTop: 16,
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