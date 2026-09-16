export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type CustomerTabParamList = {
  Home: undefined;
  Orders: undefined;
  Wallet: undefined;
  Coins: undefined;
  Profile: undefined;
};

export type CustomerStackParamList = {
  Tabs: undefined;
  Onboarding: undefined;
  WaitingForApproval: undefined;
  ServiceRequestRejected: undefined;
 CreateOrder: {
  serviceId?: string;
};
  OrderDetails: { orderId: string };
  Invoice: { orderId: string };
  Notifications: undefined;
  Support: undefined;
  Membership: undefined;
  Services: {
  filter?: 'basic' | 'popular';
};
  Wallet: undefined;
  Coins: undefined;
  Orders:undefined;

};

export type Service = {
  id: string;
  _id?: string;

  name: string;

  category: 'basic' | 'premium';

  isPopular: boolean;

  description?: string;

  image?: string;

  processingHoursNormal?: number;

  processingHoursQuick?: number;

  isActive?: boolean;

  price?: number;
};

export type AdminTabParamList = {
  Dashboard: undefined;
  Orders: undefined;
  Customers: undefined;
  Delivery: undefined;
  More: undefined;
 
};

export type AdminStackParamList = {
  Tabs: undefined;
  OrderDetails: { orderId: string };
  Services: undefined;
  Payments: undefined;
  Reports: undefined;
  Settings: undefined;
  Adminreviews:undefined;
  AdminDeliveryHistory: undefined;

};

export interface ServicePrice {
  serviceId: string;
  dressTypeId: string;
  deliveryPreference: 'normal' | 'quick' ;
  unitPrice: number;
  
}

export type DeliveryTabParamList = {
  Dashboard: undefined;
  Pickups: undefined;
  Deliveries: undefined;
  History: undefined;
  Profile: undefined;
};

export type DeliveryStackParamList = {
  Tabs: undefined;
  OrderDetails: { orderId: string };
};
