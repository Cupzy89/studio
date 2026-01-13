import type { OptimizePaperRollOrdersInput } from '@/ai/flows/optimize-paper-roll-orders';

export const aiOptimizationInput: OptimizePaperRollOrdersInput = {
    historicalUsage: [
        { rollType: 'Glossy Coated 120g', quantity: 200, date: '2024-04-01T00:00:00Z' },
        { rollType: 'Matte Coated 150g', quantity: 180, date: '2024-04-01T00:00:00Z' },
        { rollType: 'Standard Uncoated 80g', quantity: 300, date: '2024-04-01T00:00:00Z' },
        { rollType: 'Recycled Uncoated 100g', quantity: 150, date: '2024-04-01T00:00:00Z' },
        { rollType: 'Water-resistant Vinyl', quantity: 100, date: '2024-04-01T00:00:00Z' },
        { rollType: 'Heavy Cardstock 300g', quantity: 120, date: '2024-04-01T00:00:00Z' },
        { rollType: 'Glossy Coated 120g', quantity: 210, date: '2024-05-01T00:00:00Z' },
        { rollType: 'Matte Coated 150g', quantity: 190, date: '2024-05-01T00:00:00Z' },
        { rollType: 'Standard Uncoated 80g', quantity: 320, date: '2024-05-01T00:00:00Z' },
    ],
    currentStockLevels: [
        { rollType: 'Glossy Coated 120g', quantity: 75 },
        { rollType: 'Matte Coated 150g', quantity: 45 },
        { rollType: 'Standard Uncoated 80g', quantity: 120 },
        { rollType: 'Recycled Uncoated 100g', quantity: 30 },
        { rollType: 'Water-resistant Vinyl', quantity: 60 },
        { rollType: 'Heavy Cardstock 300g', quantity: 80 },
    ],
    supplierLeadTimes: [
        { rollType: 'Glossy Coated 120g', supplier: 'Paper Mill Inc.', leadTimeDays: 7, costPerRoll: 50 },
        { rollType: 'Matte Coated 150g', supplier: 'Paper Mill Inc.', leadTimeDays: 7, costPerRoll: 60 },
        { rollType: 'Standard Uncoated 80g', supplier: 'Global Paper Co.', leadTimeDays: 5, costPerRoll: 40 },
        { rollType: 'Recycled Uncoated 100g', supplier: 'Global Paper Co.', leadTimeDays: 5, costPerRoll: 45 },
        { rollType: 'Water-resistant Vinyl', supplier: 'Specialty Rolls Ltd.', leadTimeDays: 10, costPerRoll: 90 },
        { rollType: 'Heavy Cardstock 300g', supplier: 'Specialty Rolls Ltd.', leadTimeDays: 10, costPerRoll: 85 },
        { rollType: 'Glossy Coated 120g', supplier: 'Global Paper Co.', leadTimeDays: 6, costPerRoll: 52 },
    ],
    desiredStockLevels: [
        { rollType: 'Glossy Coated 120g', quantity: 250 },
        { rollType: 'Matte Coated 150g', quantity: 250 },
        { rollType: 'Standard Uncoated 80g', quantity: 400 },
        { rollType: 'Recycled Uncoated 100g', quantity: 200 },
        { rollType: 'Water-resistant Vinyl', quantity: 150 },
        { rollType: 'Heavy Cardstock 300g', quantity: 150 },
    ],
};
