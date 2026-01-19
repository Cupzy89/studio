'use client';

import { AgingChart } from '@/components/aging-chart';

export default function AnalysisPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Analisis Usia Stok</h1>
      <div className="grid grid-cols-1 gap-6">
        <AgingChart />
      </div>
    </div>
  );
}
