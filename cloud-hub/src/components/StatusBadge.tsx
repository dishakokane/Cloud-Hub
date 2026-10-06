import { Badge } from "@/components/ui/badge";
import { IssueStatus } from "@/hooks/use-issues";

export function StatusBadge({ status }: { status: IssueStatus }) {
  switch (status) {
    case "Pending":
      return <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>;
    case "In Progress":
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>;
    case "Solved":
      return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">Solved</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
