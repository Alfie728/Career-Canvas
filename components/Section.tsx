import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Entry } from "./Entry";
import { Section as SectionType } from "../constants/types";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

type SectionProps = {
  section: SectionType;
  addEntry: (sectionId: string) => void;
  updateEntry: (
    sectionId: string,
    entryId: string,
    field: string,
    value: string
  ) => void;
  addDetail: (sectionId: string, entryId: string) => void;
  updateDetail: (
    sectionId: string,
    entryId: string,
    index: number,
    value: string
  ) => void;
  removeEntry: (sectionId: string, entryId: string) => void;
  isDragging?: boolean;
};

export function Section({
  section,
  addEntry,
  updateEntry,
  addDetail,
  updateDetail,
  removeEntry,
  isDragging = false,
}: SectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: section.id, data: { type: "section" } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-6 border border-gray-200 p-4 rounded-lg bg-white"
    >
      <div className="flex items-center mb-2" {...attributes} {...listeners}>
        <div className="mr-2 cursor-move">
          <GripVertical className="text-gray-400" />
        </div>
        <h2 className="text-xl font-bold">{section.title}</h2>
      </div>
      <SortableContext
        items={section.entries.map((entry) => entry.id)}
        strategy={verticalListSortingStrategy}
      >
        {section.entries.map((entry) => (
          <Entry
            key={entry.id}
            entry={entry}
            sectionId={section.id}
            updateEntry={updateEntry}
            addDetail={addDetail}
            updateDetail={updateDetail}
            removeEntry={removeEntry}
          />
        ))}
      </SortableContext>
      <Button
        variant="outline"
        size="sm"
        onClick={() => addEntry(section.id)}
        className="mt-2"
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Add {section.title} Entry
      </Button>
    </div>
  );
}
