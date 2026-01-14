export interface PaperRoll {
  id: string;
  name: string;
  type: 'Coated' | 'Uncoated' | 'Specialty';
  quantity: number; // Represents Weight (Qty from Excel)
  rollCount: number; // Represents Roll Count (Roll-Cnt from Excel)
  reorderLevel: number;
  lastUpdated: string;
}

export interface Supplier {
  id: string;
  name: string;
  leadTimeDays: number;
  costPerRoll: number;
  contactPerson: string;
  contactEmail: string;
}

export interface HistoricalUsage {
  month: string;
  Coated: number;
  Uncoated: number;
  Specialty: number;
}
