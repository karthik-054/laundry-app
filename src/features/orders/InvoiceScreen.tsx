import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import {
  ErrorState,
  Loading,
} from '../../components/States';

import {
  colors,
  spacing,
  radius,
} from '../../app/theme';

import {
  useInvoiceQuery,
} from './orderApi';

import {
  inr,
} from '../../utils/format';

import type {
  CustomerStackParamList,
} from '../../app/navigation/types';


type InvoiceItem = {
  dressName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};


export function InvoiceScreen({
  route,
}: NativeStackScreenProps<
  CustomerStackParamList,
  'Invoice'
>) {

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useInvoiceQuery(
    route.params.orderId,
  );

  const snap =
    data?.snapshot as
      | Record<string, unknown>
      | undefined;

  const items =
    (snap?.items as InvoiceItem[]) ?? [];


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

  if (error || !snap) {
    return (
      <Screen>
        <ErrorState
          message="Invoice unavailable"
          onRetry={refetch}
        />
      </Screen>
    );
  }


  // ========================================
  // VALUES
  // ========================================

  const businessName =
    String(
      snap.businessName ??
      'Laundry Service',
    );

  const invoiceNumber =
    String(
      snap.invoiceNumber ??
      snap.orderNumber ??
      '',
    );

  const orderNumber =
    String(
      snap.orderNumber ?? '',
    );

  const customer =
    String(
      snap.customer ?? 'Customer',
    );

  const customerPhone =
    String(
      snap.customerPhone ?? '',
    );

  const customerEmail =
    String(
      snap.customerEmail ?? '',
    );

  const address =
    String(
      snap.address ?? '',
    );

  const landmark =
    String(
      snap.landmark ?? '',
    );

  const serviceName =
    String(
      snap.serviceName ??
      'Laundry Service',
    );

  const deliveryPreference =
    String(
      snap.deliveryPreference ??
      'normal',
    );

  const date =
    snap.date
      ? String(snap.date)
      : '';

  const pickupAt =
    snap.pickupAt
      ? String(snap.pickupAt)
      : '';

  const expectedDeliveryAt =
    snap.expectedDeliveryAt
      ? String(snap.expectedDeliveryAt)
      : '';

  const subtotal =
    Number(
      snap.subtotal ?? 0,
    );

  const serviceCharge =
    Number(
      snap.serviceCharge ?? 0,
    );

  const quickDeliveryCharge =
    Number(
      snap.quickDeliveryCharge ?? 0,
    );

  const membershipDiscount =
    Number(
      snap.membershipDiscount ?? 0,
    );

  const coinsUsed =
    Number(
      snap.coinsUsed ?? 0,
    );

  const coinDiscount =
    Number(
      snap.coinDiscount ?? 0,
    );

  const finalAmount =
    Number(
      snap.finalAmount ?? 0,
    );

  const coinsEarned =
    Number(
      snap.coinsEarned ?? 0,
    );

  const paymentMethod =
    String(
      snap.paymentMethod ?? '',
    );

  const paymentStatus =
    String(
      snap.paymentStatus ?? '',
    );


  return (
    <Screen>
      

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.container
        }
      >

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <View style={styles.header}>

          <View>
            <Text style={styles.headerKicker}>
              {businessName}
            </Text>

            <Text style={styles.headerTitle}>
              Invoice
            </Text>
          </View>

          <View style={styles.invoiceIcon}>
            <Text style={styles.invoiceIconText}>
              ₹
            </Text>
          </View>

        </View>


        {/* ================================= */}
        {/* INVOICE INFORMATION */}
        {/* ================================= */}

        <Card style={styles.invoiceCard}>

          <View style={styles.invoiceTop}>

            <View>
              <Text style={styles.smallLabel}>
                TAX INVOICE
              </Text>

              <Text style={styles.invoiceNumber}>
                {invoiceNumber}
              </Text>
            </View>

            <View style={styles.paidBadge}>
              <View style={styles.paidDot} />

              <Text style={styles.paidText}>
                {paymentStatus
                  ? paymentStatus.toUpperCase()
                  : 'INVOICE'}
              </Text>
            </View>

          </View>


          <View style={styles.divider} />


          <View style={styles.infoGrid}>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>
                ORDER
              </Text>

              <Text style={styles.infoValue}>
                {orderNumber}
              </Text>
            </View>


            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>
                DATE
              </Text>

              <Text style={styles.infoValue}>
                {date
                  ? new Date(date).toLocaleDateString(
                      'en-IN',
                      {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      },
                    )
                  : '-'}
              </Text>
            </View>

          </View>

        </Card>


        {/* ================================= */}
        {/* CUSTOMER */}
        {/* ================================= */}

        <Text style={styles.sectionTitle}>
          BILL TO
        </Text>

        <Card style={styles.customerCard}>

          <View style={styles.customerAvatar}>
            <Text style={styles.customerAvatarText}>
              {customer
                .charAt(0)
                .toUpperCase()}
            </Text>
          </View>


          <View style={styles.customerInfo}>

            <Text style={styles.customerName}>
              {customer}
            </Text>

            {customerPhone ? (
              <Text style={styles.customerDetail}>
                {customerPhone}
              </Text>
            ) : null}

            {customerEmail ? (
              <Text style={styles.customerDetail}>
                {customerEmail}
              </Text>
            ) : null}

            {address ? (
              <Text style={styles.customerAddress}>
                {address}
              </Text>
            ) : null}

            {landmark ? (
              <Text style={styles.customerDetail}>
                {landmark}
              </Text>
            ) : null}

          </View>

        </Card>


        {/* ================================= */}
        {/* SERVICE */}
        {/* ================================= */}

        <Text style={styles.sectionTitle}>
          SERVICE
        </Text>

        <Card style={styles.serviceCard}>

          <View style={styles.serviceIcon}>
            <Text style={styles.serviceIconText}>
              🧺
            </Text>
          </View>


          <View style={styles.serviceInfo}>

            <Text style={styles.serviceName}>
              {serviceName}
            </Text>

            <Text style={styles.serviceType}>
              {deliveryPreference === 'quick'
                ? 'Quick delivery'
                : 'Normal delivery'}
            </Text>

          </View>

        </Card>


        {/* ================================= */}
        {/* ITEMS */}
        {/* ================================= */}

        <Text style={styles.sectionTitle}>
          ITEMS
        </Text>

        <Card style={styles.itemsCard}>

          <View style={styles.tableHeader}>

            <Text
              style={[
                styles.tableHeaderText,
                styles.itemColumn,
              ]}
            >
              ITEM
            </Text>

            <Text
              style={[
                styles.tableHeaderText,
                styles.qtyColumn,
              ]}
            >
              QTY
            </Text>

            <Text
              style={[
                styles.tableHeaderText,
                styles.priceColumn,
              ]}
            >
              RATE
            </Text>

            <Text
              style={[
                styles.tableHeaderText,
                styles.totalColumn,
              ]}
            >
              TOTAL
            </Text>

          </View>


          <View style={styles.divider} />


          {items.length === 0 ? (

            <Text style={styles.emptyItems}>
              No items available
            </Text>

          ) : (

            items.map((item, index) => (

              <View
                key={`${item.dressName}-${index}`}
                style={styles.itemRow}
              >

                <Text
                  style={[
                    styles.itemText,
                    styles.itemColumn,
                  ]}
                  numberOfLines={2}
                >
                  {item.dressName}
                </Text>

                <Text
                  style={[
                    styles.itemText,
                    styles.qtyColumn,
                  ]}
                >
                  {item.quantity}
                </Text>

                <Text
                  style={[
                    styles.itemText,
                    styles.priceColumn,
                  ]}
                >
                  {inr(item.unitPrice)}
                </Text>

                <Text
                  style={[
                    styles.itemText,
                    styles.totalColumn,
                  ]}
                >
                  {inr(item.lineTotal)}
                </Text>

              </View>

            ))

          )}

        </Card>


        {/* ================================= */}
        {/* PRICE SUMMARY */}
        {/* ================================= */}

        <Text style={styles.sectionTitle}>
          PRICE SUMMARY
        </Text>

        <Card style={styles.summaryCard}>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Subtotal
            </Text>

            <Text style={styles.summaryValue}>
              {inr(subtotal)}
            </Text>
          </View>


          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Service charge
            </Text>

            <Text style={styles.summaryValue}>
              {inr(serviceCharge)}
            </Text>
          </View>


          {quickDeliveryCharge > 0 ? (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Quick delivery
              </Text>

              <Text style={styles.summaryValue}>
                {inr(quickDeliveryCharge)}
              </Text>
            </View>
          ) : null}


          {membershipDiscount > 0 ? (
            <View style={styles.summaryRow}>
              <Text style={styles.discountLabel}>
                Membership discount
              </Text>

              <Text style={styles.discountValue}>
                -{inr(membershipDiscount)}
              </Text>
            </View>
          ) : null}


          {coinDiscount > 0 ? (
            <View style={styles.summaryRow}>
              <Text style={styles.discountLabel}>
                Coin discount
              </Text>

              <Text style={styles.discountValue}>
                -{inr(coinDiscount)}
              </Text>
            </View>
          ) : null}


          <View style={styles.totalDivider} />


          <View style={styles.finalRow}>

            <View>
              <Text style={styles.finalLabel}>
                TOTAL AMOUNT
              </Text>

              <Text style={styles.finalSubtext}>
                Amount payable
              </Text>
            </View>

            <Text style={styles.finalAmount}>
              {inr(finalAmount)}
            </Text>

          </View>

        </Card>


        {/* ================================= */}
        {/* PAYMENT */}
        {/* ================================= */}

        <Text style={styles.sectionTitle}>
          PAYMENT
        </Text>

        <Card style={styles.paymentCard}>

          <View style={styles.paymentIcon}>
            <Text style={styles.paymentIconText}>
              ₹
            </Text>
          </View>


          <View style={styles.paymentInfo}>

            <Text style={styles.paymentMethod}>
              {paymentMethod || 'Payment'}
            </Text>

            <Text style={styles.paymentSubtext}>
              Payment method
            </Text>

          </View>


          <View style={styles.paidBadgeSmall}>

            <Text style={styles.paidTextSmall}>
              {paymentStatus
                ? paymentStatus.toUpperCase()
                : 'PAID'}
            </Text>

          </View>

        </Card>


        {/* ================================= */}
        {/* DELIVERY */}
        {/* ================================= */}

        <Text style={styles.sectionTitle}>
          DELIVERY
        </Text>

        <Card style={styles.deliveryCard}>

          <View style={styles.deliveryRow}>

            <View style={styles.deliveryCircle}>
              <Text style={styles.deliveryEmoji}>
                📦
              </Text>
            </View>

            <View style={styles.deliveryInfo}>

              <Text style={styles.deliveryLabel}>
                PICKUP
              </Text>

              <Text style={styles.deliveryValue}>
                {pickupAt
                  ? new Date(
                      pickupAt,
                    ).toLocaleString(
                      'en-IN',
                      {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      },
                    )
                  : 'Not available'}
              </Text>

            </View>

          </View>


          <View style={styles.timelineLine} />


          <View style={styles.deliveryRow}>

            <View style={styles.deliveryCircle}>
              <Text style={styles.deliveryEmoji}>
                🚚
              </Text>
            </View>

            <View style={styles.deliveryInfo}>

              <Text style={styles.deliveryLabel}>
                EXPECTED DELIVERY
              </Text>

              <Text style={styles.deliveryValue}>
                {expectedDeliveryAt
                  ? new Date(
                      expectedDeliveryAt,
                    ).toLocaleString(
                      'en-IN',
                      {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      },
                    )
                  : 'Not available'}
              </Text>

            </View>

          </View>

        </Card>


        {/* ================================= */}
        {/* COINS */}
        {/* ================================= */}

        {(coinsUsed > 0 ||
          coinsEarned > 0) ? (

          <View style={styles.coinsCard}>

            <View style={styles.coinsIcon}>
              <Text style={styles.coinsEmoji}>
                🪙
              </Text>
            </View>

            <View style={styles.coinsInfo}>

              {coinsUsed > 0 ? (
                <Text style={styles.coinsText}>
                  {coinsUsed} coins used
                </Text>
              ) : null}

              {coinsEarned > 0 ? (
                <Text style={styles.coinsEarned}>
                  +{coinsEarned} coins earned
                </Text>
              ) : null}

            </View>

          </View>

        ) : null}


        {/* ================================= */}
        {/* THANK YOU */}
        {/* ================================= */}

        <View style={styles.thankYou}>

          <Text style={styles.thankYouIcon}>
            ♥
          </Text>

          <Text style={styles.thankYouTitle}>
            Thank you!
          </Text>

          <Text style={styles.thankYouText}>
            We appreciate your order.
          </Text>

        </View>


        {/* ================================= */}
        {/* FOOTER */}
        {/* ================================= */}

        <Text style={styles.footer}>
          This is a computer-generated invoice.
        </Text>

      </ScrollView>

    </Screen>
  );
}


const styles = StyleSheet.create({

  container: {
    paddingBottom: 40,
  },


  // ========================================
  // HEADER
  // ========================================

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },

  headerKicker: {
    color: '#7138F2',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  headerTitle: {
    marginTop: 3,
    fontSize: 30,
    fontWeight: '900',
    color: colors.ink,
  },

  invoiceIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: '#EDE5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  invoiceIconText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#7138F2',
  },


  // ========================================
  // INVOICE CARD
  // ========================================

  invoiceCard: {
    padding: spacing.lg,
    borderRadius: 20,
  },

  invoiceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  smallLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    color: colors.muted,
  },

  invoiceNumber: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: '900',
    color: colors.ink,
  },

  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F7EE',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
  },

  paidDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#278044',
    marginRight: 6,
  },

  paidText: {
    color: '#278044',
    fontSize: 9,
    fontWeight: '900',
  },

  divider: {
    height: 1,
    backgroundColor: '#EEEEF2',
    marginVertical: spacing.md,
  },

  infoGrid: {
    flexDirection: 'row',
  },

  infoItem: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.muted,
    letterSpacing: 0.7,
  },

  infoValue: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '800',
    color: colors.ink,
  },


  // ========================================
  // SECTION
  // ========================================

  sectionTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    color: colors.muted,
  },


  // ========================================
  // CUSTOMER
  // ========================================

  customerCard: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: 18,
  },

  customerAvatar: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#EDE5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  customerAvatarText: {
    fontSize: 19,
    fontWeight: '900',
    color: '#7138F2',
  },

  customerInfo: {
    flex: 1,
    marginLeft: 12,
  },

  customerName: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.ink,
  },

  customerDetail: {
    marginTop: 3,
    fontSize: 11,
    color: colors.muted,
  },

  customerAddress: {
    marginTop: 7,
    fontSize: 12,
    lineHeight: 18,
    color: colors.ink,
  },


  // ========================================
  // SERVICE
  // ========================================

  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 18,
  },

  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#E8F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  serviceIconText: {
    fontSize: 23,
  },

  serviceInfo: {
    marginLeft: 12,
  },

  serviceName: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.ink,
  },

  serviceType: {
    marginTop: 4,
    fontSize: 11,
    color: colors.muted,
  },


  // ========================================
  // ITEMS
  // ========================================

  itemsCard: {
    padding: spacing.md,
    borderRadius: 18,
  },

  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  tableHeaderText: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.muted,
  },

  itemColumn: {
    flex: 1.8,
  },

  qtyColumn: {
    flex: 0.6,
    textAlign: 'center',
  },

  priceColumn: {
    flex: 1,
    textAlign: 'right',
  },

  totalColumn: {
    flex: 1.1,
    textAlign: 'right',
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F4',
  },

  itemText: {
    fontSize: 11,
    color: colors.ink,
  },

  emptyItems: {
    paddingVertical: 15,
    textAlign: 'center',
    color: colors.muted,
    fontSize: 12,
  },


  // ========================================
  // SUMMARY
  // ========================================

  summaryCard: {
    padding: spacing.lg,
    borderRadius: 19,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 11,
  },

  summaryLabel: {
    fontSize: 12,
    color: colors.muted,
  },

  summaryValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.ink,
  },

  discountLabel: {
    fontSize: 12,
    color: '#278044',
  },

  discountValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#278044',
  },

  totalDivider: {
    height: 1,
    backgroundColor: '#E7E7EC',
    marginVertical: 6,
  },

  finalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  finalLabel: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.7,
    color: colors.ink,
  },

  finalSubtext: {
    marginTop: 3,
    fontSize: 10,
    color: colors.muted,
  },

  finalAmount: {
    fontSize: 24,
    fontWeight: '900',
    color: '#7138F2',
  },


  // ========================================
  // PAYMENT
  // ========================================

  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 18,
  },

  paymentIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#E8F8F1',
    alignItems: 'center',
    justifyContent: 'center',
  },

  paymentIconText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#278044',
  },

  paymentInfo: {
    flex: 1,
    marginLeft: 11,
  },

  paymentMethod: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.ink,
  },

  paymentSubtext: {
    marginTop: 3,
    fontSize: 10,
    color: colors.muted,
  },

  paidBadgeSmall: {
    backgroundColor: '#E6F7EE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },

  paidTextSmall: {
    fontSize: 9,
    fontWeight: '900',
    color: '#278044',
  },


  // ========================================
  // DELIVERY
  // ========================================

  deliveryCard: {
    padding: spacing.lg,
    borderRadius: 19,
  },

  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  deliveryCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#F0E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  deliveryEmoji: {
    fontSize: 18,
  },

  deliveryInfo: {
    marginLeft: 12,
  },

  deliveryLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.7,
    color: colors.muted,
  },

  deliveryValue: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '800',
    color: colors.ink,
  },

  timelineLine: {
    height: 18,
    width: 1,
    backgroundColor: '#D8D8E0',
    marginLeft: 20,
    marginVertical: 2,
  },


  // ========================================
  // COINS
  // ========================================

  coinsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 17,
    backgroundColor: '#FFF8DF',
  },

  coinsIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#FFE9A3',
    alignItems: 'center',
    justifyContent: 'center',
  },

  coinsEmoji: {
    fontSize: 21,
  },

  coinsInfo: {
    marginLeft: 11,
  },

  coinsText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#765900',
  },

  coinsEarned: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: '800',
    color: '#278044',
  },


  // ========================================
  // THANK YOU
  // ========================================

  thankYou: {
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingVertical: spacing.lg,
  },

  thankYouIcon: {
    fontSize: 22,
    color: '#7138F2',
  },

  thankYouTitle: {
    marginTop: 7,
    fontSize: 17,
    fontWeight: '900',
    color: colors.ink,
  },

  thankYouText: {
    marginTop: 4,
    fontSize: 11,
    color: colors.muted,
  },

  footer: {
    textAlign: 'center',
    fontSize: 9,
    color: '#A0A2AB',
    marginTop: 3,
  },

});