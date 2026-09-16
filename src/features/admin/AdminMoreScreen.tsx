import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

import { useState } from 'react'

import { Screen } from '../../components/Screen'
import { Card } from '../../components/Card'
import { LogoutButton } from '../../components/LogoutButton'

import { useCreateDeliveryUserMutation, useReportsQuery } from './adminApi'

import { Loading, ErrorState } from '../../components/States'

import { colors, spacing, radius } from '../../app/theme'
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { AdminStackParamList } from '../../app/navigation/types';

// ============================================
// COMPONENT
// ============================================

export function AdminMoreScreen () {
  // ==========================================
  // DELIVERY PERSON FORM
  // ==========================================

  const [name, setName] = useState('')

  const [email, setEmail] = useState('')

  const [phone, setPhone] = useState('')

  const [password, setPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)

    const navigation =
    useNavigation<NativeStackNavigationProp<AdminStackParamList>>();

  // ==========================================
  // API
  // ==========================================

  const [createDeliveryUser, { isLoading: creating }] =
    useCreateDeliveryUserMutation()

  const { data, isLoading, error, refetch } = useReportsQuery()
  console.log('REPORT DATA:', data)
  console.log('REPORT ERROR:', error)
  // ==========================================
  // CREATE DELIVERY PERSON
  // ==========================================

  async function handleCreateDeliveryPerson () {
    // ----------------------------
    // VALIDATION
    // ----------------------------

    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter the delivery person name.')

      return
    }

    if (!email.trim()) {
      Alert.alert('Email required', 'Please enter the email address.')

      return
    }

    if (!phone.trim()) {
      Alert.alert('Phone required', 'Please enter the phone number.')

      return
    }

    if (!password.trim()) {
      Alert.alert('Password required', 'Please enter a password.')

      return
    }

    if (password.length < 6) {
      Alert.alert(
        'Invalid password',
        'Password must contain at least 6 characters.',
      )

      return
    }

    // ----------------------------
    // CREATE USER
    // ----------------------------

    try {
      await createDeliveryUser({
        name: name.trim(),

        email: email.trim().toLowerCase(),

        phone: phone.trim(),

        password,
      }).unwrap()

      // ----------------------------
      // SUCCESS
      // ----------------------------

      Alert.alert(
        'Delivery person created',
        `${name} can now log in using the credentials created by the admin.`,
      )

      // ----------------------------
      // RESET FORM
      // ----------------------------

      setName('')
      setEmail('')
      setPhone('')
      setPassword('')
    } catch (error: any) {
      console.error('Create delivery person error:', error)

      Alert.alert(
        'Creation failed',
        error?.data?.message ?? 'Unable to create the delivery person.',
      )
    }
  }

  // ==========================================
  // REPORT LOADING
  // ==========================================

  if (isLoading) {
    return (
      <Screen>
        <Loading />
      </Screen>
    )
  }

  // ==========================================
  // REPORT ERROR
  // ==========================================

  if (error) {
    return (
      <Screen>
        <ErrorState message='Reports unavailable' onRetry={refetch} />
      </Screen>
    )
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ================================ */}
          {/* TITLE */}
          {/* ================================ */}

          <Text style={styles.title}>Admin Settings</Text>

          <Text style={styles.subtitle}>
            Manage delivery users and account settings
          </Text>

          {/* ================================ */}
          {/* CREATE DELIVERY PERSON */}
          {/* ================================ */}

          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Create Delivery Person</Text>

            <Text style={styles.description}>
              Create login credentials for a new delivery person.
            </Text>

            {/* ============================ */}
            {/* NAME */}
            {/* ============================ */}

            <Text style={styles.label}>Full Name</Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder='Enter full name'
              placeholderTextColor={colors.muted}
              style={styles.input}
              autoCapitalize='words'
            />

            {/* ============================ */}
            {/* EMAIL */}
            {/* ============================ */}

            <Text style={styles.label}>Email Address</Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder='Enter email address'
              placeholderTextColor={colors.muted}
              style={styles.input}
              keyboardType='email-address'
              autoCapitalize='none'
              autoCorrect={false}
            />

            {/* ============================ */}
            {/* PHONE */}
            {/* ============================ */}

            <Text style={styles.label}>Phone Number</Text>

            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder='Enter phone number'
              placeholderTextColor={colors.muted}
              style={styles.input}
              keyboardType='phone-pad'
            />

            {/* ============================ */}
            {/* PASSWORD */}
            {/* ============================ */}

            <Text style={styles.label}>Password</Text>

            <View style={styles.passwordContainer}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder='Create password'
                placeholderTextColor={colors.muted}
                secureTextEntry={!showPassword}
                style={styles.passwordInput}
                autoCapitalize='none'
              />

              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.showPassword}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </Pressable>
            </View>

            {/* ============================ */}
            {/* CREATE BUTTON */}
            {/* ============================ */}

            <Pressable
              onPress={handleCreateDeliveryPerson}
              disabled={creating}
              style={[styles.createButton, creating && styles.disabledButton]}
            >
              <Text style={styles.createButtonText}>
                {creating ? 'Creating...' : 'Create Delivery Person'}
              </Text>
            </Pressable>
          </Card>

          {/* ================================ */}
          {/* LOGIN INFORMATION */}
          {/* ================================ */}

          {/* <Card style={styles.infoCard}>

            <Text style={styles.cardTitle}>
              Delivery Person Login
            </Text>

            <Text style={styles.infoText}>
              The delivery person can log in using the email and password created above.
            </Text>

            <View style={styles.infoBox}>

              <Text style={styles.infoLabel}>
                Login Role
              </Text>

              <Text style={styles.infoValue}>
                Delivery
              </Text>

            </View>

          </Card> */}

          {/* ================================ */}
          {/* REPORTS */}
          {/* ================================ */}

          {/* ================================ */}
          {/* REPORTS */}
          {/* ================================ */}

          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Reports</Text>

            <Text style={styles.description}>
              Business reports and analytics
            </Text>

            <View style={styles.reportsContainer}>
              {/* Report Header */}
              <View style={styles.reportHeader}>
                <View>
                  <Text style={styles.reportTitle}>Business Reports</Text>

                  <Text style={styles.reportSubtitle}>
                    Overview of your laundry business
                  </Text>
                </View>

                <View style={styles.reportIcon}>
                  <Text style={styles.reportIconText}>📊</Text>
                </View>
              </View>

              {/* Revenue */}
              <View style={styles.revenueCard}>
                <View style={styles.revenueTopRow}>
                  <View>
                    <Text style={styles.revenueLabel}>TOTAL REVENUE</Text>

                    <Text style={styles.revenueAmount}>
                      ₹{Number(data?.totalRevenue ?? 0).toLocaleString('en-IN')}
                    </Text>

                    <Text style={styles.revenueDescription}>
                      Revenue generated from all orders
                    </Text>
                  </View>

                  <View style={styles.revenueIcon}>
                    <Text style={styles.revenueIconText}>₹</Text>
                  </View>
                </View>
              </View>

              {/* Statistics */}
              <View style={styles.statsGrid}>
                {/* Total Orders */}
                <View style={styles.statCard}>
                  <View style={[styles.statIcon, styles.ordersIcon]}>
                    <Text style={styles.statIconText}>🧾</Text>
                  </View>

                  <Text style={styles.statLabel}>TOTAL ORDERS</Text>

                  <Text style={styles.statValue}>{data?.totalOrders ?? 0}</Text>

                  <Text style={styles.statDescription}>All orders</Text>
                </View>

                {/* Pending */}
                <View style={styles.statCard}>
                  <View style={[styles.statIcon, styles.pendingIcon]}>
                    <Text style={styles.statIconText}>⏳</Text>
                  </View>

                  <Text style={styles.statLabel}>PENDING</Text>

                  <Text style={styles.statValue}>
                    {data?.pendingOrders ?? 0}
                  </Text>

                  <Text style={styles.statDescription}>Need attention</Text>
                </View>

                {/* Completed */}
                <View style={styles.statCard}>
                  <View style={[styles.statIcon, styles.completedIcon]}>
                    <Text style={styles.statIconText}>✓</Text>
                  </View>

                  <Text style={styles.statLabel}>COMPLETED</Text>

                  <Text style={styles.statValue}>
                    {data?.completedOrders ?? 0}
                  </Text>

                  <Text style={styles.statDescription}>
                    Successfully delivered
                  </Text>
                </View>

                {/* Average Order */}
                <View style={styles.statCard}>
                  <View style={[styles.statIcon, styles.averageIcon]}>
                    <Text style={styles.statIconText}>₹</Text>
                  </View>

                  <Text style={styles.statLabel}>AVG. ORDER</Text>

                  <Text style={styles.statValue}>
                    ₹
                    {data?.totalOrders
                      ? Math.round(
                          Number(data.totalRevenue ?? 0) /
                            Number(data.totalOrders ?? 0),
                        ).toLocaleString('en-IN')
                      : '0'}
                  </Text>

                  <Text style={styles.statDescription}>Per order</Text>
                </View>
              </View>

              {/* Order Status */}
              <View style={styles.statusCard}>
                <View style={styles.statusHeader}>
                  <View>
                    <Text style={styles.statusTitle}>Order Status</Text>

                    <Text style={styles.statusSubtitle}>
                      Current order distribution
                    </Text>
                  </View>

                  <Text style={styles.statusTotal}>
                    {data?.totalOrders ?? 0} Total
                  </Text>
                </View>

                {/* Completed */}
                <View style={styles.statusRow}>
                  <View style={styles.statusRowLeft}>
                    <View style={[styles.statusDot, styles.completedDot]} />

                    <Text style={styles.statusName}>Completed</Text>
                  </View>

                  <Text style={styles.statusNumber}>
                    {data?.completedOrders ?? 0}
                  </Text>
                </View>

                <View style={styles.progressBackground}>
                  <View
                    style={[
                      styles.progressCompleted,
                      {
                        width: `${
                          data?.totalOrders
                            ? Math.min(
                                (Number(data.completedOrders ?? 0) /
                                  Number(data.totalOrders ?? 0)) *
                                  100,
                                100,
                              )
                            : 0
                        }%`,
                      },
                    ]}
                  />
                </View>

                {/* Pending */}
                <View style={styles.statusRow}>
                  <View style={styles.statusRowLeft}>
                    <View style={[styles.statusDot, styles.pendingDot]} />

                    <Text style={styles.statusName}>Pending</Text>
                  </View>

                  <Text style={styles.statusNumber}>
                    {data?.pendingOrders ?? 0}
                  </Text>
                </View>

                <View style={styles.progressBackground}>
                  <View
                    style={[
                      styles.progressPending,
                      {
                        width: `${
                          data?.totalOrders
                            ? Math.min(
                                (Number(data.pendingOrders ?? 0) /
                                  Number(data.totalOrders ?? 0)) *
                                  100,
                                100,
                              )
                            : 0
                        }%`,
                      },
                    ]}
                  />
                </View>
              </View>

              {/* Business Summary */}
              <View style={styles.summaryCard}>
                <View style={styles.summaryIcon}>
                  <Text style={styles.summaryIconText}>💡</Text>
                </View>

                <View style={styles.summaryContent}>
                  <Text style={styles.summaryTitle}>Business Summary</Text>

                  <Text style={styles.summaryText}>
                    You have processed {data?.totalOrders ?? 0} orders with
                    total revenue of ₹
                    {Number(data?.totalRevenue ?? 0).toLocaleString('en-IN')}.
                  </Text>
                </View>
              </View>
            </View>
          </Card>
          <TouchableOpacity
  style={styles.reviewButton}
  onPress={() => navigation.navigate('Adminreviews')}
>
  <Text style={styles.reviewButtonIcon}>⭐</Text>

  <View style={styles.reviewButtonContent}>
    <Text style={styles.reviewButtonTitle}>
      Customer Reviews
    </Text>

    <Text style={styles.reviewButtonSubtitle}>
      View ratings and feedback from customers
    </Text>
  </View>

  <Text style={styles.reviewButtonArrow}>›</Text>
</TouchableOpacity>
          {/* ================================ */}
          {/* LOGOUT */}
          {/* ================================ */}

          <View style={styles.logoutContainer}>
            <LogoutButton />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',

    color: colors.ink,

    marginBottom: 6,
  },

  subtitle: {
    color: colors.muted,

    marginBottom: spacing.lg,
  },

  card: {
    marginBottom: spacing.md,
  },

  infoCard: {
    marginBottom: spacing.md,
  },

  cardTitle: {
    fontSize: 18,

    fontWeight: '800',

    color: colors.ink,

    marginBottom: 6,
  },

  description: {
    color: colors.muted,

    fontSize: 13,

    lineHeight: 20,

    marginBottom: spacing.md,
  },

  label: {
    color: colors.ink,

    fontWeight: '700',

    fontSize: 13,

    marginTop: spacing.sm,

    marginBottom: 6,
  },

  input: {
    borderWidth: 1,

    borderColor: '#D8D8D8',

    borderRadius: radius.md,

    paddingHorizontal: spacing.md,

    paddingVertical: 12,

    color: colors.ink,

    fontSize: 15,
  },

  passwordContainer: {
    borderWidth: 1,

    borderColor: '#D8D8D8',

    borderRadius: radius.md,

    flexDirection: 'row',

    alignItems: 'center',

    paddingRight: spacing.md,
  },

  passwordInput: {
    flex: 1,

    paddingHorizontal: spacing.md,

    paddingVertical: 12,

    color: colors.ink,

    fontSize: 15,
  },

  reportsContainer: {
    marginTop: spacing.lg,
  },

  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },

  reportTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#171B2D',
  },

  reportSubtitle: {
    fontSize: 12,
    color: '#858B9A',
    marginTop: 3,
  },

  reportIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#E8DDFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  reportIconText: {
    fontSize: 23,
  },

  /* REVENUE */

  revenueCard: {
    backgroundColor: '#7138F2',
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },

  revenueTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  revenueLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#E8DDFF',
  },

  revenueAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 6,
  },

  revenueDescription: {
    fontSize: 11,
    color: '#E8DDFF',
    marginTop: 5,
  },

  revenueIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#8D61F5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  revenueIconText: {
    fontSize: 27,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  /* STATS */

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: spacing.md,
    marginBottom: spacing.sm,

    elevation: 2,

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  ordersIcon: {
    backgroundColor: '#E8F3FF',
  },

  pendingIcon: {
    backgroundColor: '#FFF4CF',
  },

  completedIcon: {
    backgroundColor: '#DDF8ED',
  },

  averageIcon: {
    backgroundColor: '#F0E8FF',
  },

  statIconText: {
    fontSize: 18,
  },

  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#858B9A',
  },

  statValue: {
    fontSize: 23,
    fontWeight: '900',
    color: '#171B2D',
    marginTop: 5,
  },

  statDescription: {
    fontSize: 10,
    color: '#858B9A',
    marginTop: 3,
  },

  /* ORDER STATUS */

  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 19,
    padding: spacing.lg,
    marginTop: spacing.sm,

    elevation: 2,

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  statusTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#171B2D',
  },

  statusSubtitle: {
    fontSize: 10,
    color: '#858B9A',
    marginTop: 3,
  },

  statusTotal: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7138F2',
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 7,
  },

  statusRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 8,
  },

  completedDot: {
    backgroundColor: '#278044',
  },

  pendingDot: {
    backgroundColor: '#E1A900',
  },

  statusName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#414655',
  },

  statusNumber: {
    fontSize: 13,
    fontWeight: '900',
    color: '#171B2D',
  },

  progressBackground: {
    height: 7,
    borderRadius: 4,
    backgroundColor: '#F0F0F3',
    overflow: 'hidden',
    marginBottom: 15,
  },

  progressCompleted: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#278044',
  },

  progressPending: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#E1A900',
  },

  /* SUMMARY */

  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1EAFF',
    borderRadius: 17,
    padding: spacing.md,
    marginTop: spacing.sm,
  },

  summaryIcon: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: '#E3D6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryIconText: {
    fontSize: 21,
  },

  summaryContent: {
    flex: 1,
    marginLeft: 12,
  },

  summaryTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#5731A9',
  },

  summaryText: {
    fontSize: 10,
    lineHeight: 15,
    color: '#858B9A',
    marginTop: 3,
  },

  showPassword: {
    color: colors.teal,

    fontWeight: '700',
  },

  createButton: {
    marginTop: spacing.lg,

    backgroundColor: colors.teal,

    borderRadius: radius.md,

    paddingVertical: 14,

    alignItems: 'center',
  },

  disabledButton: {
    opacity: 0.6,
  },

  createButtonText: {
    color: '#FFFFFF',

    fontWeight: '800',

    fontSize: 15,
  },

  infoText: {
    color: colors.muted,

    lineHeight: 21,
  },

  infoBox: {
    marginTop: spacing.md,

    padding: spacing.md,

    borderRadius: radius.md,

    backgroundColor: '#E7F4F3',
  },

  infoLabel: {
    fontSize: 12,

    color: colors.muted,
  },

  infoValue: {
    marginTop: 4,

    fontWeight: '800',

    color: colors.teal,
  },

  reportText: {
    marginTop: spacing.sm,

    color: colors.teal,

    fontWeight: '700',
  },
  reviewButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  borderRadius: 17,
  padding: spacing.md,
  marginTop: spacing.md,
  marginBottom: spacing.md,

  elevation: 2,

  shadowColor: '#000',
  shadowOpacity: 0.04,
  shadowRadius: 6,

  shadowOffset: {
    width: 0,
    height: 2,
  },
},

reviewButtonIcon: {
  width: 44,
  height: 44,
  borderRadius: 13,
  backgroundColor: '#FFF4CF',
  textAlign: 'center',
  textAlignVertical: 'center',
  fontSize: 21,
},

reviewButtonContent: {
  flex: 1,
  marginLeft: 12,
},

reviewButtonTitle: {
  fontSize: 15,
  fontWeight: '800',
  color: '#171B2D',
},

reviewButtonSubtitle: {
  fontSize: 11,
  color: '#858B9A',
  marginTop: 3,
  lineHeight: 16,
},

reviewButtonArrow: {
  fontSize: 28,
  fontWeight: '400',
  color: '#7138F2',
  marginLeft: 8,
},

  logoutContainer: {
    marginTop: spacing.lg,
  },
})
