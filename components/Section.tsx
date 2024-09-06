import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/ui/button";
import { Entry } from "./Entry";
import { Section as SectionType } from "../constants/types";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Input } from "@/ui/input";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { useDragAndDrop } from "../hooks/useDragAndDrop";

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
  updateSectionTitle: (sectionId: string, title: string) => void;
  removeSection: (sectionId: string) => void;
  isDragging?: boolean;
  removeDetail: (sectionId: string, entryId: string, index: number) => void;
};

export function Section({
  section,
  addEntry,
  updateEntry,
  addDetail,
  updateDetail,
  removeEntry,
  updateSectionTitle,
  removeSection,
  isDragging = false,
  removeDetail,
}: SectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: section.id, data: { type: "section" } });

  const {
    activeId,
    activeType,
    sensors,
    handleDragStart,
    handleDragEnd,
    customCollisionDetection,
  } = useDragAndDrop(section.entries, (newEntries) => {
    updateEntry(section.id, "", "reorder", JSON.stringify(newEntries));
  });

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
      className="mb-6 border border-border p-4 rounded-lg bg-card text-card-foreground"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center flex-grow">
          <div className="mr-2 cursor-move" {...attributes} {...listeners}>
            <GripVertical className="text-muted-foreground" />
          </div>
          <Input
            value={section.title}
            onChange={(e) => updateSectionTitle(section.id, e.target.value)}
            className="text-xl font-bold border-none bg-transparent p-2 w-full"
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeSection(section.id)}
          className="text-muted-foreground ml-2"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={customCollisionDetection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
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
              removeDetail={removeDetail}
            />
          ))}
        </SortableContext>
        <DragOverlay>
          {activeId && activeType === "entry" && (
            <Entry
              entry={section.entries.find((e) => e.id === activeId)!}
              sectionId={section.id}
              updateEntry={updateEntry}
              addDetail={addDetail}
              updateDetail={updateDetail}
              removeEntry={removeEntry}
              removeDetail={removeDetail}
              isDragging
            />
          )}
        </DragOverlay>
      </DndContext>
      <Button
        variant="outline"
        size="sm"
        onClick={() => addEntry(section.id)}
        className="mt-4 w-full"
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Add {section.title} Entry
      </Button>
    </div>
  );
}
