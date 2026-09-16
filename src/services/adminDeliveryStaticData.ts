import type { AdminDashboard, DeliveryDashboard, Order, SessionPayload, User } from '../types';

const adminUser: User = {
  id: 'admin_static_1',
  email: 'admin@linenlane.app',
  role: 'admin',
  name: 'LinenLane Studio',
  phone: '+91 98765 00001',
  isActive: true,
  busy: false,
  createdAt: '2026-01-01T09:00:00.000Z',
};

const riderOne: User = {
  id: 'rider_static_1',
  email: 'arjun@linenlane.app',
  role: 'delivery',
  name: 'Arjun Mehta',
  phone: '+91 98765 00002',
  isActive: true,
  busy: true,
  createdAt: '2026-01-05T09:00:00.000Z',
};

const riderTwo: User = {
  id: 'rider_static_2',
  email: 'neha@linenlane.app',
  role: 'delivery',
  name: 'Neha Kapoor',
  phone: '+91 98765 00003',
  isActive: true,
  busy: false,
  createdAt: '2026-01-08T09:00:00.000Z',
};

export const adminStaticDashboard: AdminDashboard = {
  todayOrders: 18,
  pendingApprovals: 3,
  pickupPending: 7,
  processing: 12,
  ready: 6,
  outForDelivery: 8,
  delivered: 31,
  todayRevenue: 18450,
  codPending: 4,
  customers: 248,
  deliveryUsers: 12,
  paymentSummary: { paid: 24, pending: 4, cod: 8 },
};

export const deliveryStaticDashboard: DeliveryDashboard = {
  pickupsToday: 12,
  deliveriesToday: 8,
  completed: 6,
  pending: 7,
  codCollection: 3240,
};

export const adminStaticCustomers: SessionPayload[] = [
  {
    token: 'static-token-customer',
    user: {
      id: 'customer_static_1',
      email: 'customer@linenlane.app',
      role: 'customer',
      name: 'Maya Sharma',
      phone: '+91 98765 43210',
      isActive: true,
      busy: false,
      createdAt: '2026-01-12T09:00:00.000Z',
    },
    walletBalance: 1240,
    coinBalance: 285,
  },
  {
    token: 'static-token-customer-2',
    user: {
      id: 'customer_static_2',
      email: 'riya@example.com',
      role: 'customer',
      name: 'Riya Kapoor',
      phone: '+91 98765 43211',
      isActive: true,
      busy: false,
      createdAt: '2026-02-02T09:00:00.000Z',
    },
    walletBalance: 560,
    coinBalance: 95,
  },
];

export const deliveryStaticUsers: User[] = [riderOne, riderTwo];

export const adminStaticReports: Record<string, unknown> = {
  revenue: 184500,
  orders: 128,
  topService: 'Wash and Fold',
  repeatCustomers: 86,
};

export function adminDeliveryMutationResponse(url: string): unknown {
  if (url.includes('/delivery-users')) return riderTwo;
  if (url.includes('/customers/')) return adminStaticCustomers[0];
  if (url.includes('/orders/')) return { id: 'order_static_101', status: 'PROCESSING' } as Partial<Order>;
  return { ok: true };
}

export { adminUser };
