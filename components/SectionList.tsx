import React from "react";
import { Droppable } from "react-beautiful-dnd";
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
    <Droppable droppableId="sections" type="section">
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
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
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
