"use client";

import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersonalInfo } from "./PersonalInfo";
import { SectionList } from "./SectionList";
import { useResumeState } from "../hooks/useResumeState";
import { useExport } from "../hooks/useExport";

export function ResumeBuilder() {
  const {
    personalInfo,
    sections,
    updatePersonalInfo,
    onDragEnd,
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

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 bg-white">
      <div id="resume-content">
        <PersonalInfo
          personalInfo={personalInfo}
          updatePersonalInfo={updatePersonalInfo}
        />
        <DragDropContext onDragEnd={onDragEnd}>
          <SectionList
            sections={sections}
            addEntry={addEntry}
            updateEntry={updateEntry}
            addDetail={addDetail}
            updateDetail={updateDetail}
            removeEntry={removeEntry}
          />
        </DragDropContext>
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
