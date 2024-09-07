"use client";

import React, { useCallback, useRef, useEffect } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FileDown, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersonalInfo } from "./PersonalInfo";
import { Section } from "./Section";
import { Entry } from "./Entry";
import { FloatingToolbar } from "./FloatingToolbar";
import { useResumeState } from "../hooks/useResumeState";
import { useExport } from "../hooks/useExport";
import { useDragAndDrop } from "../hooks/useDragAndDrop";
import { RichTextAreaRef } from "@/components/ui/RichTextArea";

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

  const richTextAreaRefs = useRef<(RichTextAreaRef | null)[]>([]);

  useEffect(() => {
    // Initialize refs for all RichTextAreas
    richTextAreaRefs.current = sections.flatMap((section) =>
      section.entries.flatMap((entry) => entry.details.map(() => null))
    );
  }, [sections]);

  const applyStyle = useCallback((style: "bold" | "italic" | "underline") => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const parentElement = range.commonAncestorContainer.parentElement;

      if (parentElement) {
        const richTextArea = richTextAreaRefs.current.find(
          (ref) =>
            ref &&
            ref.editorRef.current &&
            ref.editorRef.current.contains(parentElement)
        );
        if (richTextArea) {
          richTextArea.applyStyle(style);
        }
      }
    }
  }, []);

  return (
    <div className="max-w-[1000px] w-[calc(100vw-2rem)] mx-auto p-6 space-y-8 relative">
      <div className="flex">
        <FloatingToolbar onApplyStyle={applyStyle} />
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
              {sections.map((section, sectionIndex) => (
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
                  richTextAreaRefs={richTextAreaRefs}
                  sectionIndex={sectionIndex}
                />
              ))}
            </SortableContext>
            <DragOverlay>
              {activeId && activeType === "section" && (
                <Section
                  section={
                    sections.find((s) => s.id === activeId) || sections[0]
                  }
                  addEntry={addEntry}
                  updateEntry={updateEntry}
                  addDetail={addDetail}
                  updateDetail={updateDetail}
                  removeEntry={removeEntry}
                  updateSectionTitle={updateSectionTitle}
                  removeSection={removeSection}
                  removeDetail={removeDetail}
                  isDragging
                  richTextAreaRefs={richTextAreaRefs}
                  sectionIndex={sections.findIndex((s) => s.id === activeId)}
                />
              )}
              {activeId && activeType === "entry" && (
                <Entry
                  entry={
                    sections
                      .flatMap((s) => s.entries)
                      .find((e) => e.id === activeId)!
                  }
                  sectionId={
                    sections.find((s) =>
                      s.entries.some((e) => e.id === activeId)
                    )?.id || ""
                  }
                  updateEntry={() => {}}
                  addDetail={() => {}}
                  updateDetail={() => {}}
                  removeEntry={() => {}}
                  removeDetail={() => {}}
                  isDragging
                  richTextAreaRefs={richTextAreaRefs}
                  sectionIndex={sections.findIndex((s) =>
                    s.entries.some((e) => e.id === activeId)
                  )}
                  entryIndex={
                    sections
                      .find((s) => s.entries.some((e) => e.id === activeId))
                      ?.entries.findIndex((e) => e.id === activeId) || 0
                  }
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
