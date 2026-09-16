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
import { StatusBadge } from '../../components/StatusBadge';

import { colors, spacing } from '../../app/theme';

import {
  useDeliveryHistoryQuery,
} from './deliveryApi';

export function DeliveryHistoryScreen() {
  const {
    data: history = [],
    isLoading,
    isError,
    refetch,
  } = useDeliveryHistoryQuery();

  if (isLoading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator size="large" />

          <Text style={styles.loadingText}>
            Loading history...
          </Text>
        </View>
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen>
        <Text style={styles.error}>
          Unable to load delivery history.
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
        Delivery history
      </Text>

      <Text style={styles.subtitle}>
        Your completed delivery activity
      </Text>

      {history.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>
            No history yet
          </Text>

          <Text style={styles.emptyText}>
            Completed deliveries will appear here.
          </Text>
        </Card>
      ) : (
        history.map(order => {
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
                  <Text style={styles.orderNumber}>
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

              <Text style={styles.customer}>
                {order.customer?.name ||
                  'Customer'}
              </Text>

              <Text style={styles.address}>
                {order.deliveryAddress ||
                  'Address not available'}
              </Text>

              <Text style={styles.meta}>
                {order.updatedAt
                  ? new Date(
                      order.updatedAt,
                    ).toLocaleString()
                  : 'Date not available'}
              </Text>

              {typeof order.finalAmount ===
                'number' && (
                <Text style={styles.amount}>
                  ₹
                  {order.finalAmount.toFixed(2)}
                </Text>
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

  orderNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
  },

  service: {
    color: colors.tealDark,
    fontWeight: '600',
    marginTop: 3,
  },

  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 12,
  },

  customer: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 5,
  },

  address: {
    color: colors.muted,
    lineHeight: 20,
  },

  meta: {
    color: colors.muted,
    marginTop: 8,
  },

  amount: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
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
    color: colors.muted,
    textAlign: 'center',
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