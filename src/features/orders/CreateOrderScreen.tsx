import { useMemo, useState } from 'react';

import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Loading } from '../../components/States';

import {
  useWalletQuery,
  useCoinsQuery,
} from '../payments/paymentApi';

import {
  colors,
  radius,
  spacing,
} from '../../app/theme';

import {
  useDressTypesQuery,
  usePricesQuery,
  useServicesQuery,
} from '../laundry/serviceApi';

import {
  usePlaceOrderMutation,
  useQuoteOrderMutation,
} from './orderApi';

import {
  formatWhen,
  inr,
} from '../../utils/format';

import type {
  Quote,
  Service,
  DressType,
  ServicePrice
} from '../../types';

import type {
  CustomerStackParamList,
} from '../../app/navigation/types';


function tomorrowTen(): string {
  const d = new Date();

  d.setDate(d.getDate() + 1);

  d.setHours(
    10,
    0,
    0,
    0,
  );

  return d.toISOString();
}


type Props =
  NativeStackScreenProps<
    CustomerStackParamList,
    'CreateOrder'
  >;


export function CreateOrderScreen({
  navigation,
  route
}: Props) {

  // ============================================
  // WALLET
  // ============================================

  const {
    data: walletData,
    isLoading: walletLoading,
  } = useWalletQuery();

  const wallet =
    walletData?.balance ?? 0;


  // ============================================
  // COINS
  // ============================================

  const {
    data: coinData,
    isLoading: coinsLoading,
  } = useCoinsQuery();

  const coins =
    coinData?.balance ?? 0;


  // ============================================
  // CATALOG
  // ============================================

  const {
    data: services = [],
    isLoading: loadingServices,
    isError: servicesError,
  } = useServicesQuery();


  const {
    data: dresses = [],
    isLoading: loadingDresses,
    isError: dressesError,
  } = useDressTypesQuery();


  const {
    data: prices = [],
    isLoading: loadingPrices,
  } = usePricesQuery();


  // ============================================
  // FORM
  // ============================================

const [
  serviceId,
  setServiceId,
] = useState<string | undefined>(
  route.params?.serviceId,
);


  const [
    qty,
    setQty,
  ] = useState<Record<string, number>>({});


  const [
    pref,
    setPref,
  ] = useState<
    'normal' | 'quick'
  >('normal');


  const [
    coinsToRedeem,
    setCoinsToRedeem,
  ] = useState('0');


  const [
    pickupAt,
    setPickupAt,
  ] = useState(
    tomorrowTen(),
  );


  const [
    method,
    setMethod,
  ] = useState<
    | 'razorpay'
    | 'wallet'
    | 'cod'
    | 'wallet_razorpay'
  >('cod');


  const [
    walletAmount,
    setWalletAmount,
  ] = useState('0');


  const [
    quote,
    setQuote,
  ] = useState<Quote | null>(null);


  // ============================================
  // MUTATIONS
  // ============================================

  const [
    getQuote,
    {
      isLoading: quoting,
    },
  ] = useQuoteOrderMutation();


  const [
    placeOrder,
    {
      isLoading: placing,
    },
  ] = usePlaceOrderMutation();


  // ============================================
  // ITEMS
  // ============================================

  const items = useMemo(
    () =>
      Object.entries(qty)
        .filter(
          ([, quantity]) =>
            quantity > 0,
        )
        .map(
          ([
            dressTypeId,
            quantity,
          ]) => ({
            dressTypeId,
            quantity,
          }),
        ),
    [qty],
  );


  // ============================================
  // SELECT SERVICE
  // ============================================

  function selectService(
    id: string,
  ) {
    setServiceId(id);

    setQty({});

    setQuote(null);
  }


  // ============================================
  // CHANGE QUANTITY
  // ============================================

  function changeQuantity(
    dressTypeId: string,
    change: number,
  ) {
    setQty(current => {
      const currentQty =
        current[dressTypeId] ?? 0;

      const newQty =
        Math.max(
          0,
          currentQty + change,
        );

      return {
        ...current,
        [dressTypeId]: newQty,
      };
    });

    setQuote(null);
  }


  // ============================================
  // GET PRICE
  // ============================================

  function getDressPrice(
    dressTypeId: string,
  ) {
    if (!serviceId) {
      return undefined;
    }

    return prices.find(
      price =>
        price.serviceId === serviceId &&
        price.dressTypeId === dressTypeId &&
        price.deliveryPreference === pref,
    )?.unitPrice;
  }


  // ============================================
  // QUOTE
  // ============================================

  async function refreshQuote() {

    if (!serviceId) {
      Alert.alert(
        'Select service',
        'Please select a laundry service.',
      );

      return;
    }


    if (items.length === 0) {
      Alert.alert(
        'Select garments',
        'Please select at least one garment.',
      );

      return;
    }


    if (!pickupAt) {
      Alert.alert(
        'Pickup time',
        'Please select a pickup time.',
      );

      return;
    }


    const requestedCoins =
      Number(coinsToRedeem) || 0;


    if (requestedCoins < 0) {
      Alert.alert(
        'Invalid coins',
        'Coins cannot be negative.',
      );

      return;
    }


    if (requestedCoins > coins) {
      Alert.alert(
        'Insufficient coins',
        `You only have ${coins} coins.`,
      );

      return;
    }


    try {

      const result =
        await getQuote({
          serviceId,

          items,

          deliveryPreference:
            pref,

          coinsToRedeem:
            requestedCoins,

          pickupAt,
        }).unwrap();


      setQuote(result);

    } catch (error) {

      console.error(
        'Quote error:',
        error,
      );

      Alert.alert(
        'Quote failed',
        'Unable to calculate the order price.',
      );
    }
  }


  // ============================================
  // PLACE ORDER
  // ============================================

  async function submit() {

    if (!serviceId) {
      Alert.alert(
        'Select service',
        'Please select a service.',
      );

      return;
    }


    if (items.length === 0) {
      Alert.alert(
        'Select garments',
        'Please select at least one garment.',
      );

      return;
    }


    if (!quote) {
      Alert.alert(
        'Calculate price',
        'Please calculate the order price first.',
      );

      return;
    }


    const requestedCoins =
      Number(coinsToRedeem) || 0;


    if (requestedCoins > coins) {
      Alert.alert(
        'Insufficient coins',
        'You do not have enough coins.',
      );

      return;
    }


    const requestedWalletAmount =
      Number(walletAmount) || 0;


    // ==========================================
    // WALLET PAYMENT
    // ==========================================

    if (
      method === 'wallet' &&
      wallet < quote.finalAmount
    ) {

      Alert.alert(
        'Insufficient wallet balance',

        `You need ${inr(
          quote.finalAmount,
        )}, but your wallet has ${inr(
          wallet,
        )}.`,
      );

      return;
    }


    // ==========================================
    // WALLET + RAZORPAY
    // ==========================================

    if (
      method === 'wallet_razorpay' &&
      requestedWalletAmount < 0
    ) {

      Alert.alert(
        'Invalid wallet amount',
        'Wallet amount cannot be negative.',
      );

      return;
    }


    if (
      method === 'wallet_razorpay' &&
      requestedWalletAmount > wallet
    ) {

      Alert.alert(
        'Insufficient wallet balance',

        `Your wallet balance is ${inr(
          wallet,
        )}.`,
      );

      return;
    }


    if (
      method === 'wallet_razorpay' &&
      requestedWalletAmount > quote.finalAmount
    ) {

      Alert.alert(
        'Invalid wallet amount',
        'Wallet amount cannot exceed the order amount.',
      );

      return;
    }


    try {

      const order =
        await placeOrder({
          serviceId,

          items,

          deliveryPreference:
            pref,

          coinsToRedeem:
            requestedCoins,

          pickupAt,

          paymentMethod:
            method,

          walletAmount:
            method === 'wallet_razorpay'
              ? requestedWalletAmount
              : undefined,
        }).unwrap();


      // ==========================================
      // IMPORTANT
      // ==========================================
      //
      // DO NOT manually calculate wallet/coins here.
      //
      // placeOrder invalidates:
      //
      // Wallet
      // Coins
      // Orders
      // Session
      //
      // RTK Query will fetch the latest server
      // balances automatically.
      // ==========================================


      Alert.alert(
        'Order placed',

        `Order ${order.orderNumber} created successfully.`,

        [
          {
            text: 'View Order',

            onPress: () =>
              navigation.replace(
                'OrderDetails',
                {
                  orderId:
                    order.id,
                },
              ),
          },
        ],
      );

    } catch (error) {

      console.error(
        'Place order error:',
        error,
      );

      Alert.alert(
        'Could not place order',

        'Unable to create the order. Please try again.',
      );
    }
  }


  // ============================================
  // LOADING
  // ============================================

  if (
    loadingServices ||
    loadingDresses ||
    loadingPrices ||
    walletLoading ||
    coinsLoading
  ) {

    return (
      <Screen>
        <Loading />
      </Screen>
    );
  }


  // ============================================
  // ERROR
  // ============================================

  if (
    servicesError ||
    dressesError
  ) {

    return (
      <Screen>

        <Text style={styles.title}>
          New Pickup
        </Text>

        <Card>

          <Text style={styles.error}>
            Unable to load laundry services.
          </Text>

          <Text style={styles.muted}>
            Please check your backend connection and try again.
          </Text>

        </Card>

      </Screen>
    );
  }


  // ============================================
  // UI
  // ============================================

  return (
    <Screen>

      {/* ===================================== */}
      {/* TITLE */}
      {/* ===================================== */}

      <Text style={styles.title}>
        New Pickup
      </Text>

      <Text style={styles.subtitle}>
        Select your service and garments
      </Text>


      {/* ===================================== */}
      {/* SERVICES */}
      {/* ===================================== */}

      <Text style={styles.section}>
        1. Select Service
      </Text>


      {services.length === 0 ? (

        <Card>

          <Text style={styles.muted}>
            No services available.
          </Text>

        </Card>

      ) : (

        services.map(service => (

          <Pressable
            key={service.id}

            onPress={() =>
              selectService(
                service.id,
              )
            }

            style={[
              styles.chip,

              serviceId === service.id &&
                styles.chipOn,
            ]}
          >

            <Text style={styles.chipTitle}>
              {service.name}
            </Text>


            {service.description ? (

              <Text style={styles.muted}>
                {service.description}
              </Text>

            ) : null}


            <Text style={styles.processing}>
              Normal: {service.processingHoursNormal}h
              {'  '}
              Quick: {service.processingHoursQuick}h
            </Text>

          </Pressable>

        ))
      )}


      {/* ===================================== */}
      {/* GARMENTS */}
      {/* ===================================== */}

      <Text style={styles.section}>
        2. Select Garments
      </Text>


      {dresses.length === 0 ? (

        <Card>

          <Text style={styles.muted}>
            No garments available.
          </Text>

        </Card>

      ) : (

        dresses.map(dress => {

          const unitPrice =
            getDressPrice(
              dress.id,
            );


          const quantity =
            qty[dress.id] ?? 0;


          return (

            <Card
              key={dress.id}
              style={styles.garmentCard}
            >

              <View style={styles.row}>

                <View style={styles.garmentInfo}>

                  <Text style={styles.chipTitle}>
                    {dress.name}
                  </Text>


                  <Text style={styles.muted}>

                    {unitPrice != null

                      ? `${inr(
                          unitPrice,
                        )} / piece`

                      : serviceId

                        ? 'Price not available'

                        : 'Select service first'}

                  </Text>

                </View>


                <View style={styles.stepper}>

                  <Pressable
                    onPress={() =>
                      changeQuantity(
                        dress.id,
                        -1,
                      )
                    }

                    style={
                      styles.stepButton
                    }
                  >

                    <Text style={styles.step}>
                      −
                    </Text>

                  </Pressable>


                  <Text style={styles.qty}>
                    {quantity}
                  </Text>


                  <Pressable
                    onPress={() =>
                      changeQuantity(
                        dress.id,
                        1,
                      )
                    }

                    style={
                      styles.stepButton
                    }
                  >

                    <Text style={styles.step}>
                      +
                    </Text>

                  </Pressable>

                </View>

              </View>

            </Card>
          );
        })
      )}


      {/* ===================================== */}
      {/* PICKUP */}
      {/* ===================================== */}

      <Text style={styles.section}>
        3. Pickup
      </Text>


      <Input
        label="Pickup time"
        value={pickupAt}

        onChangeText={text => {
          setPickupAt(text);
          setQuote(null);
        }}

        placeholder="2026-09-08T10:00:00.000Z"
      />


      <Text style={styles.helper}>
        Example: 2026-09-08T10:00:00.000Z
      </Text>


      {/* ===================================== */}
      {/* DELIVERY */}
      {/* ===================================== */}

      <Text style={styles.section}>
        4. Delivery Type
      </Text>


      <View style={styles.row}>

        <Pressable
          onPress={() => {
            setPref('normal');
            setQuote(null);
          }}

          style={[
            styles.preference,

            pref === 'normal' &&
              styles.preferenceOn,
          ]}
        >

          <Text style={styles.chipTitle}>
            Normal
          </Text>

          <Text style={styles.muted}>
            Standard delivery
          </Text>

        </Pressable>


        <Pressable
          onPress={() => {
            setPref('quick');
            setQuote(null);
          }}

          style={[
            styles.preference,

            pref === 'quick' &&
              styles.preferenceOn,
          ]}
        >

          <Text style={styles.chipTitle}>
            Quick
          </Text>

          <Text style={styles.muted}>
            Faster delivery
          </Text>

        </Pressable>

      </View>


      {/* ===================================== */}
      {/* COINS */}
      {/* ===================================== */}

      <Text style={styles.section}>
        5. Coins
      </Text>


      <Text style={styles.balanceText}>
        Available coins: {coins}
      </Text>


      <Input
        label="Coins to redeem"

        value={coinsToRedeem}

        onChangeText={text => {

          setCoinsToRedeem(
            text.replace(
              /[^0-9]/g,
              '',
            ),
          );

          setQuote(null);
        }}

        keyboardType="number-pad"
      />


      {/* ===================================== */}
      {/* PAYMENT */}
      {/* ===================================== */}

      <Text style={styles.section}>
        6. Payment Method
      </Text>


      {(
        [
          'cod',
          'wallet',
          'razorpay',
          'wallet_razorpay',
        ] as const
      ).map(payment => (

        <Pressable
          key={payment}

          onPress={() =>
            setMethod(payment)
          }

          style={[
            styles.chip,

            method === payment &&
              styles.chipOn,
          ]}
        >

          <Text style={styles.chipTitle}>

            {payment === 'wallet_razorpay'

              ? 'Wallet + Razorpay'

              : payment === 'razorpay'

                ? 'Razorpay'

                : payment === 'wallet'

                  ? 'Wallet'

                  : 'Cash on Delivery'}

          </Text>

        </Pressable>
      ))}


      {/* ===================================== */}
      {/* WALLET + RAZORPAY */}
      {/* ===================================== */}

      {method === 'wallet_razorpay' ? (

        <Input
          label={`Wallet amount (${inr(
            wallet,
          )} available)`}

          value={walletAmount}

          onChangeText={text => {

            setWalletAmount(
              text.replace(
                /[^0-9.]/g,
                '',
              ),
            );

            setQuote(null);
          }}

          keyboardType="decimal-pad"
        />

      ) : null}


      {/* ===================================== */}
      {/* WALLET INFO */}
      {/* ===================================== */}

      {method === 'wallet' ? (

        <Text style={styles.balanceText}>
          Wallet balance: {inr(wallet)}
        </Text>

      ) : null}


      {/* ===================================== */}
      {/* QUOTE BUTTON */}
      {/* ===================================== */}

      <Button
        title="Calculate Price"
        variant="ghost"
        onPress={refreshQuote}
        loading={quoting}
      />


      {/* ===================================== */}
      {/* QUOTE */}
      {/* ===================================== */}

      {quote ? (

        <Card style={styles.quoteCard}>

          <Text style={styles.quoteTitle}>
            Order Summary
          </Text>


          {quote.items.map(item => (

            <View
              key={item.dressTypeId}
              style={styles.summaryRow}
            >

              <Text>
                {item.dressName} × {item.quantity}
              </Text>

              <Text>
                {inr(item.lineTotal)}
              </Text>

            </View>
          ))}


          <View style={styles.divider} />


          <View style={styles.summaryRow}>

            <Text>
              Subtotal
            </Text>

            <Text>
              {inr(quote.subtotal)}
            </Text>

          </View>


          <View style={styles.summaryRow}>

            <Text>
              Service charge
            </Text>

            <Text>
              {inr(quote.serviceCharge)}
            </Text>

          </View>


          <View style={styles.summaryRow}>

            <Text>
              Quick delivery
            </Text>

            <Text>
              {inr(
                quote.quickDeliveryCharge,
              )}
            </Text>

          </View>


          <View style={styles.summaryRow}>

            <Text>
              Membership
            </Text>

            <Text>
              -{inr(
                quote.membershipDiscount,
              )}
            </Text>

          </View>


          <View style={styles.summaryRow}>

            <Text>
              Coins
            </Text>

            <Text>
              -{inr(
                quote.coinDiscount,
              )}
            </Text>

          </View>


          <View style={styles.divider} />


          <View style={styles.summaryRow}>

            <Text style={styles.totalLabel}>
              Total
            </Text>

            <Text style={styles.total}>
              {inr(
                quote.finalAmount,
              )}
            </Text>

          </View>


          <Text style={styles.expected}>
            Expected delivery:{' '}
            {formatWhen(
              quote.expectedDeliveryAt,
            )}
          </Text>


          <Text style={styles.expected}>
            Coins earned:{' '}
            {quote.coinsEarned}
          </Text>

        </Card>

      ) : null}


      {/* ===================================== */}
      {/* PLACE ORDER */}
      {/* ===================================== */}

      <Button
        title="Place Order"
        onPress={submit}
        loading={placing}
      />

    </Screen>
  );
}


// ==============================================
// STYLES
// ==============================================

const styles = StyleSheet.create({

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 4,
  },

  subtitle: {
    color: colors.muted,
    marginBottom: spacing.md,
  },

  section: {
    fontWeight: '800',
    fontSize: 16,
    marginTop: spacing.md,
    marginBottom: 8,
    color: colors.ink,
  },

  chip: {
    backgroundColor: colors.paper,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.line,
  },

  chipOn: {
    borderColor: colors.teal,
    backgroundColor: '#E7F4F3',
  },

  chipTitle: {
    fontWeight: '700',
    color: colors.ink,
  },

  muted: {
    color: colors.muted,
    marginTop: 4,
  },

  processing: {
    color: colors.teal,
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  garmentCard: {
    marginBottom: 8,
  },

  garmentInfo: {
    flex: 1,
  },

  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  stepButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E7F4F3',
  },

  step: {
    fontSize: 22,
    color: colors.teal,
    fontWeight: '700',
  },

  qty: {
    fontWeight: '800',
    minWidth: 20,
    textAlign: 'center',
  },

  preference: {
    flex: 1,
    backgroundColor: colors.paper,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
  },

  preferenceOn: {
    borderColor: colors.teal,
    backgroundColor: '#E7F4F3',
  },

  helper: {
    fontSize: 12,
    color: colors.muted,
    marginTop: -4,
  },

  balanceText: {
    color: colors.teal,
    fontWeight: '700',
    marginBottom: 8,
  },

  quoteCard: {
    marginVertical: spacing.md,
  },

  quoteTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  divider: {
    height: 1,
    backgroundColor: colors.line,
    marginVertical: 8,
  },

  totalLabel: {
    fontWeight: '800',
    fontSize: 17,
  },

  total: {
    fontWeight: '800',
    fontSize: 20,
    color: colors.teal,
  },

  expected: {
    color: colors.muted,
    marginTop: 8,
  },

  error: {
    fontWeight: '800',
    color: colors.ink,
    fontSize: 16,
  },
});