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
  pointerWithin,
  getFirstCollision,
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

      // Check if we're dealing with sections or entries
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
      } else {
        // Entry dragging
        const newSections = [...sections];
        const activeSectionIndex = sections.findIndex((section) =>
          section.entries.some((entry) => entry.id === activeId)
        );
        const overSectionIndex = sections.findIndex((section) =>
          section.entries.some((entry) => entry.id === overId)
        );

        if (activeSectionIndex !== -1 && overSectionIndex !== -1) {
          const activeSection = newSections[activeSectionIndex];
          const overSection = newSections[overSectionIndex];

          const oldIndex = activeSection.entries.findIndex(
            (entry) => entry.id === activeId
          );
          const newIndex = overSection.entries.findIndex(
            (entry) => entry.id === overId
          );

          if (activeSectionIndex === overSectionIndex) {
            // Dragging within the same section
            activeSection.entries = arrayMove(
              activeSection.entries,
              oldIndex,
              newIndex
            );
          } else {
            // Dragging between sections
            const [movedEntry] = activeSection.entries.splice(oldIndex, 1);
            overSection.entries.splice(newIndex, 0, movedEntry);
          }

          setSections(newSections);
        }
      }
    }

    setActiveId(null);
    setActiveType(null);
  };
  const customCollisionDetection: CollisionDetection = (args) => {
    // First, let's get all intersecting droppable areas
    const pointerIntersections = pointerWithin(args);

    // If there's no intersection, return an empty array
    if (!pointerIntersections.length) return [];

    // Find the first droppable area that intersects with the pointer
    const firstIntersection = getFirstCollision(pointerIntersections, "id");

    if (firstIntersection) {
      return [
        {
          id: firstIntersection,
          data: {
            droppableContainer: firstIntersection,
            value: 0,
          },
        },
      ];
    }

    return [];
  };
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 bg-white">
      <div id="resume-content">
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
              />
            )}
          </DragOverlay>
        </DndContext>
        <Button
          variant="outline"
          size="sm"
          onClick={addSection}
          className="mt-4"
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
