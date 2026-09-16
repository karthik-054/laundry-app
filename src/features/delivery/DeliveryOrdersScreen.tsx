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
  useActiveDeliveriesQuery,
  useAcceptDeliveryMutation,
  useUpdateDeliveryStatusMutation,
} from './deliveryApi';

export function DeliveryOrdersScreen() {
  // ==========================================
  // ACTIVE DELIVERIES
  // ==========================================

  const {
    data: deliveries = [],
    isLoading,
    isError,
    refetch,
  } = useActiveDeliveriesQuery(undefined, {
    pollingInterval: 10000,
  });


  // ==========================================
  // ACCEPT DELIVERY
  // ==========================================

  const [
    acceptDelivery,
    { isLoading: accepting },
  ] = useAcceptDeliveryMutation();


  // ==========================================
  // UPDATE DELIVERY STATUS
  // ==========================================

  const [
    updateStatus,
    { isLoading: updating },
  ] = useUpdateDeliveryStatusMutation();


  // ==========================================
  // ACCEPT DELIVERY
  // ==========================================

  const handleAcceptDelivery = async (
    orderId: string,
  ) => {
    try {
      await acceptDelivery(orderId).unwrap();

      Alert.alert(
        'Delivery Accepted',
        'You have accepted this delivery.',
      );

      refetch();
    } catch (error: any) {
      console.error(
        'Accept delivery error:',
        error,
      );

      Alert.alert(
        'Accept failed',
        error?.data?.message ||
          'Unable to accept this delivery.',
      );
    }
  };


  // ==========================================
  // START DELIVERY
  // ==========================================

  const handleStartDelivery = async (
    orderId: string,
  ) => {
    try {
      await updateStatus({
        orderId,
        status: 'OUT_FOR_DELIVERY',
      }).unwrap();

      Alert.alert(
        'Delivery Started',
        'The order is now out for delivery.',
      );

      refetch();
    } catch (error: any) {
      console.error(
        'Start delivery error:',
        error,
      );

      Alert.alert(
        'Update failed',
        error?.data?.message ||
          'Unable to start delivery.',
      );
    }
  };


  // ==========================================
  // MARK DELIVERED
  // ==========================================

  const handleDelivered = (
    orderId: string,
  ) => {
    Alert.alert(
      'Complete delivery',
      'Are you sure this order has been delivered to the customer?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Yes, Delivered',

          onPress: async () => {
            try {
              await updateStatus({
                orderId,
                status: 'DELIVERED',
              }).unwrap();

              Alert.alert(
                'Delivery Completed',
                'Order has been marked as delivered.',
              );

              refetch();
            } catch (error: any) {
              console.error(
                'Complete delivery error:',
                error,
              );

              Alert.alert(
                'Update failed',
                error?.data?.message ||
                  'Unable to complete delivery.',
              );
            }
          },
        },
      ],
    );
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (isLoading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator size="large" />

          <Text style={styles.loadingText}>
            Loading deliveries...
          </Text>
        </View>
      </Screen>
    );
  }


  // ==========================================
  // ERROR
  // ==========================================

  if (isError) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.errorTitle}>
            Unable to load deliveries
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


  // ==========================================
  // SCREEN
  // ==========================================

  return (
    <Screen>
      <Text style={styles.title}>
        Active deliveries
      </Text>

      <Text style={styles.subtitle}>
        Manage your assigned delivery orders
      </Text>


      {/* ======================================
          EMPTY STATE
      ====================================== */}

      {deliveries.length === 0 ? (
        <Card style={styles.emptyCard}>

          <Text style={styles.emptyTitle}>
            No active deliveries
          </Text>

          <Text style={styles.emptyText}>
            Orders assigned to you will appear
            here.
          </Text>
        </Card>
      ) : (

        /* ====================================
           DELIVERY CARDS
        ==================================== */

        deliveries.map(order => {
          const orderId =
            order._id ||
            order.id ||
            '';

          const amount =
            Number(order.finalAmount || 0);

          const isNewAssignment =
            order.status === 'PICKUP_ASSIGNED';

          const isAccepted =
            order.deliveryAccepted === true;

          return (
            <Card
              key={orderId}
              style={styles.card}
            >

              {/* =================================
                  HEADER
              ================================= */}

              <View style={styles.header}>
                <View style={styles.headerLeft}>
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


              {/* =================================
                  NEW ASSIGNMENT
              ================================= */}

              {isNewAssignment &&
                !isAccepted && (
                  <View style={styles.newAssignmentBox}>

                    <Text
                      style={
                        styles.newAssignmentTitle
                      }
                    >
                      New Delivery Assignment
                    </Text>

                    <Text
                      style={
                        styles.newAssignmentText
                      }
                    >
                      Admin has assigned this
                      order to you. Please accept
                      the delivery to continue.
                    </Text>

                    <Pressable
                      disabled={accepting}
                      style={[
                        styles.acceptButton,
                        accepting &&
                          styles.disabled,
                      ]}
                      onPress={() =>
                        handleAcceptDelivery(
                          orderId,
                        )
                      }
                    >
                      <Text
                        style={
                          styles.acceptButtonText
                        }
                      >
                        {accepting
                          ? 'Accepting...'
                          : 'Accept Delivery'}
                      </Text>
                    </Pressable>
                  </View>
                )}


              {/* =================================
                  ACCEPTED MESSAGE
              ================================= */}

              {isNewAssignment &&
                isAccepted && (
                  <View style={styles.acceptedBox}>

                    <Text
                      style={styles.acceptedTitle}
                    >
                      ✓ Delivery Accepted
                    </Text>

                    <Text
                      style={styles.acceptedText}
                    >
                      You have accepted this
                      delivery assignment.
                    </Text>

                    {order.deliveryAcceptedAt && (
                      <Text
                        style={
                          styles.acceptedTime
                        }
                      >
                        Accepted at:{' '}
                        {new Date(
                          order.deliveryAcceptedAt,
                        ).toLocaleString()}
                      </Text>
                    )}
                  </View>
                )}


              {/* =================================
                  CUSTOMER
              ================================= */}

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


              {/* =================================
                  DELIVERY ADDRESS
              ================================= */}

              <View style={styles.addressBox}>
                <Text style={styles.label}>
                  DELIVERY ADDRESS
                </Text>

                <Text style={styles.address}>
                  {order.deliveryAddress ||
                    'Delivery address not available'}
                </Text>
              </View>


              {/* =================================
                  EXPECTED DELIVERY
              ================================= */}

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>
                  Expected delivery
                </Text>

                <Text style={styles.infoValue}>
                  {order.expectedDeliveryAt
                    ? new Date(
                        order.expectedDeliveryAt,
                      ).toLocaleString()
                    : 'Not available'}
                </Text>
              </View>


              {/* =================================
                  PAYMENT
              ================================= */}

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>
                  Payment
                </Text>

                <Text style={styles.infoValue}>
                  {order.paymentStatus ||
                    'Pending'}
                </Text>
              </View>


              {/* =================================
                  PAYMENT METHOD
              ================================= */}

              {order.paymentMethod && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>
                    Payment method
                  </Text>

                  <Text
                    style={styles.infoValue}
                  >
                    {order.paymentMethod}
                  </Text>
                </View>
              )}


              {/* =================================
                  ORDER AMOUNT
              ================================= */}

              <View style={styles.amountRow}>
                <Text
                  style={styles.amountLabel}
                >
                  Order amount
                </Text>

                <Text style={styles.amount}>
                  ₹{amount.toFixed(2)}
                </Text>
              </View>


              {/* =================================
                  START DELIVERY

                  Only after:
                  READY_FOR_DELIVERY
              ================================= */}

              {order.status ===
                'READY_FOR_DELIVERY' && (
                <Pressable
                  disabled={updating}
                  style={[
                    styles.primaryButton,
                    updating &&
                      styles.disabled,
                  ]}
                  onPress={() =>
                    handleStartDelivery(
                      orderId,
                    )
                  }
                >
                  <Text
                    style={styles.buttonText}
                  >
                    {updating
                      ? 'Starting...'
                      : 'Start Delivery'}
                  </Text>
                </Pressable>
              )}


              {/* =================================
                  MARK DELIVERED

                  OUT_FOR_DELIVERY
              ================================= */}

              {order.status ===
                'OUT_FOR_DELIVERY' && (
                <Pressable
                  disabled={updating}
                  style={[
                    styles.completeButton,
                    updating &&
                      styles.disabled,
                  ]}
                  onPress={() =>
                    handleDelivered(
                      orderId,
                    )
                  }
                >
                  <Text
                    style={
                      styles.completeButtonText
                    }
                  >
                    {updating
                      ? 'Updating...'
                      : 'Mark Delivered'}
                  </Text>
                </Pressable>
              )}

            </Card>
          );
        })
      )}
    </Screen>
  );
}


// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

  // ==========================================
  // HEADER
  // ==========================================

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


  // ==========================================
  // CARD
  // ==========================================

  card: {
    marginBottom: spacing.md,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  headerLeft: {
    flex: 1,
    marginRight: 10,
  },

  orderNumber: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.ink,
  },

  service: {
    color: colors.tealDark,
    fontWeight: '600',
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 14,
  },


  // ==========================================
  // LABELS
  // ==========================================

  label: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.muted,
    marginBottom: 5,
  },


  // ==========================================
  // CUSTOMER
  // ==========================================

  customer: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
  },

  meta: {
    color: colors.muted,
    marginTop: 4,
  },


  // ==========================================
  // ADDRESS
  // ==========================================

  addressBox: {
    marginTop: 15,
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


  // ==========================================
  // INFO
  // ==========================================

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },

  infoLabel: {
    color: colors.muted,
  },

  infoValue: {
    color: colors.ink,
    fontWeight: '600',
    maxWidth: '55%',
    textAlign: 'right',
  },


  // ==========================================
  // AMOUNT
  // ==========================================

  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 14,
  },

  amountLabel: {
    color: colors.muted,
  },

  amount: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink,
  },


  // ==========================================
  // NEW ASSIGNMENT BOX
  // ==========================================

  newAssignmentBox: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#F1ECFF',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#D9CCFF',
  },

  newAssignmentTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#7138F2',
    marginBottom: 6,
  },

  newAssignmentText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.ink,
    marginBottom: 14,
  },


  // ==========================================
  // ACCEPT BUTTON
  // ==========================================

  acceptButton: {
    minHeight: 50,
    borderRadius: 10,
    backgroundColor: '#7138F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },


  // ==========================================
  // ACCEPTED BOX
  // ==========================================

  acceptedBox: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#E8F7EF',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#BDE8D0',
  },

  acceptedTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#168A5B',
  },

  acceptedText: {
    marginTop: 5,
    fontSize: 14,
    color: colors.ink,
  },

  acceptedTime: {
    marginTop: 6,
    fontSize: 12,
    color: colors.muted,
  },


  // ==========================================
  // START DELIVERY
  // ==========================================

  primaryButton: {
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: colors.tealDark,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },


  // ==========================================
  // COMPLETE DELIVERY
  // ==========================================

  completeButton: {
    minHeight: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.tealDark,
    alignItems: 'center',
    justifyContent: 'center',
  },

  completeButtonText: {
    color: colors.tealDark,
    fontSize: 15,
    fontWeight: '800',
  },


  // ==========================================
  // DISABLED
  // ==========================================

  disabled: {
    opacity: 0.5,
  },


  // ==========================================
  // EMPTY
  // ==========================================

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


  // ==========================================
  // CENTER / LOADING
  // ==========================================

  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },

  loadingText: {
    marginTop: 10,
    color: colors.muted,
  },


  // ==========================================
  // ERROR
  // ==========================================

  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink,
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