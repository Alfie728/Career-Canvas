import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, PlusCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Entry as EntryType } from "../constants/types";

type EntryProps = {
  entry: EntryType;
  sectionId: string;
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

export function Entry({
  entry,
  sectionId,
  updateEntry,
  addDetail,
  updateDetail,
  removeEntry,
}: EntryProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: entry.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="mb-4 pl-6 border-b border-gray-100 pb-4"
    >
      <div className="flex items-center mb-2">
        <div {...listeners} className="mr-2 cursor-move">
          <GripVertical className="text-gray-400 h-4 w-4" />
        </div>
        <div className="flex-grow">
          <div className="flex justify-between mb-1">
            <Input
              value={entry.title}
              onChange={(e) =>
                updateEntry(sectionId, entry.id, "title", e.target.value)
              }
              className="font-bold w-1/2 border-none"
              placeholder="Title"
            />
            <Input
              value={entry.location || ""}
              onChange={(e) =>
                updateEntry(sectionId, entry.id, "location", e.target.value)
              }
              className="text-right w-1/2 border-none"
              placeholder="Location"
            />
          </div>
          <div className="flex justify-between mb-1">
            <Input
              value={entry.subtitle || ""}
              onChange={(e) =>
                updateEntry(sectionId, entry.id, "subtitle", e.target.value)
              }
              className="italic w-1/2 border-none"
              placeholder="Subtitle"
            />
            <Input
              value={entry.date || ""}
              onChange={(e) =>
                updateEntry(sectionId, entry.id, "date", e.target.value)
              }
              className="text-right w-1/2 border-none"
              placeholder="Date"
            />
          </div>
        </div>
      </div>
      <ul className="list-disc pl-5">
        {entry.details.map((detail, index) => (
          <li key={index}>
            <Input
              value={detail}
              onChange={(e) =>
                updateDetail(sectionId, entry.id, index, e.target.value)
              }
              className="w-full border-none"
              placeholder="Detail"
            />
          </li>
        ))}
      </ul>
      <div className="flex justify-between mt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => addDetail(sectionId, entry.id)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Detail
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeEntry(sectionId, entry.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
