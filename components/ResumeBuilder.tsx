"use client";

import React from "react";
import {
  DndContext,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FileDown, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersonalInfo } from "./PersonalInfo";
import { Section } from "./Section";
import { useResumeState } from "../hooks/useResumeState";
import { useExport } from "../hooks/useExport";
import { Entry } from "./Entry";
import { useDragAndDrop } from "../hooks/useDragAndDrop";

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
    removeDetail,
  } = useResumeState();

  const { exportToMarkdown, exportToWord } = useExport(personalInfo, sections);

  const {
    activeId,
    activeType,
    sensors,
    handleDragStart,
    handleDragEnd,
    customCollisionDetection,
  } = useDragAndDrop(sections, setSections);

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
                removeDetail={() => {}}
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
