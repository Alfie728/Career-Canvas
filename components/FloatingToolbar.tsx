import React from "react";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline } from "lucide-react";

interface FloatingToolbarProps {
  onApplyStyle: (style: "bold" | "italic" | "underline") => void;
}

export function FloatingToolbar({ onApplyStyle }: FloatingToolbarProps) {
  return (
    <div className="sticky top-1/2 transform -translate-y-1/2 bg-transparent rounded-lg p-2 flex flex-col space-y-2 mr-4 h-fit">
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => onApplyStyle("bold")}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => onApplyStyle("italic")}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => onApplyStyle("underline")}
      >
        <Underline className="h-4 w-4" />
      </Button>
    </div>
  );
}
