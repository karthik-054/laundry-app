import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';

import { colors, spacing } from '../../app/theme';

import { useAppSelector } from '../../app/store';

import { usePaymentsQuery } from '../payments/paymentApi';

import { formatWhen, inr } from '../../utils/format';

import type { CustomerStackParamList } from '../../app/navigation/types';

import { LogoutButton } from '../../components/LogoutButton';

export function ProfileScreen() {
  const user = useAppSelector(s => s.auth.user);
  const profile = useAppSelector(s => s.auth.profile);

  const navigation =
    useNavigation<
      NativeStackNavigationProp<CustomerStackParamList>
    >();

  const { data: pays } = usePaymentsQuery();

  // Create initials from actual logged-in user's name.
  const initials =
    user?.name
      ?.trim()
      .split(/\s+/)
      .map(name => name.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U';

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* ==========================
            HEADER
        ========================== */}

        <View style={styles.header}>
          <View>
            <Text style={styles.heading}>
              Profile
            </Text>

            <Text style={styles.subHeading}>
              Manage your account and preferences
            </Text>
          </View>

          {/* UI only */}
          <View style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>
              ⚙
            </Text>
          </View>
        </View>

        {/* ==========================
            PROFILE CARD
        ========================== */}

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {initials}
            </Text>
          </View>

          <View style={styles.userDetails}>
            <Text
              style={styles.userName}
              numberOfLines={1}
            >
              {user?.name || 'User'}
            </Text>

            <Text style={styles.userPhone}>
              {user?.phone || 'Phone not available'}
            </Text>

            <Text
              style={styles.userEmail}
              numberOfLines={1}
            >
              {user?.email || 'Email not available'}
            </Text>
          </View>

          {/* UI only — no fake edit functionality */}
          <View style={styles.editButton}>
            <Text style={styles.editIcon}>
              ✎
            </Text>

            <Text style={styles.editText}>
              Edit
            </Text>
          </View>
        </View>

        {/* ==========================
            ADDRESS CARD
        ========================== */}

        <Card style={styles.addressCard}>
          <View style={styles.addressIcon}>
            <Text style={styles.addressIconText}>
              📍
            </Text>
          </View>

          <View style={styles.addressContent}>
            <Text style={styles.addressTitle}>
              Saved Address
            </Text>

            <Text style={styles.addressText}>
              {profile?.address || 'Address not available'}
            </Text>

            <Text style={styles.addressSubText}>
              {[
                profile?.landmark,
                profile?.city,
                profile?.pincode,
              ]
                .filter(Boolean)
                .join(', ') || 'No additional address details'}
            </Text>
          </View>
        </Card>

        {/* ==========================
            LOYALTY CARD
        ========================== */}

        <View style={styles.loyaltyCard}>
          <View style={styles.crownCircle}>
            <Text style={styles.crown}>
              ♛
            </Text>
          </View>

          <View style={styles.loyaltyContent}>
            <Text style={styles.loyaltyTitle}>
              Loyal Customer
            </Text>

            <Text style={styles.loyaltyDescription}>
              Keep using our services to earn
              more rewards!
            </Text>
          </View>

          <View style={styles.coinsContainer}>
            <Text style={styles.coinIcon}>
              🪙
            </Text>

            <Text style={styles.coinLabel}>
              Rewards
            </Text>

            <Text style={styles.coinNumber}>
              ★
            </Text>
          </View>
        </View>

        {/* ==========================
            MY SERVICES
        ========================== */}

        <Text style={styles.sectionTitle}>
          My Services
        </Text>

        <View style={styles.menuCard}>
          <MenuItem
            icon="👕"
            background="#E8F3FF"
            title="My Orders"
            description="View and track your laundry orders"
            onPress={() =>
              navigation.navigate('Orders')
            }
          />

          <MenuItem
            icon="▣"
            background="#F0E8FF"
            title="Wallet"
            description="Add money and manage your balance"
            onPress={() =>
              navigation.navigate('Wallet')
            }
          />

          <MenuItem
            icon="🪙"
            background="#FFF4CF"
            title="My Coins"
            description="View your earned coins and rewards"
            onPress={() =>
              navigation.navigate('Coins')
            }
          />

          <MenuItem
            icon="●"
            background="#DDF8F1"
            title="Saved Addresses"
            description="Manage your pickup and delivery addresses"
            onPress={() => {
              // Existing screen has no address navigation.
            }}
            last
          />
        </View>

        {/* ==========================
            PREFERENCES
        ========================== */}

        <Text style={styles.sectionTitle}>
          Preferences
        </Text>

        <View style={styles.menuCard}>
          <MenuItem
            icon="🔔"
            background="#FFE7EB"
            title="Notifications"
            description="Manage your alerts and updates"
            onPress={() => {
              // Existing screen has no notification navigation.
            }}
          />

          <MenuItem
            icon="◎"
            background="#E5F0FF"
            title="Language"
            description="English"
            onPress={() => {
              // Existing screen has no language functionality.
            }}
          />

          <MenuItem
            icon="?"
            background="#EEE6FF"
            title="Help & Support"
            description="Get help or contact us"
            onPress={() =>
              navigation.navigate('Support')
            }
          />

          <MenuItem
            icon="✓"
            background="#DDF8ED"
            title="Privacy Policy"
            description="Read our privacy policy"
            onPress={() => {
              // Existing screen has no privacy navigation.
            }}
            last
          />
        </View>

        {/* ==========================
            PAYMENT HISTORY
        ========================== */}

        <Text style={styles.sectionTitle}>
          Payment History
        </Text>

        <View style={styles.paymentCard}>
          {pays?.slice(0, 8).length ? (
            pays.slice(0, 8).map(payment => (
              <View
                key={payment.id}
                style={styles.paymentItem}
              >
                <View style={styles.paymentIcon}>
                  <Text style={styles.paymentIconText}>
                    ₹
                  </Text>
                </View>

                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentAmount}>
                    {inr(payment.amount)}
                  </Text>

                  <Text style={styles.paymentMeta}>
                    {payment.method}
                    {' · '}
                    {formatWhen(payment.createdAt)}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    payment.status?.toLowerCase() ===
                    'success'
                      ? styles.successBadge
                      : styles.pendingBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      payment.status?.toLowerCase() ===
                      'success'
                        ? styles.successText
                        : styles.pendingText,
                    ]}
                  >
                    {payment.status}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noPayments}>
              No payment history available.
            </Text>
          )}
        </View>

        {/* ==========================
            REFERRAL
        ========================== */}

        <View style={styles.referralCard}>
          <View style={styles.referralIcon}>
            <Text style={styles.referralIconText}>
              🎁
            </Text>
          </View>

          <View style={styles.referralContent}>
            <Text style={styles.referralTitle}>
              Referral
            </Text>

            <Text style={styles.referralText}>
              Referral feature coming soon.
            </Text>
          </View>
        </View>

        {/* ==========================
            LOGOUT
        ========================== */}

        <View style={styles.logoutWrapper}>
          <LogoutButton />
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </Screen>
  );
}

/* ======================================================
   MENU ITEM
====================================================== */

type MenuItemProps = {
  icon: string;
  background: string;
  title: string;
  description: string;
  onPress: () => void;
  last?: boolean;
};

function MenuItem({
  icon,
  background,
  title,
  description,
  onPress,
  last = false,
}: MenuItemProps) {
  return (
    <TouchableOpacity
      style={[
        styles.menuItem,
        !last && styles.menuBorder,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.menuIcon,
          {
            backgroundColor: background,
          },
        ]}
      >
        <Text style={styles.menuIconText}>
          {icon}
        </Text>
      </View>

      <View style={styles.menuText}>
        <Text style={styles.menuTitle}>
          {title}
        </Text>

        <Text style={styles.menuDescription}>
          {description}
        </Text>
      </View>

      <Text style={styles.menuArrow}>
        ›
      </Text>
    </TouchableOpacity>
  );
}

/* ======================================================
   STYLES
====================================================== */

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },

  /* HEADER */

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  heading: {
    fontSize: 28,
    fontWeight: '900',
    color: '#171B2D',
  },

  subHeading: {
    fontSize: 12,
    color: '#858B9A',
    marginTop: 3,
  },

  settingsButton: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },

  settingsIcon: {
    fontSize: 25,
    color: '#777D8B',
  },

  /* PROFILE */

  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',

    elevation: 2,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#DDF8ED',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#7138F2',
  },

  userDetails: {
    flex: 1,
    marginLeft: 12,
  },

  userName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#171B2D',
  },

  userPhone: {
    fontSize: 11,
    color: '#858B9A',
    marginTop: 4,
  },

  userEmail: {
    fontSize: 10,
    color: '#858B9A',
    marginTop: 3,
  },

  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1E9FF',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  editIcon: {
    color: '#7138F2',
    fontSize: 15,
    marginRight: 4,
  },

  editText: {
    color: '#7138F2',
    fontSize: 11,
    fontWeight: '800',
  },

  /* ADDRESS */

  addressCard: {
    marginTop: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  addressIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E8F3FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  addressIconText: {
    fontSize: 20,
  },

  addressContent: {
    flex: 1,
    marginLeft: 12,
  },

  addressTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#171B2D',
  },

  addressText: {
    fontSize: 11,
    color: '#555B6B',
    marginTop: 4,
  },

  addressSubText: {
    fontSize: 10,
    color: '#858B9A',
    marginTop: 3,
  },

  /* LOYALTY */

  loyaltyCard: {
    backgroundColor: '#F1EAFF',
    borderRadius: 18,
    padding: 14,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  crownCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E3D6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  crown: {
    fontSize: 24,
    color: '#7138F2',
  },

  loyaltyContent: {
    flex: 1,
    marginLeft: 10,
  },

  loyaltyTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#5731A9',
  },

  loyaltyDescription: {
    fontSize: 9,
    color: '#858B9A',
    marginTop: 3,
  },

  coinsContainer: {
    alignItems: 'center',
  },

  coinIcon: {
    fontSize: 18,
  },

  coinLabel: {
    color: '#858B9A',
    fontSize: 9,
  },

  coinNumber: {
    color: '#7138F2',
    fontSize: 19,
    fontWeight: '900',
  },

  /* SECTION */

  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#171B2D',
    marginTop: 20,
    marginBottom: 9,
  },

  /* MENU */

  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    paddingHorizontal: 12,

    elevation: 2,

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
  },

  menuBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#ECECF2',
  },

  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuIconText: {
    fontSize: 19,
  },

  menuText: {
    flex: 1,
    marginLeft: 12,
  },

  menuTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#171B2D',
  },

  menuDescription: {
    fontSize: 9,
    color: '#858B9A',
    marginTop: 3,
  },

  menuArrow: {
    fontSize: 25,
    color: '#8A909C',
  },

  /* PAYMENTS */

  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    paddingHorizontal: 12,

    elevation: 2,

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECF2',
  },

  paymentIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#E8F3FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  paymentIconText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#3478C8',
  },

  paymentInfo: {
    flex: 1,
    marginLeft: 12,
  },

  paymentAmount: {
    fontSize: 13,
    fontWeight: '800',
    color: '#171B2D',
  },

  paymentMeta: {
    fontSize: 9,
    color: '#858B9A',
    marginTop: 4,
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },

  successBadge: {
    backgroundColor: '#DDF8ED',
  },

  pendingBadge: {
    backgroundColor: '#FFF4CF',
  },

  statusText: {
    fontSize: 9,
    fontWeight: '800',
  },

  successText: {
    color: '#278044',
  },

  pendingText: {
    color: '#A77B00',
  },

  noPayments: {
    paddingVertical: 18,
    textAlign: 'center',
    fontSize: 12,
    color: '#858B9A',
  },

  /* REFERRAL */

  referralCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 14,
    borderRadius: 17,
    backgroundColor: '#FFF8E7',
  },

  referralIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFEAB0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  referralIconText: {
    fontSize: 20,
  },

  referralContent: {
    flex: 1,
    marginLeft: 12,
  },

  referralTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#171B2D',
  },

  referralText: {
    fontSize: 10,
    color: '#858B9A',
    marginTop: 4,
  },

  /* LOGOUT */

  logoutWrapper: {
    marginTop: 20,
  },
});