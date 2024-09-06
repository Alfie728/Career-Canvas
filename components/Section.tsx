import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { GripVertical, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Entry } from "./Entry";
import { Section as SectionType } from "../constants/types";

type SectionProps = {
  section: SectionType;
  index: number;
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

export function Section({
  section,
  index,
  addEntry,
  updateEntry,
  addDetail,
  updateDetail,
  removeEntry,
}: SectionProps) {
  return (
    <Draggable draggableId={section.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`mb-6 border border-gray-200 p-4 rounded-lg ${
            snapshot.isDragging ? "bg-gray-100" : ""
          }`}
        >
          <div className="flex items-center mb-2">
            <div {...provided.dragHandleProps} className="mr-2 cursor-move">
              <GripVertical className="text-gray-400" />
            </div>
            <h2 className="text-xl font-bold">{section.title}</h2>
          </div>
          <Droppable droppableId={section.id} type="entry">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {section.entries.map((entry, entryIndex) => (
                  <Entry
                    key={entry.id}
                    entry={entry}
                    index={entryIndex}
                    sectionId={section.id}
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => addEntry(section.id)}
            className="mt-2"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add {section.title} Entry
          </Button>
        </div>
      )}
    </Draggable>
  );
}
