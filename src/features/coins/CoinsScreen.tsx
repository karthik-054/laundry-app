import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import { Screen } from '../../components/Screen';
import { EmptyState, ErrorState, Loading } from '../../components/States';

import { colors, spacing } from '../../app/theme';

import { useCoinsQuery } from '../payments/paymentApi';

import { formatWhen } from '../../utils/format';

export function CoinsScreen() {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useCoinsQuery();

  const transactions = data?.transactions ?? [];

  if (isLoading) {
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <ErrorState
          message="Coins unavailable"
          onRetry={refetch}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>LOYALTY</Text>

            <Text style={styles.title}>
              My Coins
            </Text>

            <Text style={styles.subtitle}>
              Earn coins and enjoy more rewards
            </Text>
          </View>

          <View style={styles.headerCoin}>
            <Text style={styles.headerCoinText}>🪙</Text>
          </View>
        </View>

        {/* Total Coins Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceTop}>
            <View>
              <Text style={styles.balanceLabel}>
                AVAILABLE COINS
              </Text>

              <View style={styles.balanceRow}>
                <Text style={styles.balanceAmount}>
                  {data?.balance ?? 0}
                </Text>

                <Text style={styles.balanceCoin}>
                  🪙
                </Text>
              </View>

              <Text style={styles.balanceDescription}>
                Use your coins on future orders
              </Text>
            </View>

            <View style={styles.coinIllustration}>
              <Text style={styles.bigCoin}>🪙</Text>
            </View>
          </View>

          <View style={styles.balanceDivider} />

          <View style={styles.balanceBottom}>
            <View>
              <Text style={styles.balanceBottomLabel}>
                COINS VALUE
              </Text>

              <Text style={styles.balanceBottomValue}>
                {data?.balance ?? 0} coins
              </Text>
            </View>

            <View style={styles.balanceBadge}>
              <Text style={styles.balanceBadgeText}>
                AVAILABLE
              </Text>
            </View>
          </View>
        </View>

        {/* Statistics */}
        <Text style={styles.sectionTitle}>
          Coin Summary
        </Text>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardLeft]}>
            <View style={styles.statIcon}>
              <Text style={styles.statIconText}>↗</Text>
            </View>

            <Text style={styles.statLabel}>
              EARNED
            </Text>

            <Text style={styles.earnedValue}>
              +{data?.earned ?? 0}
            </Text>

            <Text style={styles.statDescription}>
              Total earned
            </Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Text style={styles.statIconText}>↘</Text>
            </View>

            <Text style={styles.statLabel}>
              REDEEMED
            </Text>

            <Text style={styles.redeemedValue}>
              -{data?.redeemed ?? 0}
            </Text>

            <Text style={styles.statDescription}>
              Total used
            </Text>
          </View>
        </View>

        {/* Coin History Header */}
        <View style={styles.historyHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Coin History
            </Text>

            <Text style={styles.historySubtitle}>
              Your recent coin activity
            </Text>
          </View>

          <View style={styles.historyCount}>
            <Text style={styles.historyCountText}>
              {transactions.length}
            </Text>
          </View>
        </View>

        {/* Coin History */}
        {transactions.length === 0 ? (
          <View style={styles.emptyWrapper}>
            <EmptyState
              title="No coin activity"
              body="Coins earned and redeemed will appear here."
            />
          </View>
        ) : (
          <View style={styles.historyList}>
            {transactions.map(transaction => {
              const isEarned = transaction.amount >= 0;

              return (
                <View
                  key={transaction.id}
                  style={styles.transactionCard}
                >
                  <View
                    style={[
                      styles.transactionIcon,
                      isEarned
                        ? styles.transactionIconEarned
                        : styles.transactionIconRedeemed,
                    ]}
                  >
                    <Text style={styles.transactionIconText}>
                      {isEarned ? '↗' : '↘'}
                    </Text>
                  </View>

                  <View style={styles.transactionInfo}>
                    <Text
                      style={styles.transactionReason}
                      numberOfLines={1}
                    >
                      {transaction.reason}
                    </Text>

                    <Text style={styles.transactionMeta}>
                      {transaction.type}
                      {' · '}
                      {formatWhen(transaction.createdAt)}
                    </Text>
                  </View>

                  <View style={styles.transactionAmountContainer}>
                    <Text
                      style={[
                        styles.transactionAmount,
                        isEarned
                          ? styles.earnedValue
                          : styles.redeemedValue,
                      ]}
                    >
                      {isEarned ? '+' : ''}
                      {transaction.amount}
                    </Text>

                    <Text style={styles.coinSmall}>
                      coins
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Earn More Banner */}
        <View style={styles.earnBanner}>
          <View style={styles.earnBannerIcon}>
            <Text style={styles.earnBannerCoin}>
              🪙
            </Text>
          </View>

          <View style={styles.earnBannerContent}>
            <Text style={styles.earnBannerTitle}>
              Earn more coins
            </Text>

            <Text style={styles.earnBannerText}>
              Place orders and complete services to
              earn more loyalty coins.
            </Text>
          </View>

          {/* UI only — no new functionality added */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.earnButton}
          >
            <Text style={styles.earnButtonText}>
              →
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>
            💡
          </Text>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              How your coins work
            </Text>

            <Text style={styles.infoText}>
              Coins earned and redeemed from your
              orders are automatically reflected in
              your balance and history.
            </Text>
          </View>
        </View>

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },

  kicker: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: colors.primary,
    marginBottom: 4,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: colors.muted,
  },

  headerCoin: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF4D6',
  },

  headerCoinText: {
    fontSize: 27,
  },

  balanceCard: {
    borderRadius: 24,
    padding: spacing.lg,
    backgroundColor: '#FFF7DF',
    marginBottom: spacing.lg,
  },

  balanceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  balanceLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: colors.muted,
    marginBottom: 8,
  },

  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  balanceAmount: {
    fontSize: 42,
    fontWeight: '900',
    color: colors.text,
  },

  balanceCoin: {
    fontSize: 28,
    marginLeft: 8,
  },

  balanceDescription: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 4,
  },

  coinIllustration: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE9A8',
  },

  bigCoin: {
    fontSize: 48,
  },

  balanceDivider: {
    height: 1,
    backgroundColor: '#EAD9A3',
    marginVertical: spacing.md,
  },

  balanceBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  balanceBottomLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.muted,
    letterSpacing: 1,
  },

  balanceBottomValue: {
    marginTop: 3,
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },

  balanceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#E7F7EC',
  },

  balanceBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#278044',
    letterSpacing: 0.8,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },

  statsRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },

  statCard: {
    flex: 1,
    borderRadius: 18,
    padding: spacing.md,
    backgroundColor: colors.card,
  },

  statCardLeft: {
    marginRight: spacing.sm,
  },

  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F5F7',
    marginBottom: 10,
  },

  statIconText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },

  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: colors.muted,
  },

  earnedValue: {
    color: '#278044',
  },

  redeemedValue: {
    color: '#C54B4B',
  },

  statDescription: {
    marginTop: 3,
    fontSize: 12,
    color: colors.muted,
  },

  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },

  historySubtitle: {
    fontSize: 13,
    color: colors.muted,
  },

  historyCount: {
    minWidth: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F2F4',
  },

  historyCountText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },

  historyList: {
    marginBottom: spacing.lg,
  },

  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 18,
    backgroundColor: colors.card,
    marginBottom: spacing.sm,
  },

  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  transactionIconEarned: {
    backgroundColor: '#E7F7EC',
  },

  transactionIconRedeemed: {
    backgroundColor: '#FDECEC',
  },

  transactionIconText: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
  },

  transactionInfo: {
    flex: 1,
    minWidth: 0,
  },

  transactionReason: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },

  transactionMeta: {
    marginTop: 4,
    fontSize: 12,
    color: colors.muted,
  },

  transactionAmountContainer: {
    alignItems: 'flex-end',
    marginLeft: spacing.sm,
  },

  transactionAmount: {
    fontSize: 17,
    fontWeight: '900',
  },

  coinSmall: {
    marginTop: 2,
    fontSize: 10,
    color: colors.muted,
  },

  emptyWrapper: {
    marginBottom: spacing.lg,
  },

  earnBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 20,
    backgroundColor: '#F3F0FF',
    marginBottom: spacing.md,
  },

  earnBannerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E4DCFF',
    marginRight: spacing.md,
  },

  earnBannerCoin: {
    fontSize: 28,
  },

  earnBannerContent: {
    flex: 1,
  },

  earnBannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },

  earnBannerText: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 17,
    color: colors.muted,
  },

  earnButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
  },

  earnButtonText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  infoCard: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: 18,
    backgroundColor: '#F7F7F8',
  },

  infoIcon: {
    fontSize: 23,
    marginRight: spacing.sm,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },

  infoText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.muted,
  },
});