import { useState } from "react";
import { useIssues, Issue } from "@/hooks/use-issues";
import { PageContainer } from "@/components/PageContainer";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { EmptyState } from "@/components/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow, format } from "date-fns";
import { Search, Filter, FileText, MapPin, Calendar, Tag } from "lucide-react";
import { toDateSafe } from "@/lib/utils";

export default function MyIssuesPage() {
  const { issues, loading } = useIssues();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  if (loading) {
    return (
      <PageContainer title="My Issues">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full max-w-md" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-[200px] w-full rounded-xl" />)}
          </div>
        </div>
      </PageContainer>
    );
  }

  const filteredIssues = issues.filter(issue => {
    const q = search.toLowerCase();
    const matchesSearch =
      (issue.ticketId ?? "").toLowerCase().includes(q) ||
      (issue.description ?? "").toLowerCase().includes(q);
    
    const matchesStatus = statusFilter === "All" || issue.status === statusFilter;
    const matchesType = typeFilter === "All" || issue.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <PageContainer title="My Issues" subtitle="View and track the status of your reported issues.">
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Solved">Solved</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <SelectValue placeholder="Type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="Network">Network</SelectItem>
              <SelectItem value="Storage">Storage</SelectItem>
              <SelectItem value="Server">Server</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredIssues.length === 0 ? (
        <EmptyState 
          icon={<FileText className="h-10 w-10" />}
          title="No issues found"
          description="Try adjusting your filters or search terms."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredIssues.map((issue) => (
            <Card 
              key={issue.id} 
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => setSelectedIssue(issue)}
            >
              <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                <div className="space-y-1">
                  <CardTitle className="text-base">{issue.ticketId}</CardTitle>
                  <span className="text-xs font-medium text-muted-foreground block">{issue.type}</span>
                </div>
                <StatusBadge status={issue.status} />
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                  {issue.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <PriorityBadge priority={issue.priority} />
                  <span className="text-xs text-muted-foreground">
                    {(() => { const d = toDateSafe(issue.createdAt); return d ? formatDistanceToNow(d, { addSuffix: true }) : ''; })()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Sheet open={!!selectedIssue} onOpenChange={(open) => !open && setSelectedIssue(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selectedIssue && (
            <div className="space-y-6 pb-8">
              <SheetHeader>
                <div className="flex items-center justify-between">
                  <SheetTitle>{selectedIssue.ticketId}</SheetTitle>
                  <StatusBadge status={selectedIssue.status} />
                </div>
                <SheetDescription>
                  Reported {(() => { const d = toDateSafe(selectedIssue.createdAt); return d ? formatDistanceToNow(d, { addSuffix: true }) : ''; })()}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-4 mt-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Type</h4>
                  <div className="font-medium">{selectedIssue.type}</div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Priority</h4>
                  <PriorityBadge priority={selectedIssue.priority} />
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                  <div className="text-sm whitespace-pre-wrap bg-muted/30 p-3 rounded-md border">
                    {selectedIssue.description}
                  </div>
                </div>

                {selectedIssue.location && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> Location
                    </h4>
                    <div className="text-sm">{selectedIssue.location.label}</div>
                  </div>
                )}

                {selectedIssue.imageUrl && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Screenshot</h4>
                    <a href={selectedIssue.imageUrl} target="_blank" rel="noreferrer" className="block rounded-md overflow-hidden border">
                      <img src={selectedIssue.imageUrl} alt="Issue attachment" className="w-full h-auto object-cover max-h-60 hover:opacity-90 transition-opacity" />
                    </a>
                  </div>
                )}

                <div className="pt-4 border-t mt-6">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <Calendar className="h-4 w-4" /> Timeline
                  </h4>
                  <div className="text-xs space-y-1 text-muted-foreground">
                    <div>Created: {(() => { const d = toDateSafe(selectedIssue.createdAt); return d ? format(d, "PPpp") : 'N/A'; })()}</div>
                    <div>Last updated: {(() => { const d = toDateSafe(selectedIssue.updatedAt); return d ? format(d, "PPpp") : 'N/A'; })()}</div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

    </PageContainer>
  );
}
