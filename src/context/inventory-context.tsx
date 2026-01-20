'use client';

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
} from 'react';
import type { PaperRoll } from '@/lib/types';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

export interface AgingFilter {
  min: number;
  max: number | null;
  label: string;
}

interface InventoryContextType {
  paperRolls: PaperRoll[];
  setPaperRolls: (rolls: PaperRoll[]) => void;
  isLoading: boolean;
  agingFilter: AgingFilter | null;
  setAgingFilter: (filter: AgingFilter | null) => void;
  kindFilter: string | null;
  setKindFilter: (filter: string | null) => void;
  gsmFilter: number | null;
  setGsmFilter: (filter: number | null) => void;
  widthFilter: number | null;
  setWidthFilter: (filter: number | null) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();

  const rollsCollectionRef = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'rolls');
  }, [user, firestore]);

  const { data: paperRollsFromFirestore, isLoading: isCollectionLoading } = 
    useCollection<PaperRoll>(rollsCollectionRef);

  const [agingFilter, setAgingFilter] = useState<AgingFilter | null>(null);
  const [kindFilter, setKindFilter] = useState<string | null>(null);
  const [gsmFilter, setGsmFilter] = useState<number | null>(null);
  const [widthFilter, setWidthFilter] = useState<number | null>(null);

  // This function is kept for compatibility with the UploadDialog, but the actual
  // data persistence is now handled within the UploadDialog itself by writing to Firestore.
  const setPaperRolls = (rolls: PaperRoll[]) => {
    // This is intentionally a no-op. Firestore real-time updates will refresh the state.
    console.warn("setPaperRolls called, but inventory is now managed by Firestore real-time updates.");
  };
  
  const isLoading = isAuthLoading || (!!user && isCollectionLoading);
  const paperRolls = paperRollsFromFirestore || [];

  const contextValue = {
    paperRolls,
    setPaperRolls,
    isLoading,
    agingFilter,
    setAgingFilter,
    kindFilter,
    setKindFilter,
    gsmFilter,
    setGsmFilter,
    widthFilter,
    setWidthFilter,
  };

  return (
    <InventoryContext.Provider value={contextValue}>
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
