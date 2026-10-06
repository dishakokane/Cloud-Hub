import { useIssues } from "@/hooks/use-issues";
import { PageContainer } from "@/components/PageContainer";
import { StatCard } from "@/components/StatCard";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { FileText, CheckCircle2, Clock, AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { toDateSafe } from "@/lib/utils";

export default function UserDashboard() {
  const { issues, loading } = useIssues();

  if (loading) {
    return (
      <PageContainer title="Dashboard">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Skeleton className="h-[120px] w-full rounded-xl" />
          <Skeleton className="h-[120px] w-full rounded-xl" />
          <Skeleton className="h-[120px] w-full rounded-xl" />
          <Skeleton className="h-[120px] w-full rounded-xl" />
        </div>
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </PageContainer>
    );
  }

  const total = issues.length;
  const pending = issues.filter(i => i.status === "Pending").length;
  const inProgress = issues.filter(i => i.status === "In Progress").length;
  const solved = issues.filter(i => i.status === "Solved").length;

  const recentIssues = issues.slice(0, 5);

  return (
    <PageContainer 
      title="Dashboard" 
      subtitle="Welcome back! Here's an overview of your reported issues."
      action={
        <Button asChild>
          <Link href="/user/report">
            <Plus className="mr-2 h-4 w-4" />
            Report New Issue
          </Link>
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Total Issues" value={total} icon={<FileText className="h-5 w-5" />} />
        <StatCard title="Pending" value={pending} icon={<Clock className="h-5 w-5" />} />
        <StatCard title="In Progress" value={inProgress} icon={<AlertCircle className="h-5 w-5" />} />
        <StatCard title="Solved" value={solved} icon={<CheckCircle2 className="h-5 w-5" />} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Issues</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/user/issues">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentIssues.length === 0 ? (
            <EmptyState 
              icon={<FileText className="h-10 w-10" />}
              title="No issues reported"
              description="You haven't reported any issues yet. If you encounter a problem, let us know."
              action={
                <Button asChild variant="outline">
                  <Link href="/user/report">Report Issue</Link>
                </Button>
              }
            />
          ) : (
            <div className="space-y-4">
              {recentIssues.map(issue => (
                <div key={issue.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-sm">{issue.ticketId}</span>
                    <span className="text-sm text-muted-foreground line-clamp-1">{issue.description}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground hidden sm:inline-block">
                      {(() => { const d = toDateSafe(issue.createdAt); return d ? formatDistanceToNow(d, { addSuffix: true }) : 'Just now'; })()}
                    </span>
                    <StatusBadge status={issue.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
