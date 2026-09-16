import 'react-native-gesture-handler'
import React, { useEffect } from 'react'
import { Image, KeyboardAvoidingView, Platform, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider } from 'react-redux'

import { store, useAppSelector } from './src/app/store'
import type {
  AdminStackParamList,
  AdminTabParamList,
  AuthStackParamList,
  CustomerStackParamList,
  CustomerTabParamList,
  DeliveryStackParamList,
  DeliveryTabParamList,
} from './src/app/navigation/types'
import { Screen } from './src/components/Screen'
import { LoginScreen } from './src/features/auth/LoginScreen'
import { RegisterScreen } from './src/features/auth/RegisterScreen'
import { CustomerDashboard } from './src/features/customer/HomeScreen'
import { OrderHistoryScreen } from './src/features/orders/OrderHistoryScreen'
import { WalletScreen } from './src/features/wallet/WalletScreen'
import { CoinsScreen } from './src/features/coins/CoinsScreen'
import { ProfileScreen } from './src/features/customer/ProfileScreen'
import { OnboardingScreen } from './src/features/customer/OnboardingScreen'
import { CreateOrderScreen } from './src/features/orders/CreateOrderScreen'
import { OrderDetailsScreen } from './src/features/orders/OrderDetailsScreen'
import { InvoiceScreen } from './src/features/orders/InvoiceScreen'
import { NotificationsScreen } from './src/features/notifications/NotificationsScreen'
import { SupportScreen } from './src/features/support/SupportScreen'
import { MembershipScreen } from './src/features/membership/MembershipScreen'
import { ServicesScreen } from './src/features/laundry/ServicesScreen'
import { AdminDashboardScreen } from './src/features/admin/AdminDashboardScreen'
import { AdminOrdersScreen } from './src/features/admin/AdminOrdersScreen'
import { AdminCustomersScreen } from './src/features/admin/AdminCustomersScreen'
import { AdminDeliveryScreen } from './src/features/admin/AdminDeliveryScreen'
import { AdminMoreScreen } from './src/features/admin/AdminMoreScreen'
import { DeliveryPickupsScreen } from './src/features/delivery/DeliveryPickupsScreen'
import { DeliveryHistoryScreen } from './src/features/delivery/DeliveryHistoryScreen'
import { DeliveryProfileScreen } from './src/features/delivery/DeliveryProfileScreen'
import { WaitingForApproval } from './src/features/customer/WaitingForApproval'
import { ServiceRequestRejectedScreen } from './src/features/customer/ServiceRequestRejectedScreen'
import { useGetMyServiceRequestQuery } from './src/features/customer/customerApi'
import { Loading } from './src/components/States'
import { useAppDispatch } from './src/app/store'
import { markHydrated, setSession } from './src/features/auth/authSlice'
import { tokenStorage } from './src/services/tokenStorage'
import { colors } from './src/app/theme'
import { DeliveryOrdersScreen } from './src/features/delivery/DeliveryOrdersScreen'
import { DeliveryDashboardScreen } from './src/features/delivery/DeliveryDashboardScreen'
import { AdminReviewsScreen } from './src/features/admin/AdminReviewsScreen'
import { AdminDeliveryHistoryScreen } from './src/features/admin/AdminDeliveryHistoryScreen'

const AuthStack = createNativeStackNavigator<AuthStackParamList>()
const CustomerTabs = createBottomTabNavigator<CustomerTabParamList>()
const CustomerStack = createNativeStackNavigator<CustomerStackParamList>()
const AdminTabs = createBottomTabNavigator<AdminTabParamList>()
const AdminStack = createNativeStackNavigator<AdminStackParamList>()
const DeliveryTabs = createBottomTabNavigator<DeliveryTabParamList>()
const DeliveryStack = createNativeStackNavigator<DeliveryStackParamList>()

function PlaceholderScreen ({ title }: { title: string }) {
  return (
    <Screen>
      <Text>{title}</Text>
    </Screen>
  )
}

function CustomerTabsNavigator () {
  return (
    <CustomerTabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.success,
        tabBarInactiveTintColor: '#858B9A',

        tabBarIcon: ({ color, size, focused }) => {
          const icons: Record<string, any> = {
            Home: require('./src/assets/home.png'),
            Orders: require('./src/assets/orders.png'),
            Wallet: require('./src/assets/wallet.png'),
            Coins: require('./src/assets/coins.png'),
            Profile: require('./src/assets/profile.png'),
          }

          return (
            <Image
              source={icons[route.name]}
              style={{
                width: size,
                height: size,
                tintColor: focused ? colors.success : '#858B9A',
              }}
              resizeMode='contain'
            />
          )
        },
      })}
    >
      <CustomerTabs.Screen name='Home' component={CustomerDashboard} />

      <CustomerTabs.Screen name='Orders' component={OrderHistoryScreen} />

      <CustomerTabs.Screen name='Wallet' component={WalletScreen} />

      <CustomerTabs.Screen name='Coins' component={CoinsScreen} />

      <CustomerTabs.Screen name='Profile' component={ProfileScreen} />
    </CustomerTabs.Navigator>
  )
}

function CustomerStackNavigator ({
  initialRouteName = 'Tabs',
}: {
  initialRouteName?: keyof CustomerStackParamList
}) {
  return (
    <CustomerStack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
      }}
    >
      <CustomerStack.Screen
        name='Tabs'
        component={CustomerTabsNavigator}
        options={{ headerShown: false }}
      />
      <CustomerStack.Screen name='Onboarding' component={OnboardingScreen} />
      <CustomerStack.Screen
        name='WaitingForApproval'
        component={WaitingForApproval}
      />
      <CustomerStack.Screen
        name='ServiceRequestRejected'
        component={ServiceRequestRejectedScreen}
      />
      <CustomerStack.Screen name='CreateOrder' component={CreateOrderScreen} />
      <CustomerStack.Screen
        name='OrderDetails'
        component={OrderDetailsScreen}
      />
      <CustomerStack.Screen name='Invoice' component={InvoiceScreen} />
      <CustomerStack.Screen
        name='Notifications'
        component={NotificationsScreen}
      />
      <CustomerStack.Screen name='Support' component={SupportScreen} />
      <CustomerStack.Screen name='Membership' component={MembershipScreen} />
      <CustomerStack.Screen name='Services' component={ServicesScreen} />
      <CustomerStack.Screen
        name='Wallet'
        component={WalletScreen}
        options={{ headerShown: true }}
      />
      <CustomerStack.Screen
        name='Coins'
        component={CoinsScreen}
        options={{ headerShown: true }}
      />
    </CustomerStack.Navigator>
  )
}

function AdminTabsNavigator () {
  return (
    <AdminTabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.success,
        tabBarInactiveTintColor: '#858B9A',

        tabBarIcon: ({ color, size, focused }) => {
          const icons: Record<string, any> = {
            Dashboard: require('./src/assets/admindash.png'),
            Orders: require('./src/assets/orders.png'),
            Customers: require('./src/assets/people.png'),
            Delivery: require('./src/assets/truckdel.png'),
            More: require('./src/assets/more.png'),
          }

          return (
            <Image
              source={icons[route.name]}
              style={{
                width: size,
                height: size,
                resizeMode: 'contain',
                tintColor: focused ? colors.success : '#858B9A',
              }}
            />
          )
        },
      })}
    >
      <AdminTabs.Screen name='Dashboard' component={AdminDashboardScreen} />

      <AdminTabs.Screen name='Orders' component={AdminOrdersScreen} />

      <AdminTabs.Screen name='Customers' component={AdminCustomersScreen} />

      <AdminTabs.Screen name='Delivery' component={AdminDeliveryScreen} />

      <AdminTabs.Screen name='More' component={AdminMoreScreen} />
    </AdminTabs.Navigator>
  )
}

function AdminStackNavigator () {
  return (
    <AdminStack.Navigator
      initialRouteName='Tabs'
      screenOptions={{
        headerShown: false,
      }}
    >
      <AdminStack.Screen
        name='Tabs'
        component={AdminTabsNavigator}
        options={{ headerShown: false }}
      />
      <AdminStack.Screen name='OrderDetails' component={OrderDetailsScreen} />
      <AdminStack.Screen
        name='Services'
        children={() => <PlaceholderScreen title='Services' />}
      />
      <AdminStack.Screen name='Adminreviews' component={AdminReviewsScreen} />
      <AdminStack.Screen
        name='AdminDeliveryHistory'
        component={AdminDeliveryHistoryScreen}
      />
      <AdminStack.Screen
        name='Payments'
        children={() => <PlaceholderScreen title='Payments' />}
      />
      <AdminStack.Screen
        name='Reports'
        children={() => <PlaceholderScreen title='Reports' />}
      />
      <AdminStack.Screen
        name='Settings'
        children={() => <PlaceholderScreen title='Settings' />}
      />
    </AdminStack.Navigator>
  )
}

function DeliveryTabsNavigator () {
  return (
    <DeliveryTabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,

        tabBarActiveTintColor: colors.success,
        tabBarInactiveTintColor: '#858B9A',

        tabBarIcon: ({ color, size, focused }) => {
          const icons: Record<string, any> = {
            Dashboard: require('./src/assets/riderdash.png'),
            Pickups: require('./src/assets/pickup.png'),
            Deliveries: require('./src/assets/delorder.png'),
            History: require('./src/assets/delhis.png'),
            Profile: require('./src/assets/rider.png'),
          }

          return (
            <Image
              source={icons[route.name]}
              style={{
                width: size,
                height: size,
                resizeMode: 'contain',
                tintColor: focused ? colors.success : '#858B9A',
              }}
            />
          )
        },
      })}
    >
      <DeliveryTabs.Screen
        name='Dashboard'
        component={DeliveryDashboardScreen}
      />

      <DeliveryTabs.Screen name='Pickups' component={DeliveryPickupsScreen} />

      <DeliveryTabs.Screen name='Deliveries' component={DeliveryOrdersScreen} />

      <DeliveryTabs.Screen name='History' component={DeliveryHistoryScreen} />

      <DeliveryTabs.Screen name='Profile' component={DeliveryProfileScreen} />
    </DeliveryTabs.Navigator>
  )
}

function DeliveryStackNavigator () {
  return (
    <DeliveryStack.Navigator
      initialRouteName='Tabs'
      screenOptions={{
        headerShown: false,
      }}
    >
      <DeliveryStack.Screen
        name='Tabs'
        component={DeliveryTabsNavigator}
        options={{ headerShown: false }}
      />
      <DeliveryStack.Screen
        name='OrderDetails'
        component={OrderDetailsScreen}
      />
    </DeliveryStack.Navigator>
  )
}

function AuthNavigator () {
  return (
    <AuthStack.Navigator
      initialRouteName='Login'
      screenOptions={{ headerShown: false }}
    >
      <AuthStack.Screen name='Login' component={LoginScreen} />
      <AuthStack.Screen name='Register' component={RegisterScreen} />
    </AuthStack.Navigator>
  )
}

function CustomerFlow () {
  const { data, isLoading } = useGetMyServiceRequestQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  })

  if (isLoading)
    return (
      <Screen>
        <Loading />
      </Screen>
    )

  const status = data?.request?.status
  const initialRouteName =
    status === 'approved'
      ? 'Tabs'
      : status === 'pending'
      ? 'WaitingForApproval'
      : status === 'rejected'
      ? 'ServiceRequestRejected'
      : 'Onboarding'

  return (
    <CustomerStackNavigator
      key={initialRouteName}
      initialRouteName={initialRouteName}
    />
  )
}

function AppContent () {
  const token = useAppSelector(state => state.auth.token)
  const role = useAppSelector(state => state.auth.role)
  const hydrated = useAppSelector(state => state.auth.hydrated)

  if (!hydrated) {
    return (
      <Screen>
        <Loading />
      </Screen>
    )
  }

  if (!token) {
    return <AuthNavigator />
  }

  if (role === 'admin') {
    return <AdminStackNavigator />
  }

  if (role === 'delivery') {
    return <DeliveryStackNavigator />
  }

  if (role === 'customer') {
    return <CustomerFlow />
  }

  return <AuthNavigator />
}

function AppBootstrap () {
  const dispatch = useAppDispatch()

  useEffect(() => {
    void tokenStorage.getSession().then(session => {
      if (session?.token && session.user) {
        dispatch(setSession({ ...session, token: session.token }))
      } else {
        dispatch(markHydrated())
      }
    })
  }, [dispatch])

  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <NavigationContainer>
          <AppContent />
        </NavigationContainer>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  )
}

export default function App () {
  return (
    <Provider store={store}>
      <AppBootstrap />
    </Provider>
  )
}
