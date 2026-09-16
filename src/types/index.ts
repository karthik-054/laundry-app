export type Role = 'customer' | 'admin' | 'delivery';

export type ApprovalStatus = 'incomplete' | 'pending' | 'approved' | 'rejected';

export type OrderStatus =
  | 'ORDER_CREATED'
  | 'ADMIN_CONFIRMED'
  | 'PICKUP_ASSIGNED'
  | 'OUT_FOR_PICKUP'
  | 'PICKED_UP'
  | 'PROCESSING'
  | 'READY_FOR_DELIVERY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'COD';

export type PaymentMethod = 'razorpay' | 'wallet' | 'cod' | 'wallet_razorpay';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;

  role: Role;

  isActive?: boolean;
  busy?: boolean;
  createdAt?: string;
}

export interface CustomerProfile {
  userId: string;
  address: string;
  landmark: string;
  city: string;
  pincode: string;
  approvalStatus: ApprovalStatus;
  rejectionReason?: string;
  referralCode: string;
  referredByUserId?: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  priceMonthly: number;
  discountPercent: number;
  bonusCoins: number;
  priorityDelivery: boolean;
  isActive: boolean;
}

export interface SessionPayload {
  token?: string;
  user: User;
  profile?: CustomerProfile;
  walletBalance?: number;
  coinBalance?: number;
  membership?: {
    planId: string;
    expiresAt: string;
    plan?: MembershipPlan;
  } | null;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  processingHoursNormal: number;
  processingHoursQuick: number;
  isActive: boolean;
  category?: 'basic' | 'premium'
  isPopular?: boolean
}

export interface DressType {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
}

export interface ServicePrice {
  serviceId: string;
  dressTypeId: string;
  deliveryPreference: 'normal' | 'quick';
  unitPrice: number;
}

export interface OrderItem {
  dressTypeId: string;
  dressName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  serviceId: string;
  serviceName: string;
  items: OrderItem[];
  pickupAt: string;
  deliveryPreference: 'normal' | 'quick';
  expectedDeliveryAt: string;
  subtotal: number;
  serviceCharge: number;
  quickDeliveryCharge: number;
  membershipDiscount: number;
  coinDiscount: number;
  coinsUsed: number;
  coinsEarned: number;
  finalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  walletUsed: number;
  razorpayAmount: number;
  status: OrderStatus;
  pickupDeliveryUserId?: string;
  dropDeliveryUserId?: string;
  createdAt: string;
  updatedAt: string;
  customer?: User | null;
  profile?: CustomerProfile;
  pickupRider?: User | null;
  dropRider?: User | null;
}

export interface Quote {
  items: OrderItem[];
  subtotal: number;
  serviceCharge: number;
  quickDeliveryCharge: number;
  membershipDiscount: number;
  coinDiscount: number;
  coinsUsed: number;
  coinsEarned: number;
  finalAmount: number;
  expectedDeliveryAt: string;
}


export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface WalletTxn {
  id: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  reason: string;
  createdAt: string;
}

export interface CoinTxn {
  id: string;
  amount: number;
  type: string;
  reason: string;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  method: string;
  status: PaymentStatus;
  orderId?: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  orderId?: string;
  category: 'order' | 'payment' | 'wallet' | 'general';
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  replies: { authorId: string; body: string; createdAt: string }[];
  createdAt: string;
}

export interface Review {
  id: string;
  orderId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export interface AdminDashboard {
  todayOrders: number;
  pendingApprovals: number;
  pickupPending: number;
  processing: number;
  ready: number;
  outForDelivery: number;
  delivered: number;
  todayRevenue: number;
  codPending: number;
  customers: number;
  deliveryUsers: number;
  paymentSummary: Record<string, number>;
}

export interface DeliveryDashboard {
  pickupsToday: number;
  deliveriesToday: number;
  completed: number;
  pending: number;
  codCollection: number;
}

export interface AppSettings {
  businessName: string;
  coinValueInr: number;
  maxRedemptionPercent: number;
  minOrderAmountForCoins: number;
  coinsPerHundredInr: number;
  quickDeliveryCharge: number;
  serviceCharge: number;
}
