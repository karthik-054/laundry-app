import { useMemo, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import {
  EmptyState,
  ErrorState,
  Loading,
} from '../../components/States';

import { colors, spacing } from '../../app/theme';
import { useOrdersQuery } from './orderApi';
import { formatWhen, inr } from '../../utils/format';
import type { CustomerStackParamList } from '../../app/navigation/types';

const FILTERS = [
  'all',
  'active',
  'completed',
  'cancelled',
] as const;

type Filter = (typeof FILTERS)[number];

const ACTIVE_STATUSES = [
  'ORDER_CREATED',
  'ADMIN_CONFIRMED',
  'PICKUP_ASSIGNED',
  'OUT_FOR_PICKUP',
  'PICKED_UP',
  'PROCESSING',
  'READY_FOR_DELIVERY',
  'OUT_FOR_DELIVERY',
];

export function OrderHistoryScreen() {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<CustomerStackParamList>
    >();

  const [filter, setFilter] = useState<Filter>('all');

  // IMPORTANT:
  // Your orderApi currently expects void.
  const {
    data,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useOrdersQuery();

  const orders = data ?? [];

  const filteredOrders = useMemo(() => {
    if (filter === 'all') {
      return orders;
    }

    if (filter === 'active') {
      return orders.filter(order =>
        ACTIVE_STATUSES.includes(order.status),
      );
    }

    if (filter === 'completed') {
      return orders.filter(
        order => order.status === 'DELIVERED',
      );
    }

    if (filter === 'cancelled') {
      return orders.filter(
        order => order.status === 'CANCELLED',
      );
    }

    return orders;
  }, [orders, filter]);

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={() => {
              refetch();
            }}
          />
        }
      >
        {/* TITLE */}
        <Text style={styles.title}>
          Orders
        </Text>

        {/* FILTERS */}
        <View style={styles.row}>
          {FILTERS.map(f => (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[
                styles.pill,
                filter === f && styles.pillOn,
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  filter === f &&
                    styles.pillTextOn,
                ]}
              >
                {f.charAt(0).toUpperCase() +
                  f.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* LOADING */}
        {isLoading ? <Loading /> : null}

        {/* ERROR */}
        {error ? (
          <ErrorState
            message="Could not load orders"
            onRetry={refetch}
          />
        ) : null}

        {/* EMPTY */}
        {!isLoading &&
        !error &&
        !filteredOrders.length ? (
          <EmptyState
            title="No orders here"
            body="Your laundry trail will show up after the first pickup."
          />
        ) : null}

        {/* ORDERS */}
        {!isLoading &&
          !error &&
          filteredOrders.map(order => (
            <Card
              key={order.id}
              style={styles.card}
              onPress={() =>
                navigation.navigate(
                  'OrderDetails',
                  {
                    orderId: order.id,
                  },
                )
              }
            >
              {/* ORDER NUMBER */}
              <Text style={styles.id}>
                {order.orderNumber}
              </Text>

              {/* SERVICE + DATE */}
              <Text style={styles.muted}>
                {order.serviceName} ·{' '}
                {formatWhen(order.createdAt)}
              </Text>

              {/* STATUS */}
              <View style={styles.statusContainer}>
                <StatusBadge
                  status={order.status}
                />
              </View>

              {/* AMOUNT */}
              <Text style={styles.amt}>
                {inr(order.finalAmount)} ·{' '}
                {order.paymentMethod}
              </Text>

              {/* COINS */}
              <Text style={styles.muted}>
                Coins used {order.coinsUsed} · earned{' '}
                {order.coinsEarned}
              </Text>
            </Card>
          ))}
      </ScrollView>
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

  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.md,
  },

  pill: {
    backgroundColor: colors.sand,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },

  pillOn: {
    backgroundColor: colors.teal,
  },

  pillText: {
    fontWeight: '700',
    color: colors.ink,
  },

  pillTextOn: {
    color: colors.white,
  },

  card: {
    marginBottom: spacing.sm,
  },

  id: {
    fontWeight: '800',
    color: colors.ink,
  },

  muted: {
    color: colors.muted,
    marginVertical: 4,
  },

  statusContainer: {
    marginVertical: 6,
  },

  amt: {
    fontWeight: '700',
    marginTop: 6,
    color: colors.ink,
  },
});