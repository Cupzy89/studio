import type { PaperRoll, Supplier, HistoricalUsage } from '@/lib/types';

export const paperRolls: PaperRoll[] = [
  { id: 'R001', name: 'Glossy Coated 120g', type: 'Coated', quantity: 75, rollCount: 10, reorderLevel: 50, lastUpdated: '2024-05-20T10:00:00Z' },
  { id: 'R002', name: 'Matte Coated 150g', type: 'Coated', quantity: 45, rollCount: 5, reorderLevel: 50, lastUpdated: '2024-05-21T11:30:00Z' },
  { id: 'R003', name: 'Standard Uncoated 80g', type: 'Uncoated', quantity: 120, rollCount: 15, reorderLevel: 100, lastUpdated: '2024-05-22T09:00:00Z' },
  { id: 'R004', name: 'Recycled Uncoated 100g', type: 'Uncoated', quantity: 30, rollCount: 8, reorderLevel: 75, lastUpdated: '2024-05-21T15:00:00Z' },
  { id: 'R005', name: 'Water-resistant Vinyl', type: 'Specialty', quantity: 60, rollCount: 12, reorderLevel: 40, lastUpdated: '2024-05-20T14:20:00Z' },
  { id: 'R006', name: 'Heavy Cardstock 300g', type: 'Specialty', quantity: 80, rollCount: 7, reorderLevel: 60, lastUpdated: '2024-05-22T16:00:00Z' },
];

export const suppliers: Supplier[] = [
  { id: 'S01', name: 'Paper Mill Inc.', leadTimeDays: 7, costPerRoll: 50, contactPerson: 'John Doe', contactEmail: 'john@papermill.com' },
  { id: 'S02', name: 'Global Paper Co.', leadTimeDays: 5, costPerRoll: 55, contactPerson: 'Jane Smith', contactEmail: 'jane@globalpaper.com' },
  { id: 'S03', name: 'Specialty Rolls Ltd.', leadTimeDays: 10, costPerRoll: 75, contactPerson: 'Sam Wilson', contactEmail: 'sam@specialtyrolls.com' },
];

export const historicalUsage: HistoricalUsage[] = [
    { month: 'Jan', Coated: 40, Uncoated: 60, Specialty: 20 },
    { month: 'Feb', Coated: 35, Uncoated: 55, Specialty: 25 },
    { month: 'Mar', Coated: 50, Uncoated: 70, Specialty: 30 },
    { month: 'Apr', Coated: 45, Uncoated: 65, Specialty: 28 },
    { month: 'May', Coated: 55, Uncoated: 75, Specialty: 35 },
    { month: 'Jun', Coated: 60, Uncoated: 80, Specialty: 40 },
];
