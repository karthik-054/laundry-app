import React from 'react';

import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';

import {
  Loading,
  ErrorState,
  EmptyState,
} from '../../components/States';

import {
  useGetAdminOrdersQuery,
  useGetDeliveryPersonsQuery,
  useAssignOrderMutation,
  useUpdateAdminOrderStatusMutation,
} from '../admin/adminApi';

import {
  colors,
  spacing,
  radius,
} from '../../app/theme';

import {
  inr,
  formatWhen,
} from '../../utils/format';


// =====================================================
// COMPONENT
// =====================================================

export function AdminOrdersScreen() {

  // ===================================================
  // GET ORDERS
  // ===================================================

  const {
    data: orders = [],
    isLoading: ordersLoading,
    error: ordersError,
    refetch,
  } = useGetAdminOrdersQuery();


  // ===================================================
  // GET DELIVERY PERSONS
  // ===================================================

  const {
    data: deliveryPersons = [],
    isLoading: deliveryLoading,
  } = useGetDeliveryPersonsQuery();


  // ===================================================
  // ASSIGN ORDER
  // ===================================================

  const [
    assignOrder,
    {
      isLoading: assigning,
    },
  ] = useAssignOrderMutation();


  // ===================================================
  // UPDATE ORDER STATUS
  // ===================================================

  const [
    updateAdminOrderStatus,
    {
      isLoading: updatingStatus,
    },
  ] = useUpdateAdminOrderStatusMutation();


  // ===================================================
  // LOADING
  // ===================================================

  if (
    ordersLoading ||
    deliveryLoading
  ) {
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  }


  // ===================================================
  // ERROR
  // ===================================================

  if (ordersError) {
    return (
      <Screen>
        <ErrorState
          message="Orders unavailable"
          onRetry={refetch}
        />
      </Screen>
    );
  }


  // ===================================================
  // ASSIGN DELIVERY PERSON
  // ===================================================

  function selectDeliveryPerson(
    orderId: string,
  ) {

    if (
      !orderId
    ) {
      Alert.alert(
        'Assignment failed',
        'Order ID is missing.',
      );

      return;
    }


    if (
      deliveryPersons.length === 0
    ) {
      Alert.alert(
        'No delivery person',
        'Create a delivery person first.',
      );

      return;
    }


    Alert.alert(
      'Assign delivery person',
      'Choose a delivery person',

      deliveryPersons.map(
        person => ({

          text:
            person.busy
              ? `${person.name} (Busy)`
              : person.name,

          onPress:
            async () => {

              // =====================================
              // GET DELIVERY USER ID
              // =====================================

              const deliveryPersonId = person.id;


              // =====================================
              // DEBUG
              // =====================================

              console.log(
                '========== ASSIGN DELIVERY ==========',
              );

              console.log(
                'ORDER ID:',
                orderId,
              );

              console.log(
                'DELIVERY PERSON:',
                person,
              );

              console.log(
                'DELIVERY USER ID:',
                deliveryPersonId,
              );


              // =====================================
              // VALIDATE DELIVERY USER
              // =====================================

              if (!deliveryPersonId) {

                console.error(
                  'DELIVERY USER ID IS MISSING',
                  person,
                );

                Alert.alert(
                  'Assignment failed',
                  'Delivery person ID is missing.',
                );

                return;
              }


              // =====================================
              // FINAL PAYLOAD
              // =====================================

              const payload = {
                orderId,
                deliveryPersonId,
              };


              console.log(
                '========== ASSIGN PAYLOAD ==========',
              );

              console.log(
                JSON.stringify(
                  payload,
                  null,
                  2,
                ),
              );


              // =====================================
              // SEND REQUEST
              // =====================================

              try {

                const result =
                  await assignOrder(
                    payload,
                  ).unwrap();


                // ===================================
                // SUCCESS LOG
                // ===================================

                console.log(
                  '========== ASSIGN SUCCESS ==========',
                );

                console.log(
                  'ASSIGN RESPONSE:',
                  result,
                );


                // ===================================
                // SUCCESS MESSAGE
                // ===================================

                Alert.alert(
                  'Success',
                  `${person.name} has been assigned to this order.`,
                );


                // ===================================
                // REFRESH ORDERS
                // ===================================

                await refetch();

              } catch (
                error: any
              ) {

                // ===================================
                // ERROR LOG
                // ===================================

                console.error(
                  '========== ASSIGN ERROR ==========',
                );

                console.error(
                  'Assign error:',
                  error,
                );

                console.error(
                  'Assign error data:',
                  error?.data,
                );


                // ===================================
                // ERROR MESSAGE
                // ===================================

                const message =
                  error?.data?.message ||
                  error?.error ||
                  'Unable to assign the delivery person.';


                Alert.alert(
                  'Assignment failed',
                  message,
                );
              }
            },
        }),
      ),
    );
  }


  // ===================================================
  // UPDATE ORDER STATUS
  // ===================================================

  async function updateStatus(
    orderId: string,
    status:
      | 'PROCESSING'
      | 'READY_FOR_DELIVERY',
  ) {

    try {

      console.log(
        '========== UPDATE ORDER STATUS ==========',
      );

      console.log(
        'ORDER ID:',
        orderId,
      );

      console.log(
        'NEW STATUS:',
        status,
      );


      // =============================================
      // SEND STATUS REQUEST
      // =============================================

      const result =
        await updateAdminOrderStatus({
          orderId,
          status,
        }).unwrap();


      console.log(
        'STATUS UPDATE SUCCESS:',
        result,
      );


      // =============================================
      // SUCCESS MESSAGE
      // =============================================

      Alert.alert(
        'Success',

        status === 'PROCESSING'
          ? 'Order has started processing.'
          : 'Order is now ready for delivery.',
      );


      // =============================================
      // REFRESH ORDERS
      // =============================================

      await refetch();

    } catch (
      error: any
    ) {

      console.error(
        '========== UPDATE STATUS ERROR ==========',
      );

      console.error(
        'Update order status error:',
        error,
      );

      console.error(
        'Update status error data:',
        error?.data,
      );


      const message =
        error?.data?.message ||
        error?.error ||
        'Unable to update the order status.';


      Alert.alert(
        'Update failed',
        message,
      );
    }
  }


  // ===================================================
  // ACTIVE ORDERS
  // ===================================================

  const activeOrders =
    orders.filter(
      order =>
        order.status !==
        'DELIVERED',
    );


  // ===================================================
  // UI
  // ===================================================

  return (
    <Screen>

      {/* =========================================== */}
      {/* TITLE */}
      {/* =========================================== */}

      <Text
        style={
          styles.title
        }
      >
        Orders Board
      </Text>


      {/* =========================================== */}
      {/* EMPTY */}
      {/* =========================================== */}

      {activeOrders.length === 0 ? (
        <EmptyState
          title="No orders"
          body="Customer orders will appear here."
        />
      ) : null}


      {/* =========================================== */}
      {/* ORDERS */}
      {/* =========================================== */}

      {activeOrders.map(
        order => {

         const orderId = order.id;


          return (

            <Card
              key={orderId}
              style={
                styles.card
              }
            >

              {/* ================================= */}
              {/* ORDER HEADER */}
              {/* ================================= */}

              <View
                style={
                  styles.row
                }
              >

                <Text
                  style={
                    styles.id
                  }
                >
                  {
                    order.orderNumber ??
                    orderId
                  }
                </Text>


                <Text
                  style={[
                    styles.status,

                    order.status ===
                      'ORDER_CREATED'
                      ? styles.pending

                      : order.status ===
                        'PROCESSING'
                        ? styles.processing

                        : order.status ===
                          'READY_FOR_DELIVERY'
                          ? styles.ready

                          : styles.assigned,
                  ]}
                >
                  {
                    order.status ??
                    'UNKNOWN'
                  }
                </Text>

              </View>


              {/* ================================= */}
              {/* CUSTOMER */}
              {/* ================================= */}

              <Text
                style={
                  styles.customer
                }
              >
                Customer:{' '}

                {
                  order.customer?.name ??
                  'Customer'
                }
              </Text>


              {/* ================================= */}
              {/* PHONE */}
              {/* ================================= */}

              {order.customer?.phone ? (

                <Text
                  style={
                    styles.meta
                  }
                >
                  Phone:{' '}

                  {
                    order.customer.phone
                  }
                </Text>

              ) : null}


              {/* ================================= */}
              {/* EMAIL */}
              {/* ================================= */}

              {order.customer?.email ? (

                <Text
                  style={
                    styles.meta
                  }
                >
                  Email:{' '}

                  {
                    order.customer.email
                  }
                </Text>

              ) : null}


              {/* ================================= */}
              {/* SERVICE */}
              {/* ================================= */}

              <Text
                style={
                  styles.meta
                }
              >
                Service:{' '}

                {
                  order.serviceName ??
                  'Service'
                }
              </Text>


              {/* ================================= */}
              {/* AMOUNT */}
              {/* ================================= */}

              <Text
                style={
                  styles.meta
                }
              >
                Amount:{' '}

                {
                  inr(
                    order.finalAmount ??
                    0,
                  )
                }
              </Text>


              {/* ================================= */}
              {/* PAYMENT */}
              {/* ================================= */}

              <Text
                style={
                  styles.meta
                }
              >
                Payment:{' '}

                {
                  order.paymentStatus ??
                  'PENDING'
                }
              </Text>


              {/* ================================= */}
              {/* PAYMENT METHOD */}
              {/* ================================= */}

              {order.paymentMethod ? (

                <Text
                  style={
                    styles.meta
                  }
                >
                  Payment Method:{' '}

                  {
                    order.paymentMethod
                  }
                </Text>

              ) : null}


              {/* ================================= */}
              {/* PICKUP */}
              {/* ================================= */}

              <Text
                style={
                  styles.meta
                }
              >
                Pickup:{' '}

                {
                  order.pickupAt
                    ? formatWhen(
                        order.pickupAt,
                      )
                    : 'Not scheduled'
                }
              </Text>


              {/* ================================= */}
              {/* EXPECTED DELIVERY */}
              {/* ================================= */}

              {order.expectedDeliveryAt ? (

                <Text
                  style={
                    styles.meta
                  }
                >
                  Expected Delivery:{' '}

                  {
                    formatWhen(
                      order.expectedDeliveryAt,
                    )
                  }
                </Text>

              ) : null}


              {/* ================================= */}
              {/* PICKUP DELIVERY PERSON */}
              {/* ================================= */}

              {order.pickupDeliveryUser ? (

                <View
                  style={
                    styles.assignedBox
                  }
                >

                  <Text
                    style={
                      styles.assignedText
                    }
                  >
                    Pickup assigned to:{' '}

                    {
                      order
                        .pickupDeliveryUser
                        .name
                    }
                  </Text>


                  {order
                    .pickupDeliveryUser
                    .phone ? (

                    <Text
                      style={
                        styles.assignedPhone
                      }
                    >
                      Phone:{' '}

                      {
                        order
                          .pickupDeliveryUser
                          .phone
                      }
                    </Text>

                  ) : null}

                </View>

              ) : (

                <Pressable
                  onPress={() =>
                    selectDeliveryPerson(
                      orderId,
                    )
                  }

                  disabled={
                    assigning
                  }

                  style={[
                    styles.assignButton,

                    assigning &&
                      styles.disabledButton,
                  ]}
                >

                  <Text
                    style={
                      styles.assignText
                    }
                  >
                    {
                      assigning
                        ? 'Assigning...'
                        : 'Assign Delivery Person'
                    }
                  </Text>

                </Pressable>

              )}


              {/* ================================= */}
              {/* DROP DELIVERY PERSON */}
              {/* ================================= */}

              {order.dropDeliveryUser ? (

                <View
                  style={
                    styles.assignedBox
                  }
                >

                  <Text
                    style={
                      styles.assignedText
                    }
                  >
                    Delivery assigned to:{' '}

                    {
                      order
                        .dropDeliveryUser
                        .name
                    }
                  </Text>

                </View>

              ) : null}


              {/* ================================= */}
              {/* START PROCESSING */}
              {/* ================================= */}

              {order.status ===
                'PICKED_UP' && (

                <Pressable
                  onPress={() =>
                    updateStatus(
                      orderId,
                      'PROCESSING',
                    )
                  }

                  disabled={
                    updatingStatus
                  }

                  style={[
                    styles.processButton,

                    updatingStatus &&
                      styles.disabledButton,
                  ]}
                >

                  <Text
                    style={
                      styles.processText
                    }
                  >
                    {
                      updatingStatus
                        ? 'Starting...'
                        : 'Start Processing'
                    }
                  </Text>

                </Pressable>
              )}


              {/* ================================= */}
              {/* READY FOR DELIVERY */}
              {/* ================================= */}

              {order.status ===
                'PROCESSING' && (

                <Pressable
                  onPress={() =>
                    updateStatus(
                      orderId,
                      'READY_FOR_DELIVERY',
                    )
                  }

                  disabled={
                    updatingStatus
                  }

                  style={[
                    styles.readyButton,

                    updatingStatus &&
                      styles.disabledButton,
                  ]}
                >

                  <Text
                    style={
                      styles.readyText
                    }
                  >
                    {
                      updatingStatus
                        ? 'Updating...'
                        : 'Ready for Delivery'
                    }
                  </Text>

                </Pressable>
              )}


              {/* ================================= */}
              {/* CREATED DATE */}
              {/* ================================= */}

              {order.createdAt ? (

                <Text
                  style={
                    styles.created
                  }
                >
                  Created:{' '}

                  {
                    formatWhen(
                      order.createdAt,
                    )
                  }
                </Text>

              ) : null}

            </Card>
          );
        },
      )}

    </Screen>
  );
}


// =====================================================
// STYLES
// =====================================================

const styles =
  StyleSheet.create({

    title: {
      fontSize: 28,
      fontWeight: '800',
      color: colors.ink,
      marginBottom: spacing.md,
    },

    card: {
      marginBottom: spacing.md,
    },

    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },

    id: {
      fontWeight: '800',
      color: colors.ink,
      fontSize: 16,
      flex: 1,
      marginRight: spacing.sm,
    },

    customer: {
      color: colors.ink,
      fontWeight: '700',
      marginTop: 6,
    },

    meta: {
      color: colors.muted,
      marginTop: 5,
    },

    created: {
      color: colors.muted,
      fontSize: 12,
      marginTop: spacing.sm,
    },

    status: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: radius.md,
      fontSize: 12,
      fontWeight: '700',
    },

    pending: {
      backgroundColor: '#FFF3CD',
      color: '#856404',
    },

    assigned: {
      backgroundColor: '#E7F4F3',
      color: colors.teal,
    },

    processing: {
      backgroundColor: '#E8E0FF',
      color: '#7138F2',
    },

    ready: {
      backgroundColor: '#DFF6E8',
      color: '#168A5B',
    },

    assignButton: {
      marginTop: spacing.md,
      padding: spacing.md,
      backgroundColor: colors.teal,
      borderRadius: radius.md,
      alignItems: 'center',
    },

    assignText: {
      color: '#FFFFFF',
      fontWeight: '800',
    },

    processButton: {
      marginTop: spacing.md,
      paddingVertical: 13,
      borderRadius: radius.md,
      backgroundColor: '#7138F2',
      alignItems: 'center',
    },

    processText: {
      color: '#FFFFFF',
      fontWeight: '800',
      fontSize: 15,
    },

    readyButton: {
      marginTop: spacing.md,
      paddingVertical: 13,
      borderRadius: radius.md,
      backgroundColor: '#168A5B',
      alignItems: 'center',
    },

    readyText: {
      color: '#FFFFFF',
      fontWeight: '800',
      fontSize: 15,
    },

    disabledButton: {
      opacity: 0.6,
    },

    assignedBox: {
      marginTop: spacing.md,
      padding: spacing.sm,
      borderRadius: radius.md,
      backgroundColor: '#E7F4F3',
    },

    assignedText: {
      color: colors.teal,
      fontWeight: '700',
    },

    assignedPhone: {
      color: colors.muted,
      marginTop: 4,
      fontSize: 13,
    },

  });