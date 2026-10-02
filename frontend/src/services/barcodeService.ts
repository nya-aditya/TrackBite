import { FoodItem } from '../types/nutrition';
import { VERIFIED_FOOD_ITEMS } from './foodDatabaseService';

export interface BarcodeProduct {
  barcode: string;
  foodItem: FoodItem;
}

export const BARCODE_CATALOG: BarcodeProduct[] = [
  {
    barcode: '074873129482',
    foodItem: VERIFIED_FOOD_ITEMS.find((f) => f.id === 'food-whey')!,
  },
  {
    barcode: '041220789012',
    foodItem: VERIFIED_FOOD_ITEMS.find((f) => f.id === 'food-greek-yogurt')!,
  },
  {
    barcode: '030000010204',
    foodItem: VERIFIED_FOOD_ITEMS.find((f) => f.id === 'food-oatmeal')!,
  },
  {
    barcode: '028400070560',
    foodItem: VERIFIED_FOOD_ITEMS.find((f) => f.id === 'food-almonds')!,
  },
];

export function lookupBarcode(code: string): FoodItem | null {
  const match = BARCODE_CATALOG.find((item) => item.barcode === code.trim());
  return match ? match.foodItem : null;
}
