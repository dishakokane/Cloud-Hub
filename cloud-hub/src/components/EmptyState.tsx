import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <div className="mb-4 text-muted-foreground/50">{icon}</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
        {action && <div>{action}</div>}
      </CardContent>
    </Card>
  );
}
