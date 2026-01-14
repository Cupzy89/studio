'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { PaperRoll } from '@/lib/types';
import { paperRolls as initialPaperRolls } from '@/lib/data';

interface InventoryContextType {
  paperRolls: PaperRoll[];
  setPaperRolls: (rolls: PaperRoll[]) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [paperRolls, setPaperRolls] = useState<PaperRoll[]>(initialPaperRolls);

  return (
    <InventoryContext.Provider value={{ paperRolls, setPaperRolls }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
