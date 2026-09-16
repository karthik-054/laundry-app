import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';

import {useState} from 'react';

import {Screen} from '../../components/Screen';

import {
  EmptyState,
  ErrorState,
  Loading,
} from '../../components/States';

import {
  colors,
  spacing,
} from '../../app/theme';

import {
  useWalletQuery,
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayMutation,
} from '../payments/paymentApi';

import {
  formatWhen,
  inr,
} from '../../utils/format';

import type {WalletTxn} from '../../types';


// ======================================================
// WALLET SCREEN
// ======================================================

export function WalletScreen() {

  // ====================================================
  // WALLET API
  // ====================================================

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useWalletQuery();


  // ====================================================
  // AMOUNT
  // ====================================================

  const [amount, setAmount] = useState('500');

  const [selectedAmount, setSelectedAmount] =
    useState<number | null>(500);


  // ====================================================
  // TRANSACTION FILTER
  // ====================================================

const [filter, setFilter] =
  useState<'All' | 'CREDIT' | 'DEBIT'>('All');


  // ====================================================
  // RAZORPAY
  // ====================================================

  const [
    createPay,
    {
      isLoading: creating,
    },
  ] = useCreateRazorpayOrderMutation();


  const [
    verify,
    {
      isLoading: verifying,
    },
  ] = useVerifyRazorpayMutation();


  // ====================================================
  // TRANSACTIONS
  // ====================================================

  const transactions =
    data?.transactions ?? [];


  // ====================================================
  // QUICK AMOUNT OPTIONS
  // ====================================================

  const amountOptions = [
    100,
    500,
    1000,
    2000,
  ];


  // ====================================================
  // SELECT AMOUNT
  // ====================================================

  const selectAmount = (value: number) => {

    setSelectedAmount(value);

    setAmount(String(value));
  };


  // ====================================================
  // CUSTOM AMOUNT
  // ====================================================

  const handleAmountChange = (text: string) => {

    const numericValue =
      text.replace(/[^0-9.]/g, '');

    setAmount(numericValue);

    setSelectedAmount(null);
  };


  // ====================================================
  // VALIDATE
  // ====================================================

  const validatePayment = () => {

    const n = Number(amount);


    if (!n) {

      Alert.alert(
        'Invalid Amount',
        'Please enter an amount to add.',
      );

      return false;
    }


    if (n < 10) {

      Alert.alert(
        'Invalid Amount',
        'Minimum wallet recharge is ₹10.',
      );

      return false;
    }


    if (n > 50000) {

      Alert.alert(
        'Invalid Amount',
        'Maximum wallet recharge is ₹50,000.',
      );

      return false;
    }


    return true;
  };


  // ====================================================
  // RAZORPAY PAYMENT
  // ====================================================

  const recharge = async () => {

    if (!validatePayment()) {
      return;
    }


    const n = Number(amount);


    try {

      // -----------------------------------------------
      // CREATE PAYMENT ORDER
      // -----------------------------------------------

      const order =
        await createPay({
          purpose: 'wallet',
          amount: n,
        }).unwrap();


      // -----------------------------------------------
      // VERIFY PAYMENT
      // -----------------------------------------------
      //
      // Current project uses mock payment ID.
      // Replace with actual Razorpay SDK response later.
      // -----------------------------------------------

      await verify({

        razorpayOrderId:
          order.razorpayOrderId,

        razorpayPaymentId:
          `pay_mock_${Date.now()}`,

      }).unwrap();


      // -----------------------------------------------
      // REFRESH WALLET
      // -----------------------------------------------

      await refetch();


      Alert.alert(
        'Payment Successful',
        `${inr(n)} has been added to your wallet.`,
      );

    } catch (e) {

      console.error(
        'Wallet recharge error:',
        e,
      );


      Alert.alert(
        'Recharge Failed',
        e instanceof Error
          ? e.message
          : 'Recharge failed.',
      );
    }
  };


  // ====================================================
  // TRANSACTION FILTER
  // ====================================================

const filteredTransactions =
  transactions.filter(
    (transaction: WalletTxn) => {

      if (filter === 'All') {
        return true;
      }

      return transaction.type === filter;
    },
  );


  // ====================================================
  // WALLET INFO
  // ====================================================

  const handleWalletInfo = () => {

    Alert.alert(
      'Wallet',
      'Your wallet can be used for faster and secure laundry payments.',
    );
  };


  // ====================================================
  // TRANSACTION PRESS
  // ====================================================

  const handleTransaction = (
    transaction: WalletTxn,
  ) => {

    Alert.alert(
      transaction.reason,

      `Transaction ID:\n${transaction.id}\n\nAmount: ${inr(
        transaction.amount,
      )}\n\nDate:\n${formatWhen(
        transaction.createdAt,
      )}`,
    );
  };


  // ====================================================
  // FILTER
  // ====================================================

const changeFilter = () => {

  if (filter === 'All') {

    setFilter('CREDIT');

  } else if (filter === 'CREDIT') {

    setFilter('DEBIT');

  } else {

    setFilter('All');

  }
};

  // ====================================================
  // BANNER
  // ====================================================

  const handleBanner = () => {

    setAmount('500');

    setSelectedAmount(500);

    Alert.alert(
      'Add Money',
      'Select an amount and continue with Razorpay.',
    );
  };


  // ====================================================
  // LOADING
  // ====================================================

  if (isLoading) {

    return (
      <Screen>
        <Loading />
      </Screen>
    );
  }


  // ====================================================
  // ERROR
  // ====================================================

  if (error) {

    return (
      <Screen>

        <ErrorState
          message="Wallet unavailable"
          onRetry={refetch}
        />

      </Screen>
    );
  }


  // ====================================================
  // UI
  // ====================================================

  return (
    <Screen>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* ==========================================
            HEADER
        ========================================== */}

        <View style={styles.header}>

          <Text style={styles.title}>
            Wallet
          </Text>

          <Text style={styles.subtitle}>
            Manage your balance and payments
          </Text>

        </View>


        {/* ==========================================
            BALANCE CARD
        ========================================== */}

        <TouchableOpacity
          style={styles.balanceCard}
          onPress={handleWalletInfo}
          activeOpacity={0.85}
        >

          <View style={styles.balanceContent}>

            <Text style={styles.balanceLabel}>
              Current Wallet Balance
            </Text>


            <Text style={styles.balance}>
              {inr(data?.balance ?? 0)}
            </Text>


            <View style={styles.infoRow}>

              <View style={styles.infoCircle}>

                <Text style={styles.infoText}>
                  i
                </Text>

              </View>


              <Text style={styles.balanceDescription}>
                Use your wallet for faster and
                secure payments
              </Text>

            </View>

          </View>


          {/* Wallet illustration */}

          <View style={styles.walletIllustration}>

            <Text style={styles.coin1}>
              ₹
            </Text>

            <Text style={styles.coin2}>
              ₹
            </Text>

            <View style={styles.walletShape}>

              <View style={styles.walletButton} />

            </View>

          </View>


          <Text style={styles.balanceArrow}>
            ›
          </Text>

        </TouchableOpacity>


        {/* ==========================================
            ADD MONEY
        ========================================== */}

        <View style={styles.addMoneyCard}>

          <Text style={styles.addMoneyTitle}>
            Add Money
          </Text>


          <Text style={styles.addMoneySubtitle}>
            Enter amount to add to your wallet
          </Text>


          {/* QUICK AMOUNTS */}

          <View style={styles.amountRow}>

            {amountOptions.map(value => (

              <TouchableOpacity
                key={value}
                style={[
                  styles.amountButton,

                  selectedAmount === value &&
                    styles.amountButtonActive,
                ]}
                onPress={() =>
                  selectAmount(value)
                }
              >

                <Text
                  style={[
                    styles.amountText,

                    selectedAmount === value &&
                      styles.amountTextActive,
                  ]}
                >
                  ₹{value}
                </Text>

              </TouchableOpacity>

            ))}

          </View>


          {/* CUSTOM AMOUNT */}

          <View style={styles.inputContainer}>

            <View style={styles.rupeeBox}>

              <Text style={styles.rupee}>
                ₹
              </Text>

            </View>


            <Text
              style={styles.amountInput}
            >
              {amount || 'Enter amount'}
            </Text>

          </View>


          {/* PAYMENT BUTTON */}

          <TouchableOpacity
            style={[
              styles.paymentButton,

              (creating || verifying) &&
                styles.paymentButtonDisabled,
            ]}
            onPress={recharge}
            disabled={creating || verifying}
            activeOpacity={0.8}
          >

            <Text style={styles.paymentText}>

              {creating || verifying
                ? 'Processing...'
                : 'Pay with Razorpay'}

            </Text>


            <Text style={styles.paymentArrow}>
              →
            </Text>

          </TouchableOpacity>

        </View>


        {/* ==========================================
            TRANSACTION HEADER
        ========================================== */}

        <View style={styles.transactionHeader}>

          <Text style={styles.transactionTitle}>
            Transaction History
          </Text>


          <TouchableOpacity
            style={styles.filterButton}
            onPress={changeFilter}
          >

            <Text style={styles.filterText}>
              {filter}
            </Text>


            <Text style={styles.filterArrow}>
              ˅
            </Text>

          </TouchableOpacity>

        </View>


        {/* ==========================================
            TRANSACTIONS
        ========================================== */}

        {filteredTransactions.length === 0 ? (

          <View style={styles.emptyContainer}>

            <View style={styles.emptyIcon}>

              <Text style={styles.emptyDocument}>
                ▤
              </Text>


              <View style={styles.clockCircle}>

                <Text style={styles.clock}>
                  L
                </Text>

              </View>

            </View>


            <Text style={styles.emptyTitle}>
              No movements
            </Text>


            <Text style={styles.emptyDescription}>
              Recharges, spends and refunds
              {'\n'}
              will appear here.
            </Text>

          </View>

        ) : (

          <View style={styles.transactionList}>

            {filteredTransactions.map(
              (transaction: WalletTxn) => (

                <TouchableOpacity
                  key={transaction.id}
                  style={styles.transactionItem}
                  onPress={() =>
                    handleTransaction(
                      transaction,
                    )
                  }
                  activeOpacity={0.8}
                >

                  {/* ICON */}

                  <View
                    style={[
                      styles.transactionIcon,

                      transaction.type ===
                        'CREDIT'
                        ? styles.creditIcon
                        : styles.debitIcon,
                    ]}
                  >

                    <Text
                      style={styles.transactionIconText}
                    >
                      {transaction.type ===
                      'CREDIT'
                        ? '↑'
                        : '↓'}
                    </Text>

                  </View>


                  {/* INFO */}

                  <View
                    style={
                      styles.transactionInfo
                    }
                  >

                    <Text
                      style={
                        styles.transactionName
                      }
                    >
                      {transaction.reason}
                    </Text>


                    <Text
                      style={
                        styles.transactionDate
                      }
                    >
                      {formatWhen(
                        transaction.createdAt,
                      )}
                    </Text>

                  </View>


                  {/* AMOUNT */}

                  <Text
                    style={[
                      styles.transactionAmount,

                      transaction.amount >= 0
                        ? styles.creditText
                        : styles.debitText,
                    ]}
                  >
                    {transaction.amount >= 0
                      ? '+'
                      : '-'}
                    {inr(
                      Math.abs(
                        transaction.amount,
                      ),
                    )}
                  </Text>

                </TouchableOpacity>

              ),
            )}

          </View>

        )}


        {/* ==========================================
            PROMOTIONAL BANNER
        ========================================== */}

        <TouchableOpacity
          style={styles.banner}
          onPress={handleBanner}
          activeOpacity={0.85}
        >

          <View style={styles.bannerContent}>

            <Text style={styles.bannerTitle}>
              Add money and enjoy
            </Text>

            <Text style={styles.bannerTitle}>
              faster checkouts!
            </Text>

            <Text style={styles.bannerSubtitle}>
              Simple. Secure. Hassle-free.
            </Text>

          </View>


          <View style={styles.bannerWallet}>

            <Text style={styles.bannerCoin}>
              ₹
            </Text>

            <View style={styles.smallWallet} />

          </View>


          <Text style={styles.bannerArrow}>
            ›
          </Text>

        </TouchableOpacity>

      </ScrollView>

    </Screen>
  );
}


// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 30,
  },


  // ====================================================
  // HEADER
  // ====================================================

  header: {
    marginBottom: 18,
  },

  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#101827',
  },

  subtitle: {
    fontSize: 13,
    color: '#78818D',
    marginTop: 3,
  },


  // ====================================================
  // BALANCE CARD
  // ====================================================

  balanceCard: {
    minHeight: 155,
    backgroundColor: '#E8F7F2',
    borderRadius: 18,
    padding: 18,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  balanceContent: {
    flex: 1,
    zIndex: 2,
  },

  balanceLabel: {
    fontSize: 13,
    color: '#66737A',
  },

  balance: {
    fontSize: 38,
    fontWeight: '900',
    color: '#078C83',
    marginTop: 5,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  infoCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#078C83',
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoText: {
    color: '#078C83',
    fontSize: 11,
    fontWeight: '900',
  },

  balanceDescription: {
    color: '#68757A',
    fontSize: 10,
    marginLeft: 6,
  },

  balanceArrow: {
    position: 'absolute',
    right: 13,
    top: 72,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 28,
    color: '#66737A',
    zIndex: 5,
  },


  // ====================================================
  // WALLET ILLUSTRATION
  // ====================================================

  walletIllustration: {
    position: 'absolute',
    right: 30,
    top: 8,
    width: 145,
    height: 140,
  },

  walletShape: {
    position: 'absolute',
    right: 5,
    top: 47,
    width: 100,
    height: 62,
    borderRadius: 14,
    backgroundColor: '#0D9A83',
    transform: [
      {
        rotate: '-8deg',
      },
    ],
  },

  walletButton: {
    position: 'absolute',
    right: 12,
    top: 25,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D5F2E9',
  },

  coin1: {
    position: 'absolute',
    right: 58,
    top: 7,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5BE35',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 20,
    fontWeight: '900',
    color: '#FFF4C7',
    zIndex: 3,
  },

  coin2: {
    position: 'absolute',
    right: 29,
    top: 22,
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#E5A923',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 19,
    fontWeight: '900',
    color: '#FFF3C0',
    zIndex: 2,
  },


  // ====================================================
  // ADD MONEY
  // ====================================================

  addMoneyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    marginBottom: 20,
  },

  addMoneyTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
  },

  addMoneySubtitle: {
    color: '#7D8793',
    fontSize: 13,
    marginTop: 2,
    marginBottom: 14,
  },


  // ====================================================
  // AMOUNT BUTTONS
  // ====================================================

  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  amountButton: {
    width: '23%',
    height: 43,
    borderRadius: 22,
    backgroundColor: '#F4F6F7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },

  amountButtonActive: {
    backgroundColor: '#E9F8F4',
    borderColor: '#078C83',
  },

  amountText: {
    color: '#333A43',
    fontSize: 13,
    fontWeight: '700',
  },

  amountTextActive: {
    color: '#078C83',
    fontWeight: '900',
  },


  // ====================================================
  // INPUT
  // ====================================================

  inputContainer: {
    height: 54,
    borderWidth: 1,
    borderColor: '#E2E6E8',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    overflow: 'hidden',
  },

  rupeeBox: {
    width: 46,
    height: '100%',
    backgroundColor: '#F4F6F7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  rupee: {
    color: '#27313B',
    fontSize: 18,
    fontWeight: '800',
  },

  amountInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 18,
    color: '#202832',
    fontWeight: '600',
  },


  // ====================================================
  // PAYMENT
  // ====================================================

  paymentButton: {
    height: 58,
    borderRadius: 14,
    backgroundColor: '#07978B',
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  paymentButtonDisabled: {
    opacity: 0.6,
  },

  paymentText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  paymentArrow: {
    color: '#FFFFFF',
    fontSize: 25,
    marginLeft: 12,
  },


  // ====================================================
  // TRANSACTION HEADER
  // ====================================================

  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  transactionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
  },

  filterButton: {
    minWidth: 83,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E1E5E7',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  filterText: {
    color: '#424A53',
    fontSize: 12,
    fontWeight: '700',
  },

  filterArrow: {
    fontSize: 17,
    color: '#707983',
    marginLeft: 7,
  },


  // ====================================================
  // EMPTY
  // ====================================================

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 245,
  },

  emptyIcon: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  emptyDocument: {
    fontSize: 57,
    color: '#D8E2E4',
  },

  clockCircle: {
    position: 'absolute',
    right: 7,
    bottom: 8,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#18A991',
    justifyContent: 'center',
    alignItems: 'center',
  },

  clock: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 17,
  },

  emptyTitle: {
    color: '#111827',
    fontSize: 19,
    fontWeight: '900',
    marginTop: 8,
  },

  emptyDescription: {
    color: '#858E98',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
  },


  // ====================================================
  // TRANSACTIONS
  // ====================================================

  transactionList: {
    marginBottom: 15,
  },

  transactionItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    padding: 13,
    marginBottom: 9,
    flexDirection: 'row',
    alignItems: 'center',
  },

  transactionIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },

  creditIcon: {
    backgroundColor: '#DDF7EC',
  },

  debitIcon: {
    backgroundColor: '#FFE4E4',
  },

  transactionIconText: {
    fontSize: 20,
    fontWeight: '900',
  },

  transactionInfo: {
    flex: 1,
    marginLeft: 10,
  },

  transactionName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#202833',
  },

  transactionDate: {
    fontSize: 9,
    color: '#8A929B',
    marginTop: 4,
  },

  transactionAmount: {
    fontSize: 14,
    fontWeight: '900',
  },

  creditText: {
    color: '#0A9A72',
  },

  debitText: {
    color: '#DD5555',
  },


  // ====================================================
  // BANNER
  // ====================================================

  banner: {
    height: 112,
    backgroundColor: '#DDF5EE',
    borderRadius: 17,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    marginTop: 5,
  },

  bannerContent: {
    flex: 1,
    zIndex: 2,
  },

  bannerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#14272A',
  },

  bannerSubtitle: {
    fontSize: 10,
    color: '#758486',
    marginTop: 5,
  },

  bannerWallet: {
    width: 100,
    height: 80,
    position: 'relative',
  },

  smallWallet: {
    position: 'absolute',
    width: 72,
    height: 45,
    backgroundColor: '#0D9A83',
    borderRadius: 10,
    right: 8,
    top: 24,
    transform: [
      {
        rotate: '-7deg',
      },
    ],
  },

  bannerCoin: {
    position: 'absolute',
    right: 43,
    top: 7,
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: '#F1BA30',
    color: '#FFF',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: '900',
    zIndex: 2,
  },

  bannerArrow: {
    fontSize: 28,
    color: '#657277',
  },

});