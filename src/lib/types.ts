export interface PaperRoll {
  id: string;
  name: string;
  type: 'Coated' | 'Uncoated' | 'Specialty';
  quantity: number;
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
