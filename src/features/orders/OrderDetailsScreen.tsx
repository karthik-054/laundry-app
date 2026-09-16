import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import { useNavigation } from '@react-navigation/native';

import type {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { ErrorState, Loading } from '../../components/States';
import { Input } from '../../components/Input';

import { colors, spacing } from '../../app/theme';

import { useOrderQuery } from './orderApi';

import {
  useCreateReviewMutation,
  useGetMyOrderReviewQuery,
} from '../reviews/reviewApi';

import {
  formatWhen,
  inr,
} from '../../utils/format';

import {
  useState,
} from 'react';

import {
  useAppSelector,
} from '../../app/store';

import type {
  CustomerStackParamList,
  AdminStackParamList,
  DeliveryStackParamList,
} from '../../app/navigation/types';


// ========================================
// PROPS
// ========================================

type Props =
  | NativeStackScreenProps<
      CustomerStackParamList,
      'OrderDetails'
    >
  | NativeStackScreenProps<
      AdminStackParamList,
      'OrderDetails'
    >
  | NativeStackScreenProps<
      DeliveryStackParamList,
      'OrderDetails'
    >;


// ========================================
// SCREEN
// ========================================

export function OrderDetailsScreen({
  route,
}: Props) {
  const { orderId } = route.params;

  const role =
    useAppSelector(s => s.auth.role);

  const customerNavigation =
    useNavigation<
      NativeStackNavigationProp<CustomerStackParamList>
    >();


  // ========================================
  // ORDER
  // ========================================

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useOrderQuery(orderId);


  // ========================================
  // REVIEW
  // ========================================

  const {
    data: existingReview,
    isLoading: reviewLoading,
  } = useGetMyOrderReviewQuery(
    orderId,
    {
      skip: role !== 'customer',
    },
  );


  const [
    createReview,
    {
      isLoading: submittingReview,
    },
  ] = useCreateReviewMutation();


  const [rating, setRating] =
    useState(5);

  const [comment, setComment] =
    useState('');


  // ========================================
  // LOADING
  // ========================================

  if (isLoading) {
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  }


  // ========================================
  // ERROR
  // ========================================

  if (error || !data) {
    return (
      <Screen>
        <ErrorState
          message="Order missing"
          onRetry={refetch}
        />
      </Screen>
    );
  }


  // ========================================
  // SUBMIT REVIEW
  // ========================================

  const handleSubmitReview = async () => {
    if (rating < 1 || rating > 5) {
      Alert.alert(
        'Invalid rating',
        'Please select a rating from 1 to 5.',
      );
      return;
    }

    try {
      await createReview({
        orderId: data.id,
        rating,
        comment: comment.trim(),
      }).unwrap();

      Alert.alert(
        'Thank you!',
        'Your review has been submitted successfully.',
      );

      setComment('');
    } catch (e: any) {
      const message =
        e?.data?.message ||
        e?.message ||
        'Could not submit review.';

      Alert.alert(
        'Could not submit review',
        message,
      );
    }
  };


  return (
    <Screen>

      {/* ================================= */}
      {/* ORDER HEADER */}
      {/* ================================= */}

      <Text style={styles.title}>
        {data.orderNumber}
      </Text>

      <StatusBadge
        status={data.status}
      />

      <Text style={styles.muted}>
        {data.serviceName}
        {' · '}
        {data.deliveryPreference}
      </Text>


      {/* ================================= */}
      {/* ORDER PRICE */}
      {/* ================================= */}

      <Card
        style={{
          marginTop: spacing.md,
        }}
      >

        {data.items.map(item => (
          <Text
            key={item.dressTypeId}
            style={styles.line}
          >
            {item.dressName}{'  '}
            {item.quantity} ×{' '}
            {inr(item.unitPrice)}
            {'    '}
            {inr(item.lineTotal)}
          </Text>
        ))}


        <Text style={styles.line}>
          Service {inr(data.serviceCharge)}
        </Text>

        <Text style={styles.line}>
          Quick delivery{' '}
          {inr(data.quickDeliveryCharge)}
        </Text>

        <Text style={styles.line}>
          Membership −
          {inr(data.membershipDiscount)}
        </Text>

        <Text style={styles.line}>
          Coins −
          {inr(data.coinDiscount)}
        </Text>

        <Text style={styles.total}>
          Final {inr(data.finalAmount)}
        </Text>

        <Text style={styles.muted}>
          Pay {data.paymentMethod}
          {' · '}
          {data.paymentStatus}
        </Text>

      </Card>


      {/* ================================= */}
      {/* PICKUP / DELIVERY */}
      {/* ================================= */}

      <Card
        style={{
          marginTop: spacing.md,
        }}
      >

        <Text style={styles.block}>
          Pickup {formatWhen(data.pickupAt)}
        </Text>

        <Text style={styles.block}>
          Expected{' '}
          {formatWhen(data.expectedDeliveryAt)}
        </Text>


        {data.profile ? (
          <>
            <Text style={styles.block}>
              {data.customer?.name}
              {' · '}
              {data.customer?.phone}
            </Text>

            <Text style={styles.block}>
              {data.profile.address}
            </Text>

            <Text style={styles.muted}>
              {data.profile.landmark}
            </Text>
          </>
        ) : null}

      </Card>


      {/* ================================= */}
      {/* CUSTOMER ACTIONS */}
      {/* ================================= */}

      {role === 'customer' ? (

        <View
          style={{
            marginTop: spacing.md,
          }}
        >

          {/* INVOICE */}

          <Button
            title="Invoice"
            variant="ghost"
            onPress={() =>
              customerNavigation.navigate(
                'Invoice',
                {
                  orderId: data.id,
                },
              )
            }
          />


          {/* ================================= */}
          {/* REVIEW */}
          {/* ================================= */}

          {data.status === 'DELIVERED' ? (

            <Card
              style={{
                marginTop: spacing.md,
              }}
            >

              <Text style={styles.reviewTitle}>
                Rate your laundry service
              </Text>

              <Text style={styles.reviewSubtitle}>
                How was your experience?
              </Text>


              {reviewLoading ? (

                <Loading />

              ) : existingReview ? (

                /* ================================= */
                /* ALREADY REVIEWED */
                /* ================================= */

                <View
                  style={{
                    marginTop: 15,
                  }}
                >

                  <Text
                    style={
                      styles.reviewSubmitted
                    }
                  >
                    ✓ Review submitted
                  </Text>


                  <View
                    style={
                      styles.starsContainer
                    }
                  >

                    {[
                      1,
                      2,
                      3,
                      4,
                      5,
                    ].map(star => (
                      <Text
                        key={star}
                        style={
                          styles.starSubmitted
                        }
                      >
                        {star <=
                        existingReview.rating
                          ? '★'
                          : '☆'}
                      </Text>
                    ))}

                  </View>


                  {existingReview.comment ? (
                    <Text
                      style={
                        styles.existingComment
                      }
                    >
                      "{existingReview.comment}"
                    </Text>
                  ) : null}

                </View>

              ) : (

                /* ================================= */
                /* NEW REVIEW */
                /* ================================= */

                <View
                  style={{
                    marginTop: 15,
                  }}
                >

                  {/* STARS */}

                  <View
                    style={
                      styles.starsContainer
                    }
                  >

                    {[
                      1,
                      2,
                      3,
                      4,
                      5,
                    ].map(star => (

                      <TouchableOpacity
                        key={star}
                        onPress={() =>
                          setRating(star)
                        }
                        activeOpacity={0.7}
                      >

                        <Text
                          style={
                            styles.star
                          }
                        >
                          {star <= rating
                            ? '★'
                            : '☆'}
                        </Text>

                      </TouchableOpacity>

                    ))}

                  </View>


                  <Text
                    style={styles.ratingText}
                  >
                    {rating}/5
                  </Text>


                  {/* COMMENT */}

                  <Input
                    label="Review"
                    value={comment}
                    onChangeText={
                      setComment
                    }
                  />


                  {/* SUBMIT */}

                  <Button
                    title={
                      submittingReview
                        ? 'Submitting...'
                        : 'Submit review'
                    }
                    disabled={
                      submittingReview
                    }
                    onPress={
                      handleSubmitReview
                    }
                  />

                </View>

              )}

            </Card>

          ) : null}

        </View>

      ) : null}

    </Screen>
  );
}


// ========================================
// STYLES
// ========================================

const styles = StyleSheet.create({

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 8,
  },

  muted: {
    color: colors.muted,
    marginTop: 8,
  },

  line: {
    marginBottom: 4,
    color: colors.ink,
  },

  total: {
    fontWeight: '800',
    fontSize: 18,
    marginTop: 8,
  },

  block: {
    color: colors.ink,
    marginBottom: 4,
    fontWeight: '600',
  },


  // ========================================
  // REVIEW
  // ========================================

  reviewTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.ink,
  },

  reviewSubtitle: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 4,
  },

  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },

  star: {
    fontSize: 38,
    marginHorizontal: 4,
    color: '#F5B301',
  },

  starSubmitted: {
    fontSize: 28,
    marginHorizontal: 3,
    color: '#F5B301',
  },

  ratingText: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: colors.muted,
    marginBottom: 8,
  },

  reviewSubmitted: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '800',
    color: colors.tealDark,
  },

  existingComment: {
    textAlign: 'center',
    color: colors.ink,
    marginTop: 8,
    fontStyle: 'italic',
  },

});