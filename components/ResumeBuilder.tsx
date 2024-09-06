"use client";

import React from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent, // Add this line
  DragOverlay,
  useDndMonitor,
  CollisionDetection,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersonalInfo } from "./PersonalInfo";
import { Section } from "./Section";
import { useResumeState } from "../hooks/useResumeState";
import { useExport } from "../hooks/useExport";
import { Entry } from "./Entry";
import { PlusCircle } from "lucide-react";

function DragMonitor({
  setActiveId,
}: {
  setActiveId: (id: string | null) => void;
}) {
  useDndMonitor({
    onDragStart(event) {
      setActiveId(event.active.id.toString());
    },
    onDragCancel() {
      setActiveId(null);
    },
    onDragEnd() {
      setActiveId(null);
    },
  });

  return null;
}

export function ResumeBuilder() {
  const {
    personalInfo,
    sections,
    setSections,
    updatePersonalInfo,
    addEntry,
    updateEntry,
    addDetail,
    updateDetail,
    removeEntry,
    addSection,
    removeSection,
    updateSectionTitle,
    removeDetail, // Add this line
  } = useResumeState();

  const { exportToMarkdown, exportToWord } = useExport(personalInfo, sections);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [activeType, setActiveType] = React.useState<
    "section" | "entry" | null
  >(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id.toString());
    setActiveType(active.data.current?.type || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const activeId = active.id.toString();
      const overId = over.id.toString();

      // Check if we're dealing with sections
      const activeSectionIndex = sections.findIndex(
        (section) => section.id === activeId
      );
      const overSectionIndex = sections.findIndex(
        (section) => section.id === overId
      );

      if (activeSectionIndex !== -1 && overSectionIndex !== -1) {
        // Section dragging
        const newSections = arrayMove(
          sections,
          activeSectionIndex,
          overSectionIndex
        );
        setSections(newSections);
      }
      // Entry dragging is now handled within each Section component
    }

    setActiveId(null);
    setActiveType(null);
  };
  const customCollisionDetection: CollisionDetection = (args) => {
    const { droppableContainers, droppableRects, active } = args;

    if (!active) return [];

    const activeRect = active.rect.current.translated;
    if (!activeRect) return [];

    // Use the y-position of the drag handle instead of the center
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
            value: dragHandleY - rect.top, // Distance from top of container
          },
        });
      }
    }

    // Sort collisions by their vertical position
    collisions.sort((a, b) => a.data.value - b.data.value);

    // Return only the first (topmost) collision
    return collisions.length > 0 ? [collisions[0]] : [];
  };
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div id="resume-content" className="space-y-6">
        <PersonalInfo
          personalInfo={personalInfo}
          updatePersonalInfo={updatePersonalInfo}
        />
        <DndContext
          sensors={sensors}
          collisionDetection={customCollisionDetection}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <DragMonitor setActiveId={setActiveId} />
          <SortableContext
            items={sections.map((section) => section.id)}
            strategy={verticalListSortingStrategy}
          >
            {sections.map((section) => (
              <Section
                key={section.id}
                section={section}
                addEntry={addEntry}
                updateEntry={updateEntry}
                addDetail={addDetail}
                updateDetail={updateDetail}
                removeEntry={removeEntry}
                updateSectionTitle={updateSectionTitle}
                removeSection={removeSection}
                removeDetail={removeDetail}
              />
            ))}
          </SortableContext>
          <DragOverlay>
            {activeId && activeType === "section" && (
              <Section
                section={sections.find((s) => s.id === activeId) || sections[0]}
                addEntry={addEntry}
                updateEntry={updateEntry}
                addDetail={addDetail}
                updateDetail={updateDetail}
                removeEntry={removeEntry}
                updateSectionTitle={updateSectionTitle}
                removeSection={removeSection}
                removeDetail={removeDetail}
                isDragging
              />
            )}
            {activeId && activeType === "entry" && (
              <Entry
                entry={
                  sections
                    .flatMap((s) => s.entries)
                    .find((e) => e.id === activeId)!
                }
                sectionId=""
                updateEntry={() => {}}
                addDetail={() => {}}
                updateDetail={() => {}}
                removeEntry={() => {}}
                isDragging
                removeDetail={removeDetail}
              />
            )}
          </DragOverlay>
        </DndContext>
        <Button
          variant="outline"
          size="sm"
          onClick={addSection}
          className="w-full"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Section
        </Button>
      </div>
      <div className="flex justify-center space-x-4">
        <Button onClick={exportToMarkdown}>
          <FileDown className="mr-2 h-4 w-4" />
          Export to Markdown
        </Button>
        <Button onClick={exportToWord}>
          <FileDown className="mr-2 h-4 w-4" />
          Export to Word
        </Button>
      </div>
    </div>
  );
}
