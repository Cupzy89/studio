export interface PaperRoll {
  id: string; // SU No
  name: string; // Part No
  type: string; // Kind
  grDate: string; // GR date
  gsm: number; // Gsm
  width: number; // Width
  quantity: number; // Qty (Weight)
  rollCount: number; // Roll-Cnt
  storageBin: string; // storage Bin
  aging: number; // Aging
  batch: string; // Batch
  diameter: number; // Diameter (Cm)
  length: number; // Length
  vendorName: string; // Vendor Name
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
