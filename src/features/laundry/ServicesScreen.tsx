import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native'

import { Screen } from '../../components/Screen'
import { Loading } from '../../components/States'
import { colors, spacing, radius } from '../../app/theme'

import {
  useDressTypesQuery,
  usePricesQuery,
  useServicesQuery,
} from './serviceApi'

import { inr } from '../../utils/format'

import { useNavigation } from '@react-navigation/native'

import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import type { CustomerStackParamList } from '../../app/navigation/types'

// =====================================================
// SERVICE ICON
// =====================================================

const getServiceIcon = (name?: string) => {
  const value = name?.toLowerCase() ?? ''

  if (
    value.includes('dry') ||
    value.includes('cleaning')
  ) {
    return '🧥'
  }

  if (
    value.includes('iron') ||
    value.includes('press')
  ) {
    return '👔'
  }

  if (
    value.includes('fold') ||
    value.includes('pack')
  ) {
    return '🧺'
  }

  if (
    value.includes('shoe') ||
    value.includes('sneaker')
  ) {
    return '👟'
  }

  if (
    value.includes('wash') ||
    value.includes('laundry')
  ) {
    return '🫧'
  }

  if (
    value.includes('blanket') ||
    value.includes('curtain')
  ) {
    return '🛏️'
  }

  return '🧺'
}

// =====================================================
// PROPS
// =====================================================

type Props = NativeStackScreenProps<
  CustomerStackParamList,
  'Services'
>

// =====================================================
// SCREEN
// =====================================================

export function ServicesScreen({ route }: Props) {
  // ===================================================
  // NAVIGATION
  // ===================================================

  const navigation =
    useNavigation<
      NativeStackNavigationProp<CustomerStackParamList>
    >()

  // ===================================================
  // API
  // ===================================================

  const {
    data: services,
    isLoading,
  } = useServicesQuery()

  const {
    data: dresses,
  } = useDressTypesQuery()

  const {
    data: prices,
  } = usePricesQuery()

  // ===================================================
  // FILTER
  // ===================================================

  const filter = route.params?.filter

  // ===================================================
  // FILTER SERVICES
  // ===================================================

  const filteredServices =
    services?.filter(service => {
      // -----------------------------------------------
      // BASIC
      // -----------------------------------------------

      if (filter === 'basic') {
        return (
          service.category?.toLowerCase() ===
          'basic'
        )
      }

      // -----------------------------------------------
      // POPULAR
      // -----------------------------------------------

      if (filter === 'popular') {
        return service.isPopular === true
      }

      // -----------------------------------------------
      // ALL SERVICES
      // -----------------------------------------------

      return true
    }) ?? []

  // ===================================================
  // SHOW MAXIMUM 4
  // ===================================================

  const visibleServices =
    filter === 'basic' ||
    filter === 'popular'
      ? filteredServices.slice(0, 4)
      : filteredServices

  // ===================================================
  // LOADING
  // ===================================================

  if (isLoading) {
    return (
      <Screen>
        <Loading />
      </Screen>
    )
  }

  // ===================================================
  // HEADER TITLE
  // ===================================================

  const screenTitle =
    filter === 'basic'
      ? 'Basic Services'
      : filter === 'popular'
        ? 'Popular Services'
        : 'Our Services'

  // ===================================================
  // HEADER SUBTITLE
  // ===================================================

  const screenSubtitle =
    filter === 'basic'
      ? 'Everyday laundry made easy'
      : filter === 'popular'
        ? 'Most loved by our customers'
        : 'Choose the perfect care for your clothes'

  // ===================================================
  // EMPTY TITLE
  // ===================================================

  const emptyTitle =
    filter === 'basic'
      ? 'No basic services available'
      : filter === 'popular'
        ? 'No popular services available'
        : 'No services available'

  // ===================================================
  // UI
  // ===================================================

  return (
    <Screen scroll={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <View style={styles.header}>
          <Text style={styles.title}>
            {screenTitle}
          </Text>

          <Text style={styles.subtitle}>
            {screenSubtitle}
          </Text>
        </View>

        {/* ========================================= */}
        {/* SERVICE CARDS */}
        {/* ========================================= */}

        {visibleServices.map(service => {
          // =========================================
          // GET DRESS TYPES FOR THIS SERVICE
          // =========================================

          const serviceDresses =
            dresses?.filter(dress =>
              prices?.some(
                price =>
                  price.serviceId ===
                    service.id &&
                  price.dressTypeId ===
                    dress.id,
              ),
            ) ?? []

          // =========================================
          // CARD
          // =========================================

          return (
            <TouchableOpacity
              key={service.id}
              activeOpacity={0.9}
              style={styles.serviceCard}
              onPress={() =>
                navigation.navigate(
                  'CreateOrder',
                  {
                    serviceId:
                      service.id,
                  },
                )
              }
            >
              {/* ================================= */}
              {/* TOP */}
              {/* ================================= */}

              <View style={styles.cardTop}>
                {/* ICON */}

                <View
                  style={
                    styles.iconContainer
                  }
                >
                  <Text style={styles.icon}>
                    {getServiceIcon(
                      service.name,
                    )}
                  </Text>
                </View>

                {/* SERVICE INFO */}

                <View
                  style={styles.serviceInfo}
                >
                  <Text
                    style={
                      styles.serviceName
                    }
                    numberOfLines={2}
                  >
                    {service.name}
                  </Text>

                  {service.description ? (
                    <Text
                      style={
                        styles.description
                      }
                      numberOfLines={3}
                    >
                      {service.description}
                    </Text>
                  ) : null}
                </View>
              </View>

              {/* ================================= */}
              {/* PROCESSING */}
              {/* ================================= */}

              <View
                style={
                  styles.processingRow
                }
              >
                {/* NORMAL */}

                <View
                  style={
                    styles.processingItem
                  }
                >
                  <Text
                    style={
                      styles.processingLabel
                    }
                  >
                    Normal
                  </Text>

                  <Text
                    style={
                      styles.processingValue
                    }
                  >
                    {
                      service.processingHoursNormal
                    }
                    h
                  </Text>
                </View>

                {/* DIVIDER */}

                <View
                  style={
                    styles.processingDivider
                  }
                />

                {/* QUICK */}

                <View
                  style={
                    styles.processingItem
                  }
                >
                  <Text
                    style={
                      styles.processingLabel
                    }
                  >
                    Quick
                  </Text>

                  <Text
                    style={
                      styles.processingValue
                    }
                  >
                    {
                      service.processingHoursQuick
                    }
                    h
                  </Text>
                </View>
              </View>

              {/* ================================= */}
              {/* PRICES */}
              {/* ================================= */}

              {serviceDresses.length > 0 && (
                <View
                  style={
                    styles.priceSection
                  }
                >
                  <Text
                    style={
                      styles.priceTitle
                    }
                  >
                    Starting prices
                  </Text>

                  <View
                    style={
                      styles.priceGrid
                    }
                  >
                    {serviceDresses
                      .slice(0, 4)
                      .map(dress => {
                        // =========================
                        // FIND PRICE
                        // =========================

                        const price =
                          prices?.find(
                            item =>
                              item.serviceId ===
                                service.id &&
                              item.dressTypeId ===
                                dress.id,
                          )

                        // =========================
                        // PRICE ITEM
                        // =========================

                        return (
                          <View
                            key={dress.id}
                            style={
                              styles.priceItem
                            }
                          >
                            <Text
                              style={
                                styles.dressName
                              }
                              numberOfLines={
                                1
                              }
                            >
                              {dress.name}
                            </Text>

                            <Text
                              style={
                                styles.price
                              }
                            >
                              {price
                                ? inr(
                                    price.unitPrice,
                                  )
                                : '—'}
                            </Text>
                          </View>
                        )
                      })}
                  </View>
                </View>
              )}

              {/* ================================= */}
              {/* ACTION */}
              {/* ================================= */}

              <View
                style={
                  styles.cardAction
                }
              >
                <Text
                  style={
                    styles.viewDetails
                  }
                >
                  Select service
                </Text>

                <Text
                  style={styles.arrow}
                >
                  →
                </Text>
              </View>
            </TouchableOpacity>
          )
        })}

        {/* ========================================= */}
        {/* EMPTY STATE */}
        {/* ========================================= */}

        {visibleServices.length === 0 && (
          <View
            style={
              styles.emptyContainer
            }
          >
            <Text
              style={styles.emptyIcon}
            >
              🧺
            </Text>

            <Text
              style={
                styles.emptyTitle
              }
            >
              {emptyTitle}
            </Text>

            <Text
              style={styles.emptyText}
            >
              Please check again later.
            </Text>
          </View>
        )}
      </ScrollView>
    </Screen>
  )
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
    marginHorizontal: spacing.md,
  },

  // ===================================================
  // HEADER
  // ===================================================

  header: {
    marginBottom: spacing.md,
  },

  title: {
    fontSize: 30,
    fontWeight: '900',
    color: colors.ink,
  },

  subtitle: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },

  // ===================================================
  // SERVICE CARD
  // ===================================================

  serviceCard: {
    backgroundColor: colors.paper,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    marginTop: 14,
  },

  // ===================================================
  // CARD TOP
  // ===================================================

  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // ===================================================
  // ICON
  // ===================================================

  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#EEE8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  icon: {
    fontSize: 40,
  },

  // ===================================================
  // SERVICE INFO
  // ===================================================

  serviceInfo: {
    flex: 1,
  },

  serviceName: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },

  description: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5,
  },

  // ===================================================
  // PROCESSING
  // ===================================================

  processingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 11,
    paddingHorizontal: 12,
    backgroundColor: colors.cream,
    borderRadius: radius.md,
  },

  processingItem: {
    flex: 1,
  },

  processingLabel: {
    color: colors.muted,
    fontSize: 10,
  },

  processingValue: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },

  processingDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.line,
  },

  // ===================================================
  // PRICES
  // ===================================================

  priceSection: {
    marginTop: 15,
  },

  priceTitle: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
  },

  priceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  priceItem: {
    width: '48%',
    backgroundColor: colors.cream,
    borderRadius: 12,
    padding: 9,
  },

  dressName: {
    color: colors.muted,
    fontSize: 10,
  },

  price: {
    color: colors.tealDark,
    fontSize: 13,
    fontWeight: '900',
    marginTop: 3,
  },

  // ===================================================
  // ACTION
  // ===================================================

  cardAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 14,
    paddingTop: 11,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },

  viewDetails: {
    color: colors.tealDark,
    fontSize: 13,
    fontWeight: '800',
  },

  arrow: {
    color: colors.tealDark,
    fontSize: 20,
    fontWeight: '900',
    marginLeft: 6,
  },

  // ===================================================
  // EMPTY
  // ===================================================

  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },

  emptyIcon: {
    fontSize: 50,
  },

  emptyTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '800',
    marginTop: 12,
    textAlign: 'center',
  },

  emptyText: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 5,
  },
})