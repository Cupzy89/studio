import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ScrollText,
  AlertTriangle,
  Truck,
} from 'lucide-react';
import { InventoryTable } from '@/components/inventory-table';
import { UsageChart } from '@/components/usage-chart';
import { OrderOptimizer } from '@/components/order-optimizer';
import { paperRolls, suppliers } from '@/lib/data';

export default function DashboardPage() {
  const totalStock = paperRolls.reduce((sum, roll) => sum + roll.quantity, 0);
  const lowStockItems = paperRolls.filter(
    (roll) => roll.quantity < roll.reorderLevel
  ).length;

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rolls</CardTitle>
            <ScrollText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStock}</div>
            <p className="text-xs text-muted-foreground">
              in stock across all types
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Items
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              items below reorder level
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.length}</div>
            <p className="text-xs text-muted-foreground">active suppliers</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <InventoryTable />
        </div>
        <div className="lg:col-span-2">
          <UsageChart />
        </div>
      </div>

      <div>
        <OrderOptimizer />
      </div>
    </>
  );
}
