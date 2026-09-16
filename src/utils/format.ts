export const STATUS_LABEL: Record<string, string> = {
  ORDER_CREATED: 'Created',
  ADMIN_CONFIRMED: 'Confirmed',
  PICKUP_ASSIGNED: 'Pickup assigned',
  OUT_FOR_PICKUP: 'Out for pickup',
  PICKED_UP: 'Picked up',
  PROCESSING: 'Processing',
  READY_FOR_DELIVERY: 'Ready',
  OUT_FOR_DELIVERY: 'Out for delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  PENDING: 'Pending',
  PAID: 'Paid',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
  COD: 'Cash on delivery',
};

export function inr(amount: number): string {
  return `₹${amount.toFixed(0)}`;
}

export function formatWhen(iso?: string): string {
  if (!iso) {
    return '—';
  }
  const d = new Date(iso);
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}
