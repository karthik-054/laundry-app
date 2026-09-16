import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

import { useState } from 'react'

import { Screen } from '../../components/Screen'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { AdminStackParamList } from '../../app/navigation/types'

import { Loading, ErrorState, EmptyState } from '../../components/States'

import {
  useGetDeliveryPersonsQuery,
  useCreateDeliveryUserMutation,
} from './adminApi'

import { colors, spacing, radius } from '../../app/theme'

export function AdminDeliveryScreen () {
  // ============================================
  // GET DELIVERY PERSONS
  // ============================================

  const {
    data: deliveryPersons = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetDeliveryPersonsQuery()

  // ============================================
  // CREATE DELIVERY PERSON
  // ============================================

  const [createDeliveryUser, { isLoading: creating }] =
    useCreateDeliveryUserMutation()

  const navigation =
    useNavigation<NativeStackNavigationProp<AdminStackParamList>>()

  // ============================================
  // MODAL
  // ============================================

  const [showAddModal, setShowAddModal] = useState(false)

  // ============================================
  // FORM
  // ============================================

  const [name, setName] = useState('')

  const [email, setEmail] = useState('')

  const [phone, setPhone] = useState('')

  const [password, setPassword] = useState('')

  // ============================================
  // RESET FORM
  // ============================================

  function resetForm () {
    setName('')
    setEmail('')
    setPhone('')
    setPassword('')
  }

  // ============================================
  // CLOSE MODAL
  // ============================================

  function closeModal () {
    if (creating) {
      return
    }

    resetForm()
    setShowAddModal(false)
  }

  // ============================================
  // CREATE DELIVERY PERSON
  // ============================================

  async function handleCreateDeliveryUser () {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter delivery person name.')
      return
    }

    if (!email.trim()) {
      Alert.alert('Required', 'Please enter email address.')
      return
    }

    if (!phone.trim()) {
      Alert.alert('Required', 'Please enter phone number.')
      return
    }

    if (!password.trim()) {
      Alert.alert('Required', 'Please enter password.')
      return
    }

    try {
      await createDeliveryUser({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: password.trim(),
      }).unwrap()

      Alert.alert('Success', 'Delivery person created successfully.')

      resetForm()
      setShowAddModal(false)

      refetch()
    } catch (error) {
      console.error('Create delivery user error:', error)

      Alert.alert('Failed', 'Unable to create delivery person.')
    }
  }

  // ============================================
  // LOADING
  // ============================================

  if (isLoading) {
    return (
      <Screen>
        <Loading />
      </Screen>
    )
  }

  // ============================================
  // ERROR
  // ============================================

  if (error) {
    return (
      <Screen>
        <ErrorState message='Delivery team unavailable' onRetry={refetch} />
      </Screen>
    )
  }

  // ============================================
  // UI
  // ============================================

  return (
    <Screen>
      {/* ======================================== */}
      {/* HEADER */}
      {/* ======================================== */}

      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Delivery Team</Text>

          <Text style={styles.subtitle}>Manage your delivery persons</Text>
        </View>

        <Pressable
          onPress={() => setShowAddModal(true)}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </Pressable>
      </View>

      {/* ======================================== */}
      {/* SUMMARY */}
      {/* ======================================== */}

      <View style={styles.summaryRow}>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{deliveryPersons.length}</Text>

          <Text style={styles.summaryLabel}>Total Riders</Text>
        </Card>

        <Card style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>
            {deliveryPersons.filter(person => person.busy !== true).length}
          </Text>

          <Text style={styles.summaryLabel}>Available</Text>
        </Card>

        <Card style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>
            {deliveryPersons.filter(person => person.busy === true).length}
          </Text>

          <Text style={styles.summaryLabel}>Busy</Text>
        </Card>
      </View>

      {/* ======================================== */}
      {/* REFRESHING */}
      {/* ======================================== */}

      {isFetching ? (
        <Text style={styles.refreshing}>Updating delivery team...</Text>
      ) : null}

      {/* ======================================== */}
      {/* EMPTY */}
      {/* ======================================== */}

      {deliveryPersons.length === 0 ? (
        <EmptyState
          title='No delivery persons'
          body='Create a delivery person to start assigning orders.'
        />
      ) : null}

      {/* ======================================== */}
      {/* DELIVERY PERSON LIST */}
      {/* ======================================== */}

      {deliveryPersons.map(person => (
        <Card key={person.id} style={styles.card}>
          {/* PERSON HEADER */}

          <View style={styles.personHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {person.name?.charAt(0)?.toUpperCase() ?? 'D'}
              </Text>
            </View>

            <View style={styles.personInfo}>
              <Text style={styles.name}>{person.name}</Text>

              <Text style={styles.status}>
                {person.busy ? 'Assigned to route' : 'Available'}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,

                person.busy ? styles.busyBadge : styles.availableBadge,
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,

                  person.busy ? styles.busyText : styles.availableText,
                ]}
              >
                {person.busy ? 'BUSY' : 'AVAILABLE'}
              </Text>
            </View>
          </View>

          {/* EMAIL */}

          {person.email ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>

              <Text style={styles.infoValue}>{person.email}</Text>
            </View>
          ) : null}

          {/* PHONE */}

          {person.phone ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>

              <Text style={styles.infoValue}>{person.phone}</Text>
            </View>
          ) : null}

          {/* ACTIVE STATUS */}

          {person.isActive !== undefined ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Account</Text>

              <Text
                style={[
                  styles.infoValue,

                  person.isActive ? styles.activeText : styles.inactiveText,
                ]}
              >
                {person.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          ) : null}
        </Card>
      ))}
      <Pressable
        onPress={() => navigation.navigate('AdminDeliveryHistory')}
        style={styles.historyButton}
      >
        <Text style={styles.historyButtonText}>Delivery History</Text>
      </Pressable>

      {/* ======================================== */}
      {/* ADD DELIVERY PERSON MODAL */}
      {/* ======================================== */}

      <Modal
        visible={showAddModal}
        transparent
        animationType='slide'
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            {/* MODAL HEADER */}

            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Add Delivery Person</Text>

                <Text style={styles.modalSubtitle}>
                  Create login access for a rider
                </Text>
              </View>

              <Pressable onPress={closeModal} disabled={creating}>
                <Text style={styles.closeText}>×</Text>
              </Pressable>
            </View>

            {/* NAME */}

            <Text style={styles.inputLabel}>Name</Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder='Enter name'
              placeholderTextColor={colors.muted}
              style={styles.input}
              autoCapitalize='words'
              editable={!creating}
            />

            {/* EMAIL */}

            <Text style={styles.inputLabel}>Email</Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder='Enter email'
              placeholderTextColor={colors.muted}
              style={styles.input}
              keyboardType='email-address'
              autoCapitalize='none'
              editable={!creating}
            />

            {/* PHONE */}

            <Text style={styles.inputLabel}>Phone</Text>

            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder='Enter phone number'
              placeholderTextColor={colors.muted}
              style={styles.input}
              keyboardType='phone-pad'
              editable={!creating}
            />

            {/* PASSWORD */}

            <Text style={styles.inputLabel}>Password</Text>

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder='Create password'
              placeholderTextColor={colors.muted}
              style={styles.input}
              secureTextEntry
              autoCapitalize='none'
              editable={!creating}
            />

            {/* ACTIONS */}

            <View style={styles.modalActions}>
              <Pressable
                onPress={closeModal}
                disabled={creating}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleCreateDeliveryUser}
                disabled={creating}
                style={[styles.createButton, creating && styles.disabledButton]}
              >
                <Text style={styles.createText}>
                  {creating ? 'Creating...' : 'Create Rider'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  )
}

// ==============================================
// STYLES
// ==============================================

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.ink,
  },

  subtitle: {
    marginTop: 4,
    color: colors.muted,
  },

  addButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.teal,
    borderRadius: radius.md,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },

  summaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },

  summaryCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },

  summaryNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.ink,
  },

  summaryLabel: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 12,
    textAlign: 'center',
  },

  refreshing: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: spacing.sm,
  },

  card: {
    marginBottom: spacing.md,
  },

  personHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E7F4F3',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: colors.teal,
    fontSize: 20,
    fontWeight: '800',
  },

  personInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },

  name: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink,
  },

  status: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 13,
  },

  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: radius.md,
  },

  availableBadge: {
    backgroundColor: '#E7F4F3',
  },

  busyBadge: {
    backgroundColor: '#FFF3CD',
  },

  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },

  availableText: {
    color: colors.teal,
  },

  busyText: {
    color: '#856404',
  },

  infoRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },

  infoLabel: {
    width: 70,
    color: colors.muted,
    fontSize: 13,
  },

  infoValue: {
    flex: 1,
    color: colors.ink,
    fontSize: 13,
  },

  activeText: {
    color: colors.teal,
    fontWeight: '700',
  },

  inactiveText: {
    color: '#B42318',
    fontWeight: '700',
  },

  // ============================================
  // MODAL
  // ============================================

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },

  modal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.ink,
  },

  modalSubtitle: {
    marginTop: 4,
    color: colors.muted,
  },

  closeText: {
    fontSize: 30,
    lineHeight: 30,
    color: colors.muted,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 5,
    marginTop: spacing.sm,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D5D9E0',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    color: colors.ink,
    backgroundColor: '#FFFFFF',
  },

  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },

  cancelButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#D5D9E0',
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelText: {
    color: colors.ink,
    fontWeight: '700',
  },

  createButton: {
    flex: 1,
    height: 48,
    backgroundColor: colors.teal,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  createText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  disabledButton: {
    opacity: 0.6,
  },
  historyButton: {
    marginBottom: spacing.md,
    paddingVertical: 13,
    borderRadius: radius.md,
    backgroundColor: colors.success,
    alignItems: 'center',
  },

  historyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
})
