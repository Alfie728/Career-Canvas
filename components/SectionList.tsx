import React from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Section } from "./Section";
import { Section as SectionType } from "../constants/types";

type SectionListProps = {
  sections: SectionType[];
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
};

export function SectionList({
  sections,
  addEntry,
  updateEntry,
  addDetail,
  updateDetail,
  removeEntry,
}: SectionListProps) {
  return (
    <SortableContext
      items={sections.map(section => section.id)}
      strategy={verticalListSortingStrategy}
    >
      {sections.map((section, index) => (
        <Section
          key={section.id}
          section={section}
          index={index}
          addEntry={addEntry}
          updateEntry={updateEntry}
          addDetail={addDetail}
          updateDetail={updateDetail}
          removeEntry={removeEntry}
        />
      ))}
    </SortableContext>
  );
}
