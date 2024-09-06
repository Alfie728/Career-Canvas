import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Entry } from "./Entry";
import { Section as SectionType } from "../constants/types";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Input } from "@/components/ui/input";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  CollisionDetection,
  DragOverlay,
} from "@dnd-kit/core";

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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [activeType, setActiveType] = React.useState<"entry" | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id.toString());
    setActiveType(active.data.current?.type || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = section.entries.findIndex((e) => e.id === active.id);
      const newIndex = section.entries.findIndex((e) => e.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newEntries = arrayMove(section.entries, oldIndex, newIndex);
        // Update the parent component's state
        updateEntry(section.id, "", "reorder", JSON.stringify(newEntries));
      }
    }
    setActiveId(null);
    setActiveType(null);
  };
  const customCollisionDetection: CollisionDetection = (args) => {
    const { droppableContainers, droppableRects, active } = args;

    if (!active) return [];

    const activeRect = active.rect.current.translated;
    if (!activeRect) return [];

    const dragHandleY = activeRect.top;

    const collisions = [];

    for (const droppableContainer of droppableContainers) {
      const { id } = droppableContainer;
      const rect = droppableRects.get(id);

      if (rect && dragHandleY >= rect.top && dragHandleY <= rect.bottom) {
        collisions.push({
          id,
          data: {
            droppableContainer,
            value: dragHandleY - rect.top,
          },
        });
      }
    }

    collisions.sort((a, b) => a.data.value - b.data.value);

    return collisions.length > 0 ? [collisions[0]] : [];
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
