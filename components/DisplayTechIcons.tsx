import React from "react";
import { Badge } from "@/components/ui/badge";

interface TechIconProps {
  techStack: string[];
}

export default function DisplayTechIcons({ techStack }: TechIconProps) {
  if (!techStack || techStack.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {techStack.slice(0, 4).map((tech) => (
        <Badge
          key={tech}
          variant="secondary"
          className="text-[10px] font-medium py-0 px-2 bg-muted/60 text-muted-foreground border border-border/50"
        >
          {tech}
        </Badge>
      ))}
      {techStack.length > 4 && (
        <span className="text-[10px] text-muted-foreground">+{techStack.length - 4}</span>
      )}
    </div>
  );
}
