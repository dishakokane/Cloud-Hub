import { useState } from "react";
import { useIssues, IssueStatus, IssuePriority } from "@/hooks/use-issues";
import { PageContainer } from "@/components/PageContainer";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Search, Trash2, Filter } from "lucide-react";
import { toast } from "sonner";
import { toDateSafe } from "@/lib/utils";

export default function AdminIssuesPage() {
  const { issues, loading, updateIssueStatus, updateIssuePriority, deleteIssue } = useIssues();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  if (loading) {
    return (
      <PageContainer title="All Issues">
        <Skeleton className="h-12 w-full mb-4" />
        <Card>
          <CardContent className="p-0">
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  const filteredIssues = issues.filter(issue => {
    const q = search.toLowerCase();
    const matchesSearch =
      (issue.ticketId ?? "").toLowerCase().includes(q) ||
      (issue.userName ?? "").toLowerCase().includes(q) ||
      (issue.userEmail ?? "").toLowerCase().includes(q);
    
    const matchesStatus = statusFilter === "All" || issue.status === statusFilter;
    const matchesType = typeFilter === "All" || issue.type === typeFilter;
    const matchesPriority = priorityFilter === "All" || issue.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateIssueStatus(id, status as IssueStatus);
      toast.success("Status updated");
    } catch (err: any) {
      toast.error("Failed to update status");
    }
  };

  const handlePriorityChange = async (id: string, priority: string) => {
    try {
      await updateIssuePriority(id, priority as IssuePriority);
      toast.success("Priority updated");
    } catch (err: any) {
      toast.error("Failed to update priority");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteIssue(id);
      toast.success("Issue deleted");
    } catch (err: any) {
      toast.error("Failed to delete issue");
    }
  };

  return (
    <PageContainer title="All Issues" subtitle="Manage and update user reported issues across the system.">
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ticket ID, user name or email..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Solved">Solved</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Priorities</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="Network">Network</SelectItem>
              <SelectItem value="Storage">Storage</SelectItem>
              <SelectItem value="Server">Server</SelectItem>
              <SelectItem value="Hardware">Hardware</SelectItem>
              <SelectItem value="Software">Software</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="overflow-hidden border-none shadow-sm">
        <CardContent className="p-0 border rounded-lg">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[120px]">Ticket ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden md:table-cell w-[20%]">Description</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIssues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    No issues found matching filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredIssues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell className="font-medium text-xs">{issue.ticketId}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{issue.userName}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[120px]">{issue.userEmail}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{issue.type}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-sm text-muted-foreground truncate max-w-[150px] lg:max-w-[250px]" title={issue.description}>
                        {issue.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select defaultValue={issue.priority} onValueChange={(val) => handlePriorityChange(issue.id, val)}>
                        <SelectTrigger className="h-8 w-[100px] text-xs border-transparent hover:border-input bg-transparent hover:bg-background px-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low"><PriorityBadge priority="Low" /></SelectItem>
                          <SelectItem value="Medium"><PriorityBadge priority="Medium" /></SelectItem>
                          <SelectItem value="High"><PriorityBadge priority="High" /></SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select defaultValue={issue.status} onValueChange={(val) => handleStatusChange(issue.id, val)}>
                        <SelectTrigger className="h-8 w-[120px] text-xs border-transparent hover:border-input bg-transparent hover:bg-background px-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending"><StatusBadge status="Pending" /></SelectItem>
                          <SelectItem value="In Progress"><StatusBadge status="In Progress" /></SelectItem>
                          <SelectItem value="Solved"><StatusBadge status="Solved" /></SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                      {(() => { const d = toDateSafe(issue.createdAt); return d ? format(d, "MMM d, yy") : 'N/A'; })()}
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Ticket {issue.ticketId}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the ticket and remove its data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(issue.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
