import { useIssues } from "@/hooks/use-issues";
import { PageContainer } from "@/components/PageContainer";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { FileText, CheckCircle2, Clock, AlertCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { toDateSafe } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function AdminDashboard() {
  const { issues, loading } = useIssues();

  if (loading) {
    return (
      <PageContainer title="Admin Dashboard">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-[120px] w-full rounded-xl" />)}
        </div>
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Skeleton className="h-[300px] w-full rounded-xl" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </PageContainer>
    );
  }

  const total = issues.length;
  const pending = issues.filter(i => i.status === "Pending").length;
  const inProgress = issues.filter(i => i.status === "In Progress").length;
  const solved = issues.filter(i => i.status === "Solved").length;

  const typeCounts = {
    Network: issues.filter(i => i.type === "Network").length,
    Storage: issues.filter(i => i.type === "Storage").length,
    Server: issues.filter(i => i.type === "Server").length,
    Hardware: issues.filter(i => i.type === "Hardware").length,
    Software: issues.filter(i => i.type === "Software").length,
  };

  const barData = [
    { name: "Network", count: typeCounts.Network },
    { name: "Storage", count: typeCounts.Storage },
    { name: "Server", count: typeCounts.Server },
    { name: "Hardware", count: typeCounts.Hardware },
    { name: "Software", count: typeCounts.Software },
  ];

  const pieData = [
    { name: "Pending", value: pending, color: "var(--color-chart-1)" },
    { name: "In Progress", value: inProgress, color: "var(--color-chart-2)" },
    { name: "Solved", value: solved, color: "var(--color-chart-3)" },
  ];

  const mostCommonType = Object.keys(typeCounts).reduce((a, b) => typeCounts[a as keyof typeof typeCounts] > typeCounts[b as keyof typeof typeCounts] ? a : b);

  const recentIssues = issues.slice(0, 8);

  return (
    <PageContainer title="Admin Dashboard" subtitle="System-wide overview of all cloud issues.">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Total Issues" value={total} icon={<FileText className="h-5 w-5" />} />
        <StatCard title="Pending" value={pending} icon={<Clock className="h-5 w-5" />} />
        <StatCard title="In Progress" value={inProgress} icon={<AlertCircle className="h-5 w-5" />} />
        <StatCard title="Solved" value={solved} icon={<CheckCircle2 className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Issues by Type</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-5">
              <div className="text-center">
                <span className="text-3xl font-bold">{total}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="col-span-1 bg-primary text-primary-foreground border-none">
          <CardContent className="p-6">
            <TrendingUp className="h-8 w-8 mb-4 opacity-80" />
            <h3 className="text-lg font-medium opacity-90 mb-1">Most Common Issue</h3>
            <p className="text-3xl font-bold">{mostCommonType}</p>
            <p className="text-sm mt-4 opacity-80">
              {typeCounts[mostCommonType as keyof typeof typeCounts]} tickets reported in this category.
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentIssues.map(issue => (
                <div key={issue.id} className="flex items-center justify-between py-2 border-b last:border-0 last:pb-0">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{issue.ticketId} - {issue.type}</span>
                    <span className="text-xs text-muted-foreground">Reported by {issue.userName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={issue.status} />
                    <span className="text-xs text-muted-foreground w-20 text-right">
                      {(() => { const d = toDateSafe(issue.createdAt); return d ? formatDistanceToNow(d) : ''; })()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

    </PageContainer>
  );
}
