import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  removeDetail: (sectionId: string, entryId: string, index: number) => void;
  isDragging?: boolean;
};

export function Entry({
  entry,
  sectionId,
  updateEntry,
  addDetail,
  updateDetail,
  removeEntry,
  removeDetail,
  isDragging = false,
}: EntryProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: entry.id, data: { type: "entry" } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-4 pl-6 border-b border-border pb-4"
    >
      <div className="flex items-center mb-2">
        <div
          {...attributes}
          {...listeners}
          className="pt-2.5 cursor-move self-start"
        >
          <GripVertical className="text-muted-foreground h-4 w-4" />
        </div>
        <div className="flex-grow grid grid-cols-2 gap-2">
          <Input
            value={entry.title}
            onChange={(e) =>
              updateEntry(sectionId, entry.id, "title", e.target.value)
            }
            className="font-bold border-none bg-transparent p-2"
            placeholder="Title"
          />
          <Input
            value={entry.location || ""}
            onChange={(e) =>
              updateEntry(sectionId, entry.id, "location", e.target.value)
            }
            className="text-right border-none bg-transparent p-2"
            placeholder="Location"
          />
          <Input
            value={entry.subtitle || ""}
            onChange={(e) =>
              updateEntry(sectionId, entry.id, "subtitle", e.target.value)
            }
            className="italic border-none bg-transparent p-2"
            placeholder="Subtitle"
          />
          <Input
            value={entry.date || ""}
            onChange={(e) =>
              updateEntry(sectionId, entry.id, "date", e.target.value)
            }
            className="text-right border-none bg-transparent p-2"
            placeholder="Date"
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeEntry(sectionId, entry.id)}
          className="text-muted-foreground ml-2"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <ul className="list-disc pl-4 text-foreground space-y-1 pr-8">
        {entry.details.map((detail, index) => (
          <li key={index} className="flex items-center">
            <Textarea
              value={detail}
              onChange={(e) =>
                updateDetail(sectionId, entry.id, index, e.target.value)
              }
              className="flex-grow border-none bg-transparent p-2"
              placeholder="Detail"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeDetail(sectionId, entry.id, index)}
              className="text-muted-foreground mx-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
      <div className="flex justify-between mt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => addDetail(sectionId, entry.id)}
          className="ml-5"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Detail
        </Button>
      </div>
    </div>
  );
}
