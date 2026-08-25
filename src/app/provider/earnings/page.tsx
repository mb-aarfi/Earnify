"use client";

import { useProviderEarnings } from "@/hooks/use-misc";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/shared/loading-skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ProviderEarningsPage() {
  const { data: earnings, isLoading } = useProviderEarnings();

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  const summary = earnings?.summary;
  const chart = earnings?.chart ?? [];

  const kpis = [
    { label: "Total Earnings", value: formatCurrency(summary?.totalEarnings ?? 0) },
    { label: "This Month", value: formatCurrency(summary?.thisMonth ?? 0) },
    { label: "This Week", value: formatCurrency(summary?.thisWeek ?? 0) },
    { label: "Pending", value: formatCurrency(summary?.pending ?? 0) },
    { label: "Completed Jobs", value: String(summary?.completedJobs ?? 0) },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Earnings</h1>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
              <p className="text-xl font-bold mt-1">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Monthly Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => [formatCurrency(value), "Earnings"]} />
                <Bar dataKey="earnings" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
