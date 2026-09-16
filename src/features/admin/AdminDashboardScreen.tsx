import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Screen,
} from '../../components/Screen';

import {
  Card,
} from '../../components/Card';

import {
  Loading,
  ErrorState,
} from '../../components/States';

import {
  useGetServiceRequestsQuery,
  useGetAdminOrdersQuery,
} from './adminApi';

import {
  colors,
  spacing,
} from '../../app/theme';



// ============================================
// COMPONENT
// ============================================

export function AdminDashboardScreen() {

  // ==========================================
  // SERVICE REQUESTS
  // ==========================================

  const {
    data: serviceRequestData,
    isLoading: requestsLoading,
    error: requestsError,
    refetch: refetchRequests,
  } =
    useGetServiceRequestsQuery();

  // ==========================================
  // ORDERS
  // ==========================================

  const {
    data: orders = [],
    isLoading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } =
    useGetAdminOrdersQuery();

  // ==========================================
  // LOADING
  // ==========================================

  if (
    requestsLoading ||
    ordersLoading
  ) {
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (
    requestsError ||
    ordersError
  ) {
    return (
      <Screen>
        <ErrorState
          message="Dashboard unavailable"
          onRetry={() => {
            refetchRequests();
            refetchOrders();
          }}
        />
      </Screen>
    );
  }

  // ==========================================
  // SERVICE REQUEST DATA
  // ==========================================

  const requests =
    serviceRequestData?.data ?? [];

  const pendingApprovals =
    requests.filter(
      item =>
        item.status ===
        'pending',
    ).length;

  const approvedCustomers =
    requests.filter(
      item =>
        item.status ===
        'approved',
    ).length;

  const rejectedRequests =
    requests.filter(
      item =>
        item.status ===
        'rejected',
    ).length;

  // ==========================================
  // ORDER DATA
  // ==========================================

  const pendingOrders =
    orders.filter(
      order =>
        order.status ===
        'PENDING',
    ).length;

  const assignedOrders =
    orders.filter(
      order =>
        order.pickupDeliveryUser !==
        null,
    ).length;

  const totalOrders =
    orders.length;

  // ==========================================
  // DASHBOARD CELLS
  // ==========================================

  const cells = [
    {
      label:
        'Pending Approvals',

      value:
        pendingApprovals,
    },

    {
      label:
        'Approved Customers',

      value:
        approvedCustomers,
    },

    {
      label:
        'Rejected Requests',

      value:
        rejectedRequests,
    },

    {
      label:
        'Total Requests',

      value:
        requests.length,
    },

    {
      label:
        'Total Orders',

      value:
        totalOrders,
    },

    {
      label:
        'Pending Orders',

      value:
        pendingOrders,
    },

    {
      label:
        'Assigned Orders',

      value:
        assignedOrders,
    },
  ];

  // ==========================================
  // UI
  // ==========================================

  return (
    <Screen>

      {/* ==================================== */}
      {/* TITLE */}
      {/* ==================================== */}

      <Text
        style={
          styles.title
        }
      >
        Admin Dashboard
      </Text>

      <Text
        style={
          styles.subtitle
        }
      >
        Manage customers, orders and deliveries
      </Text>

      {/* ==================================== */}
      {/* STATISTICS */}
      {/* ==================================== */}

      <View
        style={
          styles.grid
        }
      >

        {cells.map(
          item => (

            <Card
              key={
                item.label
              }
              style={
                styles.cell
              }
            >

              <Text
                style={
                  styles.label
                }
              >
                {
                  item.label
                }
              </Text>

              <Text
                style={
                  styles.value
                }
              >
                {
                  item.value
                }
              </Text>

            </Card>

          ),
        )}

      </View>

      {/* ==================================== */}
      {/* LOGOUT */}
      {/* ==================================== */}

      <View
        style={
          styles.logout
        }
      >
      </View>

    </Screen>
  );
}

// ============================================
// STYLES
// ============================================

const styles =
  StyleSheet.create({

    title: {
      fontSize: 28,

      fontWeight: '800',

      color:
        colors.ink,

      marginBottom: 4,
    },

    subtitle: {
      color:
        colors.muted,

      marginBottom:
        spacing.md,
    },

    grid: {
      flexDirection:
        'row',

      flexWrap:
        'wrap',

      justifyContent:
        'space-between',
    },

    cell: {
      width:
        '48%',

      marginBottom:
        spacing.md,
    },

    label: {
      color:
        colors.muted,

      fontSize: 12,

      fontWeight:
        '600',
    },

    value: {
      marginTop: 6,

      fontSize: 24,

      fontWeight:
        '800',

      color:
        colors.tealDark,
    },

    logout: {
      marginTop:
        spacing.md,
    },

  });