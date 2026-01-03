export type Order = {
  id: number;
  customerId: number;
  status: "pending" | "paid" | "cancelled";
  total: number;
  createdAt: Date;
};
