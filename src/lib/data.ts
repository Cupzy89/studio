import type { PaperRoll, Supplier, HistoricalUsage } from '@/lib/types';

export const paperRolls: PaperRoll[] = [
  { id: 'R001', name: 'Glossy Coated 120g', type: 'Coated', grDate: '2024-05-01', gsm: 120, width: 79, quantity: 75, rollCount: 10, storageBin: 'A-01', aging: 22, batch: 'B001', diameter: 100, length: 5000, vendorName: 'Paper Mill Inc.', reorderLevel: 50, lastUpdated: '2024-05-20T10:00:00Z' },
  { id: 'R002', name: 'Matte Coated 150g', type: 'Coated', grDate: '2024-05-02', gsm: 150, width: 89, quantity: 45, rollCount: 5, storageBin: 'A-02', aging: 21, batch: 'B002', diameter: 100, length: 4000, vendorName: 'Paper Mill Inc.', reorderLevel: 50, lastUpdated: '2024-05-21T11:30:00Z' },
  { id: 'R003', name: 'Standard Uncoated 80g', type: 'Uncoated', grDate: '2024-05-03', gsm: 80, width: 102, quantity: 120, rollCount: 15, storageBin: 'B-01', aging: 20, batch: 'B003', diameter: 120, length: 8000, vendorName: 'Global Paper Co.', reorderLevel: 100, lastUpdated: '2024-05-22T09:00:00Z' },
  { id: 'R004', name: 'Recycled Uncoated 100g', type: 'Uncoated', grDate: '2024-05-04', gsm: 100, width: 102, quantity: 30, rollCount: 8, storageBin: 'B-02', aging: 19, batch: 'B004', diameter: 120, length: 6000, vendorName: 'Global Paper Co.', reorderLevel: 75, lastUpdated: '2024-05-21T15:00:00Z' },
  { id: 'R005', name: 'Water-resistant Vinyl', type: 'Specialty', grDate: '2024-05-05', gsm: 180, width: 120, quantity: 60, rollCount: 12, storageBin: 'C-01', aging: 18, batch: 'B005', diameter: 150, length: 3000, vendorName: 'Specialty Rolls Ltd.', reorderLevel: 40, lastUpdated: '2024-05-20T14:20:00Z' },
  { id: 'R006', name: 'Heavy Cardstock 300g', type: 'Specialty', grDate: '2024-05-06', gsm: 300, width: 70, quantity: 80, rollCount: 7, storageBin: 'C-02', aging: 17, batch: 'B006', diameter: 90, length: 2000, vendorName: 'Specialty Rolls Ltd.', reorderLevel: 60, lastUpdated: '2024-05-22T16:00:00Z' },
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
