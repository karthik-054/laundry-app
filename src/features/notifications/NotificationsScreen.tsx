import React from 'react'

import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { Screen } from '../../components/Screen'
import { Card } from '../../components/Card'
import {
  EmptyState,
  Loading,
} from '../../components/States'

import {
  colors,
  spacing,
} from '../../app/theme'

import {
  useNotificationsQuery,
  useReadNotificationMutation,
} from '../admin/adminApi'

import {
  formatWhen,
} from '../../utils/format'

export function NotificationsScreen() {
const {
  data = [],
  isLoading,
  isFetching,
  refetch,
} = useNotificationsQuery(undefined, {
  pollingInterval: 10000,
});

  const [
    readNotification,
  ] = useReadNotificationMutation()

  // ==========================================
  // LOADING
  // ==========================================

  if (isLoading) {
    return (
      <Screen>
        <Loading />
      </Screen>
    )
  }

  // ==========================================
  // ICON
  // ==========================================

  const getNotificationIcon = (
    type?: string,
  ) => {
    switch (type) {
      case 'CUSTOMER':
        return '👤'

      case 'ORDER':
        return '📦'

      case 'PAYMENT':
        return '💳'

      case 'DELIVERY':
        return '🚚'

      case 'WALLET':
        return '💰'

      case 'COIN':
        return '🪙'

      case 'REVIEW':
        return '⭐'

      default:
        return '🔔'
    }
  }

  // ==========================================
  // MARK AS READ
  // ==========================================

  const handleNotificationPress = async (
    notificationId?: string,
    isRead?: boolean,
  ) => {
    if (!notificationId || isRead) {
      return
    }

    try {
      await readNotification(
        notificationId,
      ).unwrap()

      await refetch()
    } catch (error) {
      console.error(
        'Read notification error:',
        error,
      )
    }
  }

  // ==========================================
  // EMPTY
  // ==========================================

  if (data.length === 0) {
    return (
      <Screen>
        <EmptyState
          title="Quiet for now"
          body="Order and delivery updates will appear here."
        />
      </Screen>
    )
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <Screen scroll={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}

        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={() => {
              void refetch()
            }}
          />
        }

        contentContainerStyle={
          styles.container
        }
      >
        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <Text style={styles.title}>
          Notifications
        </Text>

        <Text style={styles.subtitle}>
          Stay updated with your orders and deliveries
        </Text>

        {/* ================================= */}
        {/* NOTIFICATIONS */}
        {/* ================================= */}

        {data.map(
          notification => {
            const notificationId =
              notification._id

            return (
              <Card
                key={
                  notificationId
                }

                style={
                  notification.read
                    ? styles.notificationCard
                    : styles.unreadNotificationCard
                }

                onPress={() => {
                  void handleNotificationPress(
                    notificationId,
                    notification.read,
                  )
                }}
              >
                <View
                  style={
                    styles.topRow
                  }
                >
                  {/* ICON */}

                  <View
                    style={[
                      styles.icon,
                      notification.read
                        ? styles.readIcon
                        : styles.unreadIcon,
                    ]}
                  >
                    <Text
                      style={
                        styles.iconText
                      }
                    >
                      {getNotificationIcon(
                        notification.type,
                      )}
                    </Text>
                  </View>

                  {/* CONTENT */}

                  <View
                    style={
                      styles.content
                    }
                  >
                    {/* TITLE */}

                    <View
                      style={
                        styles.titleRow
                      }
                    >
                      <Text
                        style={[
                          styles.notificationTitle,
                          !notification.read &&
                            styles.unreadTitle,
                        ]}
                      >
                        {
                          notification.title
                        }
                      </Text>

                      {!notification.read ? (
                        <View
                          style={
                            styles.dot
                          }
                        />
                      ) : null}
                    </View>

                    {/* BODY */}

                    <Text
                      style={
                        styles.body
                      }
                    >
                      {
                        notification.body
                      }
                    </Text>

                    {/* TIME */}

                    <Text
                      style={
                        styles.time
                      }
                    >
                      {formatWhen(
                        notification.createdAt,
                      )}
                    </Text>
                  </View>
                </View>
              </Card>
            )
          },
        )}
      </ScrollView>
    </Screen>
  )
}

const styles =
  StyleSheet.create({
    container: {
      paddingBottom: 30,
      paddingHorizontal:10
    },

    title: {
      fontSize: 30,
      fontWeight: '900',
      color: colors.ink,
    },

    subtitle: {
      marginTop: 5,
      marginBottom:
        spacing.lg,
      color: colors.muted,
      fontSize: 13,
    },

    notificationCard: {
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.line,
    },

    unreadNotificationCard: {
      marginBottom: 10,
      borderWidth: 1,
      borderColor:
        colors.tealDark,
    },

    topRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },

    icon: {
      width: 46,
      height: 46,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },

    unreadIcon: {
      backgroundColor:
        '#E6F7F3',
    },

    readIcon: {
      backgroundColor:
        colors.cream,
    },

    iconText: {
      fontSize: 21,
    },

    content: {
      flex: 1,
    },

    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    notificationTitle: {
      flex: 1,
      fontSize: 15,
      fontWeight: '700',
      color: colors.ink,
    },

    unreadTitle: {
      fontWeight: '900',
    },

    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor:
        colors.tealDark,
      marginLeft: 8,
    },

    body: {
      marginTop: 5,
      fontSize: 13,
      lineHeight: 19,
      color: colors.muted,
    },

    time: {
      marginTop: 8,
      fontSize: 11,
      color: colors.muted,
    },
  })