import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useAppSelector } from '../../app/store'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useEffect, useRef, useState } from 'react'
import { Screen } from '../../components/Screen'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { StatusBadge } from '../../components/StatusBadge'

import { EmptyState, ErrorState, Loading } from '../../components/States'

import { colors, spacing, radius } from '../../app/theme'

import { formatWhen, inr } from '../../utils/format'

import type { CustomerStackParamList } from '../../app/navigation/types'

import { LogoutButton } from '../../components/LogoutButton'

import { useGetCustomerDashboardQuery } from './customerApi'

// ==========================================
// CUSTOMER DASHBOARD
// ==========================================

type DashboardService = {
  _id: string
  id?: string
  name: string
  category?: 'basic' | 'premium'
  isPopular?: boolean
  description?: string
  image?: string
  price?: number
}

export function CustomerDashboard () {
  const user = useAppSelector(s => s.auth.user)

  const navigation =
    useNavigation<NativeStackNavigationProp<CustomerStackParamList>>()

  // ========================================
  // DASHBOARD API
  // ========================================

  const { data, isLoading, error, refetch, isFetching } =
    useGetCustomerDashboardQuery()

  // ========================================
  // DATA NEEDED BY HOOKS
  // ========================================

  const dashboard = data?.data

  const [activeBalanceIndex, setActiveBalanceIndex] = useState(0)

  const balanceListRef = useRef<FlatList>(null)

  // ========================================
  // OFFERS CAROUSEL
  // ========================================

  const [activeOfferIndex, setActiveOfferIndex] = useState(0)

  const offerListRef = useRef<FlatList>(null)

  // Card width
  const OFFER_CARD_WIDTH = 245

  // Same gap as horizontalContent
  const OFFER_CARD_GAP = 10

  const offerPromotions = [
    {
      id: '20PerOff',
      title: '20% Off',
      image: require('../../assets/20PerOff.png'),
    },
    {
      id: 'weekendOff',
      title: 'Weekend Offer',
      image: require('../../assets/weekendOff.png'),
    },
    {
      id: 'freePickup',
      title: 'Free Pickup',
      image: require('../../assets/freePickup.png'),
    },
  ]

  const walletBalance = dashboard?.wallet?.balance ?? 0

  const coinBalance = dashboard?.coins?.balance ?? 0

  const balanceCards = [
    {
      id: 'wallet',
      title: 'Wallet',
      subtitle: 'Your Balance',
      value: inr(walletBalance),
      description: 'Faster payments, better offers!',
      button: 'View Wallet',
      icon: require('../../assets/purse.png'),
      type: 'wallet',
    },
    {
      id: 'coins',
      title: 'Laundry Coins',
      subtitle: 'Your Coins',
      value: coinBalance.toString(),
      description: 'Save more with laundry coins!',
      button: 'View Coins',
      icon: require('../../assets/money.png'),
      type: 'coins',
    },
  ]

  // ========================================
  // AUTO CHANGE OFFER EVERY 2 SECONDS
  // ========================================

  useEffect(() => {
    if (offerPromotions.length <= 1) {
      return
    }

    const interval = setInterval(() => {
      setActiveOfferIndex(currentIndex => {
        const nextIndex =
          currentIndex + 1 >= offerPromotions.length ? 0 : currentIndex + 1

        offerListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        })

        return nextIndex
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [offerPromotions.length])

  // ========================================
  // RESET INDEX WHEN OFFERS CHANGE
  // ========================================

  useEffect(() => {
    if (offerPromotions.length === 0) {
      setActiveOfferIndex(0)
      return
    }

    if (activeOfferIndex >= offerPromotions.length) {
      setActiveOfferIndex(0)

      requestAnimationFrame(() => {
        offerListRef.current?.scrollToIndex({
          index: 0,
          animated: false,
        })
      })
    }
  }, [offerPromotions.length, activeOfferIndex])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBalanceIndex(currentIndex => {
        const nextIndex =
          currentIndex + 1 >= balanceCards.length ? 0 : currentIndex + 1

        balanceListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        })

        return nextIndex
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [walletBalance, coinBalance])

  // ========================================
  // LOADING
  // ========================================

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Loading />
      </SafeAreaView>
    )
  }

  // ========================================
  // ERROR
  // ========================================

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ErrorState message='Could not load your dashboard' onRetry={refetch} />
      </SafeAreaView>
    )
  }

  // ========================================
  // DATA
  // ========================================

  //  const dashboard = data?.data

  const profile = dashboard?.profile

  const activeOrders = dashboard?.activeOrders ?? []

  // Show maximum 3 basic services
  const basicServices = (dashboard?.basicServices ?? []).slice(0, 3)

  // Show maximum 3 popular services
  const popularServices = (dashboard?.popularServices ?? []).slice(0, 3)

  const advertisements = dashboard?.advertisements ?? []

  const unreadNotifications = dashboard?.unreadNotifications ?? 0
  // ========================================
  // UI
  // ========================================

  //basic and popular services static image feuture to give a backend

  const getServiceIcon = (serviceName: string) => {
    const name = serviceName.toLowerCase().trim()

    // Washing
    if (name.includes('wash') || name.includes('laundry')) {
      return require('../../assets/washingmachine.png')
    }

    // Ironing
    if (
      name.includes('iron') ||
      name.includes('ironing') ||
      name.includes('press')
    ) {
      return require('../../assets/iron.png')
    }

    // Dry Cleaning
    if (
      name.includes('dry') ||
      name.includes('dry clean') ||
      name.includes('dryclean')
    ) {
      return require('../../assets/dryer.png')
    }

    // Folding
    if (name.includes('fold') || name.includes('folding')) {
      return require('../../assets/folding.png')
    }

    // Premium
    if (name.includes('premium')) {
      return require('../../assets/premiumservice.png')
    }

    // Stain Removal
    if (
      name.includes('stainremove') ||
      name.includes('stain remove') ||
      name.includes('stain removal') ||
      name.includes('stain')
    ) {
      return require('../../assets/stainremove.png')
    }

    // Curtain Cleaning
    if (name.includes('curtain')) {
      return require('../../assets/curtain.png')
    }

    // Default
    return require('../../assets/washingmachine.png')
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Screen scroll={false}>
          {/* ================================= */}
          {/* HEADER */}
          {/* ================================= */}

          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.hello}>Good day</Text>

              <Text style={styles.name} numberOfLines={1}>
                {user?.name}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.notificationButton}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Image
                source={require('../../assets/notification.png')}
                style={{
                  width: 25,
                  height: 25,
                }}
              />

              {unreadNotifications > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationCount}>
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* ================================= */}
          {/* WALLET + COINS */}
          {/* ================================= */}

          <View style={styles.balanceRow}>
            {/* WALLET */}

            {/* <Card style={styles.balanceCard}>

              <View style={styles.balanceIconContainer}>

                <Image
                  source={require('../../assets/wallet.png')}
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: colors.tealDark,
                  }}
                />

              </View>

              <Text style={styles.balanceLabel}>
                Wallet Balance
              </Text>

              <Text style={styles.balanceValue}>
                {inr(walletBalance)}
              </Text>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate('Wallet')
                }
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  justifyContent: 'flex-start',
                }}
              >

                <Text style={styles.viewText}>
                  View wallet
                </Text>

                <Image
                  source={require('../../assets/arrow-right.png')}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: colors.tealDark,
                  }}
                />

              </TouchableOpacity>

            </Card> */}

            {/* COINS */}

            {/* <Card style={styles.balanceCard}>

              <View style={styles.balanceIconContainer}>

                <Image
                  source={require('../../assets/coins.png')}
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: '#b19c22',
                  }}
                />

              </View>

              <Text style={styles.balanceLabel}>
                Laundry Coins
              </Text>

              <Text style={styles.balanceValue}>
                {coinBalance}
              </Text>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate('Coins')
                }
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  justifyContent: 'flex-start',
                }}
              >

                <Text style={styles.viewText}>
                  View coins
                </Text>

                <Image
                  source={require('../../assets/arrow-right.png')}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: colors.tealDark,
                  }}
                />

              </TouchableOpacity>

            </Card> */}

            <View style={styles.balanceBannerContainer}>
              <FlatList
                ref={balanceListRef}
                data={balanceCards}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id}
                onMomentumScrollEnd={event => {
                  const index = Math.round(
                    event.nativeEvent.contentOffset.x /
                      event.nativeEvent.layoutMeasurement.width,
                  )

                  setActiveBalanceIndex(index)
                }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.balanceBanner}
                    onPress={() => {
                      if (item.type === 'wallet') {
                        navigation.navigate('Wallet')
                      } else {
                        navigation.navigate('Coins')
                      }
                    }}
                  >
                    {/* LEFT CONTENT */}

                    <View style={styles.balanceBannerContent}>
                      <View style={styles.balanceBannerBadge}>
                        <Text style={styles.balanceBannerBadgeText}>
                          {item.title}
                        </Text>
                      </View>

                      <Text style={styles.balanceBannerSubtitle}>
                        {item.subtitle}
                      </Text>

                      <Text style={styles.balanceBannerValue}>
                        {item.value}
                      </Text>

                      <Text style={styles.balanceBannerDescription}>
                        {item.description}
                      </Text>

                      <View style={styles.balanceBannerButton}>
                        <Text style={styles.balanceBannerButtonText}>
                          {item.button}
                        </Text>

                        <Image
                          source={require('../../assets/arrow-right.png')}
                          style={styles.balanceBannerArrow}
                        />
                      </View>
                    </View>

                    {/* RIGHT ICON */}

                    <View style={styles.balanceBannerImageContainer}>
                      <View style={styles.balanceCircleOne} />
                      <View style={styles.balanceCircleTwo} />

                      <Image
                        source={item.icon}
                        style={styles.balanceBannerImage}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              />

              {/* DOT INDICATOR */}

              <View style={styles.balanceIndicatorContainer}>
                {balanceCards.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.balanceIndicator,
                      index === activeBalanceIndex &&
                        styles.balanceIndicatorActive,
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>

          <View style={styles.quickActionsRow}>
            {/* SERVICES */}

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.quickAction}
              onPress={() => navigation.navigate('CreateOrder', {})}
            >
              <View>
                <Image
                  source={require('../../assets/whasing.png')}
                  style={{
                    width: 50,
                    height: 50,
                  }}
                  resizeMode='contain'
                />
              </View>

              <Text style={styles.quickTitle}>Services</Text>

              <Text style={styles.quickSubtitle}>Explore</Text>
            </TouchableOpacity>

            {/* SUPPORT */}

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.quickAction}
              onPress={() => navigation.navigate('Support')}
            >
              <View>
                <Image
                  source={require('../../assets/bot.png')}
                  style={{
                    width: 50,
                    height: 50,
                  }}
                  resizeMode='contain'
                />
              </View>

              <Text style={styles.quickTitle}>Support</Text>

              <Text style={styles.quickSubtitle}>Get help</Text>
            </TouchableOpacity>

            {/* ALERTS */}

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.quickAction}
              onPress={() => navigation.navigate('Notifications')}
            >
              <View>
                <Image
                  source={require('../../assets/notify.png')}
                  style={{
                    width: 50,
                    height: 50,
                  }}
                  resizeMode='contain'
                />
              </View>

              <Text style={styles.quickTitle}>Alerts</Text>

              <Text style={styles.quickSubtitle}>
                {unreadNotifications} unread
              </Text>
            </TouchableOpacity>
          </View>

          {/* ================================= */}
          {/* OFFERS */}
          {/* ================================= */}

          {offerPromotions.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Offers & Promotions</Text>

                  <Text style={styles.sectionSubtitle}>
                    Save more on your laundry
                  </Text>
                </View>
              </View>

              {/* OFFER CAROUSEL */}

              <FlatList
                ref={offerListRef}
                data={offerPromotions}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.horizontalContent}
                snapToInterval={OFFER_CARD_WIDTH + OFFER_CARD_GAP}
                decelerationRate='fast'
                renderItem={({ item }) => (
                  <Image source={item.image} style={styles.offerImage} />
                )}
                onMomentumScrollEnd={event => {
                  const offsetX = event.nativeEvent.contentOffset.x

                  const index = Math.round(
                    offsetX / (OFFER_CARD_WIDTH + OFFER_CARD_GAP),
                  )

                  const safeIndex = Math.max(
                    0,
                    Math.min(index, offerPromotions.length - 1),
                  )

                  setActiveOfferIndex(safeIndex)
                }}
                getItemLayout={(_, index) => ({
                  length: OFFER_CARD_WIDTH + OFFER_CARD_GAP,

                  offset: (OFFER_CARD_WIDTH + OFFER_CARD_GAP) * index,

                  index,
                })}
              />

              {/* ================================= */}
              {/* CAROUSEL INDICATOR */}
              {/* ================================= */}

              {offerPromotions.length > 1 && (
                <View style={styles.offerIndicatorContainer}>
                  {offerPromotions.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.offerIndicator,

                        index === activeOfferIndex &&
                          styles.offerIndicatorActive,
                      ]}
                    />
                  ))}
                </View>
              )}
            </>
          )}

          {/* ================================= */}
          {/* BASIC SERVICES */}
          {/* ================================= */}

          {/* BASIC SERVICES */}

          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderText}>
              <Text style={styles.sectionTitle}>Basic Services</Text>

              <Text style={styles.sectionSubtitle}>
                Everyday laundry made easy
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate('Services', {
                  filter: 'basic',
                })
              }
              style={styles.seeAllButton}
            >
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {basicServices.length === 0 ? (
            <Card style={styles.emptyCard}>
              <View style={styles.emptyIconContainer}>
                <Image
                  source={require('../../assets/washingmachine.png')}
                  style={styles.emptyIcon}
                  resizeMode='contain'
                />
              </View>

              <View style={styles.emptyContent}>
                <Text style={styles.emptyTitle}>No services available</Text>

                <Text style={styles.emptyText}>
                  Laundry services will appear here when they are available.
                </Text>
              </View>
            </Card>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalContent}
            >
              {basicServices.map((service, index) => (
                <Card
                  key={service._id || index}
                  style={styles.serviceCard}
                  onPress={() =>
                    navigation.navigate('CreateOrder', {
                      serviceId: service._id || service._id,
                    })
                  }
                >
                  {/* TOP */}

                  <View style={styles.serviceCardTop}>
                    <View style={styles.serviceIcon}>
                      <Image
                        source={getServiceIcon(service.name)}
                        style={styles.serviceIconImage}
                        resizeMode='contain'
                      />
                    </View>

                    <View style={styles.basicBadge}>
                      <Text style={styles.basicBadgeText}>BASIC</Text>
                    </View>
                  </View>

                  {/* SERVICE NAME */}

                  <Text style={styles.serviceName} numberOfLines={2}>
                    {service.name}
                  </Text>

                  {/* DESCRIPTION */}

                  {service.description ? (
                    <Text style={styles.serviceDescription} numberOfLines={2}>
                      {service.description}
                    </Text>
                  ) : (
                    <Text style={styles.serviceDescription} numberOfLines={2}>
                      Quality laundry care for your everyday clothes.
                    </Text>
                  )}
                </Card>
              ))}
            </ScrollView>
          )}

          {/* ================================= */}
          {/* POPULAR SERVICES */}
          {/* ================================= */}

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Popular Services</Text>

              <Text style={styles.sectionSubtitle}>
                Most loved by our customers
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate('Services', {
                  filter: 'popular',
                })
              }
            >
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {popularServices.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Image
                source={require('../../assets/hanger.png')}
                style={{
                  width: 25,
                  height: 25,
                }}
                resizeMode='contain'
              />

              <Text style={styles.emptyTitle}>No popular services yet</Text>

              <Text style={styles.emptyText}>
                Popular services will appear here.
              </Text>
            </Card>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalContent}
            >
              {popularServices.map(service => (
                <Card
                  key={service._id}
                  style={styles.popularCard}
                  onPress={() =>
                    navigation.navigate('CreateOrder', {
                      serviceId: service._id,
                    })
                  }
                >
                  <View style={styles.serviceCardTop}>
                    {/* SERVICE ICON */}
                    <View style={styles.serviceIcon}>
                      <Image
                        source={getServiceIcon(service.name)}
                        style={{
                          width: 25,
                          height: 25,
                        }}
                        resizeMode='contain'
                      />
                    </View>

                    {/* POPULAR BADGE */}
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularBadgeText}>POPULAR</Text>
                    </View>
                  </View>

                  <Text style={styles.serviceName} numberOfLines={2}>
                    {service.name}
                  </Text>

                  {service.description ? (
                    <Text style={styles.serviceDescription} numberOfLines={2}>
                      {service.description}
                    </Text>
                  ) : null}
                </Card>
              ))}
            </ScrollView>
          )}
          {/* ================================= */}
          {/* ACTIVE ORDER */}
          {/* ================================= */}

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Active Order</Text>

              <Text style={styles.sectionSubtitle}>
                Track your current laundry
              </Text>
            </View>
          </View>

          {activeOrders.length > 0 ? (
            <Card
              style={styles.orderCard}
              onPress={() =>
                navigation.navigate('OrderDetails', {
                  orderId: activeOrders[0]?._id,
                })
              }
            >
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderLabel}>ORDER NUMBER</Text>

                  <Text style={styles.orderId}>
                    {activeOrders[0]?.orderNumber}
                  </Text>
                </View>

                <StatusBadge status={activeOrders[0]?.status} />
              </View>

              <View style={styles.orderDivider} />

              <View style={styles.orderInfoRow}>
                <View style={styles.orderInfo}>
                  <Text style={styles.infoLabel}>Status</Text>

                  <Text style={styles.infoValue}>
                    {activeOrders[0]?.status}
                  </Text>
                </View>

                <View style={styles.orderInfo}>
                  <Text style={styles.infoLabel}>Amount</Text>

                  <Text style={styles.amount}>
                    {inr(
                      activeOrders[0]?.finalAmount ??
                        activeOrders[0]?.totalAmount ??
                        0,
                    )}
                  </Text>
                </View>
              </View>

              {activeOrders[0]?.deliveryDate ? (
                <View style={styles.deliveryBox}>
                  <Text style={styles.deliveryIcon}>🚚</Text>

                  <View style={styles.deliveryTextContainer}>
                    <Text style={styles.deliveryLabel}>Expected delivery</Text>

                    <Text style={styles.deliveryDate}>
                      {formatWhen(activeOrders[0]?.deliveryDate)}
                    </Text>
                  </View>
                </View>
              ) : null}

              <View style={styles.trackButton}>
                <Text style={styles.trackButtonText}>Track Order →</Text>
              </View>
            </Card>
          ) : (
            <Card style={styles.noOrderCard}>
              <Image
                source={getServiceIcon('Washing Machine')}
                style={{
                  width: 25,
                  height: 25,
                }}
              />

              <Text style={styles.noOrderTitle}>No active order</Text>

              <Text style={styles.noOrderText}>
                You currently have no active laundry orders.
              </Text>

              <View style={styles.noOrderButton}>
                <Button
                  title='Create an Order'
                  onPress={() => navigation.navigate('CreateOrder' as any)}
                />
              </View>
            </Card>
          )}

          {/* ================================= */}
          {/* REFRESHING */}
          {/* ================================= */}

          {isFetching && (
            <Text style={styles.refreshing}>Updating dashboard...</Text>
          )}
        </Screen>
      </ScrollView>
    </SafeAreaView>
  )
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: '#06B6D4',
    paddingHorizontal: spacing.md,
  },

  // ========================================
  // HEADER
  // ========================================

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },

  headerText: {
    flex: 1,
    paddingRight: spacing.md,
  },

  hello: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 4,
  },

  name: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.ink,
  },

  // ========================================
  // OFFER INDICATORS
  // ========================================

  offerIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },

  offerIndicator: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#D0D0D0',
    marginHorizontal: 4,
  },

  offerIndicatorActive: {
    width: 20,
    backgroundColor: colors.tealDark,
  },

  // ========================================
  // NOTIFICATION
  // ========================================

  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },

  balanceBannerContainer: {
    marginBottom: spacing.md,
    gap: 10,
  },

  balanceBanner: {
    width: 350,
    height: 190,
    borderRadius: 24,
    backgroundColor: '#7357F5',
    overflow: 'hidden',
    flexDirection: 'row',
    position: 'relative',
    marginLeft: 10,
  },

  balanceBannerContent: {
    flex: 1,
    paddingLeft: 20,
    paddingTop: 18,
    paddingBottom: 15,
    zIndex: 5,
  },

  balanceBannerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.20)',
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 20,
  },

  balanceBannerBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  balanceBannerSubtitle: {
    color: '#FFFFFF',
    fontSize: 13,
    marginTop: 12,
  },

  balanceBannerValue: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    marginTop: 2,
  },

  balanceBannerDescription: {
    color: 'rgba(255,255,255,0.90)',
    fontSize: 11,
    marginTop: 3,
  },

  balanceBannerButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 9,
    marginTop: 10,
  },

  balanceBannerButtonText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: '800',
  },

  balanceBannerArrow: {
    width: 17,
    height: 17,
    marginLeft: 5,
    color: colors.success,
  },

  balanceBannerImageContainer: {
    width: 150,
    height: '100%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  balanceBannerImage: {
    width: 90,
    height: 90,
    tintColor: '#FFFFFF',
    zIndex: 3,
  },

  balanceCircleOne: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.10)',
    right: -45,
    top: -20,
  },

  balanceCircleTwo: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.08)',
    right: 10,
    bottom: -35,
  },

  balanceIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 5,
  },

  balanceIndicator: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#D5D5D5',
    marginHorizontal: 4,
  },

  balanceIndicatorActive: {
    width: 20,
    backgroundColor: colors.tealDark,
  },

  bell: {
    fontSize: 21,
  },

  notificationBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },

  notificationCount: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
  },

  // basic service

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },

  sectionHeaderText: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.ink,
    letterSpacing: -0.3,
  },

  sectionSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: colors.muted,
    lineHeight: 17,
  },

  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingLeft: 10,
  },

  seeAll: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.success,
  },

  seeAllArrow: {
    marginLeft: 3,
    fontSize: 20,
    lineHeight: 18,
    fontWeight: '500',
    color: colors.success,
  },

  /* HORIZONTAL LIST */

  horizontalContent: {
    paddingRight: spacing.md,
    paddingBottom: 8,
  },

  /* SERVICE CARD */

  serviceCard: {
    width: 190,
    minHeight: 225,

    marginRight: 13,
    padding: 16,

    borderRadius: 20,
    backgroundColor: '#FFFFFF',

    elevation: 3,

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  serviceCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  /* ICON */

  serviceIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#F0E9FF',
  },

  serviceIconImage: {
    width: 34,
    height: 34,
  },

  /* BASIC BADGE */

  basicBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,

    backgroundColor: '#F3EEFF',
  },

  basicBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.7,
    color: colors.success,
  },

  /* NAME */

  serviceName: {
    minHeight: 42,

    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900',

    color: colors.ink,
  },

  /* DESCRIPTION */

  serviceDescription: {
    marginTop: 6,

    minHeight: 36,

    fontSize: 11,
    lineHeight: 17,

    color: colors.muted,
  },

  /* BOTTOM */

  serviceCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginTop: 15,
    paddingTop: 12,

    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E9E7EF',
  },

  serviceAction: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.success,
  },

  serviceArrow: {
    width: 30,
    height: 30,
    borderRadius: 10,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#F3EEFF',
  },

  serviceArrowText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.success,
  },

  /* EMPTY CARD */

  emptyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    
    padding: 16,
    borderRadius: 18,

    backgroundColor: '#FFFFFF',

    elevation: 2,

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,

    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  emptyIconContainer: {
    width: 54,
    height: 54,
    borderRadius: 17,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#F0E9FF',
  },

  emptyIcon: {
    width: 28,
    height: 28,
  },

  emptyContent: {
    flex: 1,
    marginLeft: 13,
  },

  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.ink,
  },

  emptyText: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 16,
    color: colors.muted,
  },

  // ========================================
  // BALANCE
  // ========================================

  balanceRow: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: spacing.md,
  },

  balanceCard: {
    flex: 1,
    minHeight: 150,
  },

  balanceIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.sand,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  balanceIcon: {
    fontSize: 19,
  },

  balanceLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },

  balanceValue: {
    color: colors.tealDark,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
  },

  viewText: {
    color: colors.tealDark,
    fontSize: 12,
    fontWeight: '700',
  },

  // ========================================
  // CREATE ORDER
  // ========================================

  createOrderContainer: {
    marginBottom: spacing.md,
  },

  quickActionsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: spacing.md,
  },

  quickAction: {
    flex: 1,
    backgroundColor: colors.paper,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },

  quickIconText: {
    fontSize: 18,
  },

  quickTitle: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '800',
  },

  quickSubtitle: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 3,
  },

  // ========================================
  // HORIZONTAL LISTS
  // ========================================

  // ========================================
  // OFFERS
  // ========================================

  offerImage: {
    width: 245,
    height: 145,
    borderRadius: radius.md,
    marginHorizontal: 5,
  },

  offerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  offerIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.sand,
    alignItems: 'center',
    justifyContent: 'center',
  },

  offerTag: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.tealDark,
  },

  offerTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '800',
    marginTop: 12,
  },

  offerDescription: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5,
  },

  // ========================================
  // SERVICES
  // ========================================

  popularCard: {
    width: 190,
    minHeight: 225,

    marginRight: 13,
    padding: 16,

    borderRadius: 20,
    backgroundColor: '#FFFFFF',

    elevation: 3,

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },

  serviceEmoji: {
    fontSize: 21,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 12,
    gap: 4,
  },

  fromText: {
    color: colors.muted,
    fontSize: 10,
  },

  servicePrice: {
    color: colors.tealDark,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 12,
  },

  popularHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  popularBadge: {
     paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,

    backgroundColor: '#F3EEFF',
  },

  popularBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.7,
    color:colors.success
  },

  // ========================================
  // ACTIVE ORDER
  // ========================================

  orderCard: {
    marginBottom: spacing.md,
  },

  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  orderLabel: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  orderId: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '800',
    marginTop: 4,
  },

  orderDivider: {
    height: 1,
    backgroundColor: colors.line,
    marginVertical: spacing.md,
  },

  orderInfoRow: {
    flexDirection: 'row',
    gap: 30,
  },

  orderInfo: {
    flex: 1,
  },

  infoLabel: {
    color: colors.muted,
    fontSize: 11,
  },

  infoValue: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },

  amount: {
    color: colors.tealDark,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },

  deliveryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.sand,
    borderRadius: radius.md,
    padding: 11,
    marginTop: spacing.md,
  },

  deliveryIcon: {
    fontSize: 20,
    marginRight: 10,
  },

  deliveryTextContainer: {
    flex: 1,
  },

  deliveryLabel: {
    color: colors.muted,
    fontSize: 10,
  },

  deliveryDate: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },

  trackButton: {
    alignItems: 'center',
    marginTop: spacing.md,
    paddingVertical: 8,
  },

  trackButtonText: {
    color: colors.tealDark,
    fontSize: 14,
    fontWeight: '800',
  },

  // ========================================
  // EMPTY STATES
  // ========================================

  noOrderCard: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },

  noOrderIcon: {
    fontSize: 42,
    marginBottom: 10,
  },

  noOrderTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '800',
  },

  noOrderText: {
    color: colors.muted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 5,
  },

  noOrderButton: {
    width: '100%',
    marginTop: spacing.md,
  },

  // ========================================
  // REFRESH
  // ========================================

  refreshing: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: 12,
    marginVertical: spacing.md,
  },

  // ========================================
  // LOGOUT
  // ========================================

  logoutContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    marginHorizontal: spacing.md,
  },
})
