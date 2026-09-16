export const ENDPOINT_CONSTANTS = {
  // =========================
  // Auth
  // =========================

  login: "/auth/login",
  register: "/auth/register",


  // =========================
  // Customer Dashboard
  // =========================

  customerDashboard: "/customer/dashboard",


  // =========================
  // Customer Profile
  // =========================

  getCustomerProfile: "/customer/profile",
  updateCustomerProfile: "/customer/profile",


  // =========================
  // Customer Service Request
  // =========================

  customerServiceRequest:
    "/customer/service-request",

  getMyServiceRequest:
    "/customer/service-request",


  // =========================
  // Orders
  // =========================

  createOrder: "/orders",

  getMyOrders: "/orders/my-orders",

  getOrderById: (id: string) =>
    `/orders/${id}`,

  trackOrder: (id: string) =>
    `/orders/${id}/track`,

  cancelOrder: (id: string) =>
    `/orders/${id}/cancel`,


  // =========================
  // Wallet
  // =========================

  getWallet: "/wallet",

  getWalletTransactions:
    "/wallet/transactions",

  addWalletMoney:
    "/wallet/add-money",


  // =========================
  // Coins
  // =========================

  getCoins: "/coins",

  getCoinTransactions:
    "/coin-transactions",

  getCoinTransactionById: (id: string) =>
    `/coin-transactions/${id}`,


  // =========================
  // Notifications
  // =========================

  getNotifications:
    "/notifications",

  getUnreadNotifications:
    "/notifications/unread",

  markNotificationAsRead: (id: string) =>
    `/notifications/${id}/read`,

  markAllNotificationsAsRead:
    "/notifications/read-all",

  deleteNotification: (id: string) =>
    `/notifications/${id}`,


  // =========================
  // Services
  // =========================

  getServices: "/services",

  getBasicServices:
    "/services/basic",

  getPopularServices:
    "/services/popular",

  getServiceById: (id: string) =>
    `/services/${id}`,


  // =========================
  // Advertisements
  // =========================

  getAdvertisements:
    "/advertisements",


  // =========================
  // Admin
  // =========================

  createDeliveryPerson:
    "/admin/create-delivery",

  adminServiceRequests:
    "/admin/service-requests",

  approveServiceRequest: (id: string) =>
    `/admin/service-requests/${id}/approve`,

  rejectServiceRequest: (id: string) =>
    `/admin/service-requests/${id}/reject`,

} as const;
