import { Badge } from "@/components/ui/badge";
import { IssuePriority } from "@/hooks/use-issues";

export function PriorityBadge({ priority }: { priority: IssuePriority }) {
  switch (priority) {
    case "High":
      return <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">High</Badge>;
    case "Medium":
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>;
    case "Low":
      return <Badge variant="secondary" className="bg-slate-100 text-slate-800 hover:bg-slate-100">Low</Badge>;
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
}
