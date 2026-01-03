export type Customers = {
  id: number;
  name: string;
  email: string; // unique
  status: "active" | "inactive"; // badge
  createdAt: Date;
};
