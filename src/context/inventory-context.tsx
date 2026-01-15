'use client';

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import type { PaperRoll } from '@/lib/types';
import { paperRolls as initialPaperRolls } from '@/lib/data';

interface InventoryContextType {
  paperRolls: PaperRoll[];
  setPaperRolls: (rolls: PaperRoll[]) => void;
  isLoading: boolean;
}

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

const INVENTORY_STORAGE_KEY = 'paperRollInventory';

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [paperRolls, setPaperRollsState] = useState<PaperRoll[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data from localStorage on client-side
  useEffect(() => {
    setIsLoading(true);
    try {
      const storedData = localStorage.getItem(INVENTORY_STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setPaperRollsState(parsedData);
      } else {
        // If no data in storage, use initial data
        setPaperRollsState(initialPaperRolls);
        localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(initialPaperRolls));
      }
    } catch (error) {
      console.error('Failed to load inventory from localStorage', error);
      setPaperRollsState(initialPaperRolls); // Fallback to initial data
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to update state and localStorage
  const setPaperRolls = (rolls: PaperRoll[]) => {
    try {
      localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(rolls));
      setPaperRollsState(rolls);
    } catch (error) {
      console.error('Failed to save inventory to localStorage', error);
    }
  };

  return (
    <InventoryContext.Provider value={{ paperRolls, setPaperRolls, isLoading }}>
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
