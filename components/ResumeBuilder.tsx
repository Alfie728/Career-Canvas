"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  useDndMonitor,
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

function DragMonitor({ setActiveId }: { setActiveId: (id: string | null) => void }) {
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
  } = useResumeState();

  const { exportToPDF, exportToMarkdown, exportToWord } = useExport(
    personalInfo,
    sections
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [activeId, setActiveId] = React.useState<string | null>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const activeId = active.id.toString();
      const overId = over.id.toString();

      const activeSectionIndex = sections.findIndex(section => 
        section.entries.some(entry => entry.id === activeId)
      );
      const overSectionIndex = sections.findIndex(section => 
        section.entries.some(entry => entry.id === overId)
      );

      if (activeSectionIndex !== -1 && overSectionIndex !== -1) {
        // Entry dragging within the same section or between sections
        const newSections = [...sections];
        const activeSection = newSections[activeSectionIndex];
        const overSection = newSections[overSectionIndex];

        const oldIndex = activeSection.entries.findIndex(entry => entry.id === activeId);
        const newIndex = overSection.entries.findIndex(entry => entry.id === overId);

        if (activeSectionIndex === overSectionIndex) {
          // Dragging within the same section
          activeSection.entries = arrayMove(activeSection.entries, oldIndex, newIndex);
        } else {
          // Dragging between sections
          const [movedEntry] = activeSection.entries.splice(oldIndex, 1);
          overSection.entries.splice(newIndex, 0, movedEntry);
        }

        setSections(newSections);
      } else {
        // Section dragging
        const oldIndex = sections.findIndex((s) => s.id === active.id);
        const newIndex = sections.findIndex((s) => s.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newSections = arrayMove(sections, oldIndex, newIndex);
          setSections(newSections);
        }
      }
    }
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
          collisionDetection={closestCenter}
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
              />
            ))}
          </SortableContext>
          <DragOverlay>
            {activeId ? (
              <Section
                section={sections.find((s) => s.id === activeId) || sections[0]}
                addEntry={addEntry}
                updateEntry={updateEntry}
                addDetail={addDetail}
                updateDetail={updateDetail}
                removeEntry={removeEntry}
                isDragging
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
      <div className="flex justify-center space-x-4">
        <Button onClick={exportToPDF}>
          <FileDown className="mr-2 h-4 w-4" />
          Export to PDF
        </Button>
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
