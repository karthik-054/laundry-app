import React from 'react'

import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { Screen } from '../../components/Screen'
import { Loading, ErrorState, EmptyState } from '../../components/States'

import { useGetAdminReviewsQuery } from './adminApi'

import { colors, spacing, radius } from '../../app/theme'

export function AdminReviewsScreen () {
  const {
    data: reviews = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetAdminReviewsQuery()

  if (isLoading) {
    return (
      <Screen>
        <Loading />
      </Screen>
    )
  }

  if (error) {
    return (
      <Screen>
        <ErrorState message='Unable to load reviews' onRetry={refetch} />
      </Screen>
    )
  }

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={() => {
              refetch()
            }}
          />
        }
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>Customer Reviews</Text>

        <Text style={styles.subtitle}>
          See what customers are saying about your laundry service.
        </Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{reviews.length}</Text>

          <Text style={styles.summaryLabel}>Total Reviews</Text>
        </View>

        {reviews.length === 0 ? (
          <EmptyState
            title='No reviews yet'
            body='Customer reviews will appear here after delivered orders are rated.'
          />
        ) : (
          reviews.map(review => (
            <View key={review.id} style={styles.reviewCard}>
              {/* CUSTOMER */}
              <View style={styles.topRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {review.customer?.name?.charAt(0)?.toUpperCase() || 'C'}
                  </Text>
                </View>

                <View style={styles.customerInfo}>
                  <Text style={styles.customerName}>
                    {review.customer?.name || 'Customer'}
                  </Text>

                  {review.customer?.phone ? (
                    <Text style={styles.customerPhone}>
                      {review.customer.phone}
                    </Text>
                  ) : null}
                </View>

                <View style={styles.ratingBox}>
                  <Text style={styles.star}>★</Text>

                  <Text style={styles.rating}>{review.rating}</Text>
                </View>
              </View>

              {/* STARS */}
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Text
                    key={star}
                    style={[
                      styles.starText,
                      star <= review.rating
                        ? styles.starActive
                        : styles.starInactive,
                    ]}
                  >
                    ★
                  </Text>
                ))}
              </View>

              {/* COMMENT */}
              <Text style={styles.comment}>
                {review.comment || 'No comment provided.'}
              </Text>

              {/* ORDER */}
              <View style={styles.orderBox}>
                <View>
                  <Text style={styles.orderLabel}>ORDER</Text>

                  <Text style={styles.orderNumber}>
                    {review.order?.orderNumber || 'Unknown order'}
                  </Text>
                </View>

                <View style={styles.serviceBox}>
                  <Text style={styles.orderLabel}>SERVICE</Text>

                  <Text style={styles.serviceName}>
                    {review.order?.serviceName || 'Laundry Service'}
                  </Text>
                </View>
              </View>

              {/* DATE */}
              {review.createdAt ? (
                <Text style={styles.date}>
                  {new Date(review.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </Text>
              ) : null}
            </View>
          ))
        )}
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },

  summaryCard: {
    backgroundColor: '#7138F2',
    borderRadius: 18,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },

  summaryNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  summaryLabel: {
    marginTop: 3,
    color: '#E8DDFF',
    fontSize: 12,
    fontWeight: '700',
  },

  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
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

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8DDFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#7138F2',
  },

  customerInfo: {
    flex: 1,
    marginLeft: 12,
  },

  customerName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
  },

  customerPhone: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
  },

  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4CF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },

  star: {
    fontSize: 15,
    color: '#E1A900',
  },

  rating: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: '900',
    color: '#8A6800',
  },

  starsRow: {
    flexDirection: 'row',
    marginTop: 12,
  },

  starText: {
    fontSize: 19,
    marginRight: 3,
  },

  starActive: {
    color: '#E1A900',
  },

  starInactive: {
    color: '#D9D9D9',
  },

  comment: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    color: '#414655',
  },

  orderBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    padding: 12,
    backgroundColor: '#F7F7FA',
    borderRadius: 12,
  },

  serviceBox: {
    alignItems: 'flex-end',
    maxWidth: '55%',
  },

  orderLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: colors.muted,
  },

  orderNumber: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '800',
    color: colors.ink,
  },

  serviceName: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'right',
  },

  date: {
    marginTop: 10,
    fontSize: 10,
    color: colors.muted,
  },
})
