import { SalesRecord } from '@/types';
import { subDays } from 'date-fns';

const products = [
  'Quantum Widget', 'Nebula Gadget', 'Photon Emitter', 'Chrono Gear', 'Plasma Inductor',
  'Singularity Drive', 'Hyper-Sprocket', 'Tesseract Key', 'Void Anchor', 'Starlight Filter'
];
const categories = ['Electronics', 'Industrial', 'Scientific', 'Consumer Goods'];
const regions = ['North America', 'Europe', 'Asia-Pacific', 'South America', 'Africa'];

export const mockData: SalesRecord[] = Array.from({ length: 100 }, (_, i) => {
  const product = products[Math.floor(Math.random() * products.length)];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const region = regions[Math.floor(Math.random() * regions.length)];
  const unitsSold = Math.floor(Math.random() * 50) + 1;
  const amount = parseFloat(((Math.random() * 200) + 10).toFixed(2)) * unitsSold;
  const saleDate = subDays(new Date(), Math.floor(Math.random() * 365));

  return {
    id: `sale_${i + 1}`,
    product,
    category,
    region,
    saleDate: saleDate.toISOString(),
    amount: parseFloat(amount.toFixed(2)),
    unitsSold,
  };
});
