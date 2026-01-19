'use client';

import { SuppliersTable } from '@/components/suppliers-table';

export default function InventoryPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Inventaris per Jenis</h1>
      <SuppliersTable />
    </>
  );
}
