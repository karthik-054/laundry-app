import React, { useState } from 'react';

import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Screen } from '../../components/Screen';

import {
  Loading,
  ErrorState,
  EmptyState,
} from '../../components/States';

import {
  useGetAdminOrdersQuery,
} from './adminApi';

import {
  colors,
  spacing,
  radius,
} from '../../app/theme';

import {
  inr,
  formatWhen,
} from '../../utils/format';

export function AdminDeliveryHistoryScreen() {
  const {
    data: orders = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetAdminOrdersQuery();

  const [orderFilter, setOrderFilter] = useState('');

  // Only delivered orders
  const deliveredOrders = orders.filter(
    order => order.status === 'DELIVERED',
  );

  // Filter delivered orders by order number
  const filteredOrders = deliveredOrders.filter(order =>
    order.orderNumber
      ?.toLowerCase()
      .includes(orderFilter.trim().toLowerCase()),
  );

  if (isLoading) {
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <ErrorState
          message="Delivery history unavailable"
          onRetry={refetch}
        />
      </Screen>
    );
  }

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
        contentContainerStyle={styles.container}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View>
            <Text style={styles.title}>
              Delivery History
            </Text>

            <Text style={styles.subtitle}>
              Successfully delivered orders
            </Text>
          </View>

          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {filteredOrders.length}
            </Text>
          </View>
        </View>

        {/* ORDER FILTER */}

        <View style={styles.filterBox}>
          <Text style={styles.filterLabel}>
            FILTER BY ORDER NUMBER
          </Text>

          <TextInput
            value={orderFilter}
            onChangeText={setOrderFilter}
            placeholder="Enter order number (e.g. ORD001)"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="characters"
            autoCorrect={false}
            style={styles.filterInput}
          />

          {orderFilter.trim().length > 0 ? (
            <Text style={styles.filterResult}>
              {filteredOrders.length} order
              {filteredOrders.length === 1 ? '' : 's'} found
            </Text>
          ) : null}
        </View>

        {/* EMPTY */}

        {filteredOrders.length === 0 ? (
          <EmptyState
            title={
              orderFilter.trim()
                ? 'No matching order'
                : 'No delivered orders'
            }
            body={
              orderFilter.trim()
                ? `No delivered order found for "${orderFilter.trim()}".`
                : 'Orders will appear here after the delivery person completes the delivery.'
            }
          />
        ) : null}

        {/* DELIVERED ORDERS */}

        {filteredOrders.map(order => (
          <View
            key={order.id}
            style={styles.card}
          >
            {/* ORDER HEADER */}

            <View style={styles.orderHeader}>
              <View style={styles.orderHeaderLeft}>
                <Text style={styles.orderNumber}>
                  {order.orderNumber || order.id}
                </Text>

                <Text style={styles.deliveredLabel}>
                  ✓ DELIVERED
                </Text>
              </View>
            </View>

            {/* CUSTOMER */}

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                CUSTOMER
              </Text>

              <Text style={styles.customerName}>
                {order.customer?.name || 'Customer'}
              </Text>

              {order.customer?.phone ? (
                <Text style={styles.meta}>
                  Phone: {order.customer.phone}
                </Text>
              ) : null}

              {order.customer?.email ? (
                <Text style={styles.meta}>
                  Email: {order.customer.email}
                </Text>
              ) : null}
            </View>

            {/* SERVICE */}

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                Service
              </Text>

              <Text style={styles.infoValue}>
                {order.serviceName || 'Laundry Service'}
              </Text>
            </View>

            {/* AMOUNT */}

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                Amount
              </Text>

              <Text style={styles.amount}>
                {inr(order.finalAmount ?? 0)}
              </Text>
            </View>

            {/* PAYMENT */}

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                Payment
              </Text>

              <Text style={styles.infoValue}>
                {order.paymentStatus || 'PAID'}
              </Text>
            </View>

            {/* DELIVERY PERSON */}

            {order.dropDeliveryUser ? (
              <View style={styles.riderBox}>
                <Text style={styles.riderTitle}>
                  Delivery Person
                </Text>

                <Text style={styles.riderName}>
                  {order.dropDeliveryUser.name}
                </Text>

                {order.dropDeliveryUser.phone ? (
                  <Text style={styles.meta}>
                    Phone: {order.dropDeliveryUser.phone}
                  </Text>
                ) : null}
              </View>
            ) : order.pickupDeliveryUser ? (
              <View style={styles.riderBox}>
                <Text style={styles.riderTitle}>
                  Delivery Person
                </Text>

                <Text style={styles.riderName}>
                  {order.pickupDeliveryUser.name}
                </Text>

                {order.pickupDeliveryUser.phone ? (
                  <Text style={styles.meta}>
                    Phone: {order.pickupDeliveryUser.phone}
                  </Text>
                ) : null}
              </View>
            ) : null}

            {/* DELIVERY ADDRESS */}

            {order.deliveryAddress ? (
              <View style={styles.addressBox}>
                <Text style={styles.addressLabel}>
                  DELIVERY ADDRESS
                </Text>

                <Text style={styles.address}>
                  {order.deliveryAddress}
                </Text>
              </View>
            ) : null}

            {/* DELIVERY DATE */}

            <View style={styles.deliveryDateBox}>
              <View>
                <Text style={styles.dateLabel}>
                  EXPECTED DELIVERY
                </Text>

                <Text style={styles.dateValue}>
                  {order.expectedDeliveryAt
                    ? formatWhen(order.expectedDeliveryAt)
                    : 'Not available'}
                </Text>
              </View>

              <View style={styles.completedBadge}>
                <Text style={styles.completedText}>
                  Completed
                </Text>
              </View>
            </View>

            {/* CREATED */}

            {order.createdAt ? (
              <Text style={styles.created}>
                Order created: {formatWhen(order.createdAt)}
              </Text>
            ) : null}
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.ink,
  },

  subtitle: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 13,
  },

  countBadge: {
    minWidth: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#E8DDFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  countText: {
    color: '#7138F2',
    fontSize: 17,
    fontWeight: '900',
  },

  /* FILTER */

  filterBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,

    elevation: 2,

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 5,

    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  filterLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: colors.muted,
    marginBottom: 7,
  },

  filterInput: {
    height: 46,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 13,
    fontSize: 14,
    fontWeight: '600',
    color: colors.ink,
    backgroundColor: '#F9FAFB',
  },

  filterResult: {
    marginTop: 7,
    fontSize: 11,
    color: colors.muted,
  },

  /* CARD */

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: spacing.md,
    marginBottom: spacing.md,

    elevation: 2,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,

    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },

  orderHeaderLeft: {
    flex: 1,
  },

  orderNumber: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.ink,
  },

  deliveredLabel: {
    marginTop: 5,
    fontSize: 10,
    fontWeight: '900',
    color: '#168A5B',
  },

  section: {
    marginTop: spacing.md,
  },

  sectionLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: colors.muted,
  },

  customerName: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
  },

  meta: {
    marginTop: 4,
    fontSize: 12,
    color: colors.muted,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },

  infoLabel: {
    fontSize: 12,
    color: colors.muted,
  },

  infoValue: {
    maxWidth: '65%',
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'right',
  },

  amount: {
    fontSize: 15,
    fontWeight: '900',
    color: '#7138F2',
  },

  riderBox: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 14,
    backgroundColor: '#E7F4F3',
  },

  riderTitle: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: colors.muted,
  },

  riderName: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '800',
    color: colors.teal,
  },

  addressBox: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 14,
    backgroundColor: '#F7F7FA',
  },

  addressLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: colors.muted,
  },

  address: {
    marginTop: 5,
    fontSize: 12,
    lineHeight: 18,
    color: colors.ink,
  },

  deliveryDateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },

  dateLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.7,
    color: colors.muted,
  },

  dateValue: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '700',
    color: colors.ink,
  },

  completedBadge: {
    backgroundColor: '#DFF6E8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },

  completedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#168A5B',
  },

  created: {
    marginTop: spacing.md,
    fontSize: 10,
    color: colors.muted,
  },
});