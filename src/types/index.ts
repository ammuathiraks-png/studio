export type SalesRecord = {
  id: string;
  product: string;
  category: string;
  region: string;
  saleDate: string; // ISO date string
  amount: number;
  unitsSold: number;
};
