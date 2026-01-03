export type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: "active" | "archived"; // badge
};
