import React, { useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, PlusCircle, Trash2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RichTextArea, RichTextAreaRef } from "@/components/ui/RichTextArea";
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
  richTextAreaRefs: React.MutableRefObject<(RichTextAreaRef | null)[]>;
  sectionIndex: number;
  entryIndex: number;
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
  richTextAreaRefs,
  sectionIndex,
  entryIndex,
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

  useEffect(() => {
    const startIndex = sectionIndex * entry.details.length * entryIndex;
    entry.details.forEach((_, detailIndex) => {
      richTextAreaRefs.current[startIndex + detailIndex] = null;
    });
  }, [entry.details, richTextAreaRefs, sectionIndex, entryIndex]);

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
          className="pt-2.5 cursor-move self-center mr-2"
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
            className="font-bold text-right border-none bg-transparent p-2"
            placeholder="Additional Details (Organizations, places, etc.)"
          />
          <Input
            value={entry.subtitle || ""}
            onChange={(e) =>
              updateEntry(sectionId, entry.id, "subtitle", e.target.value)
            }
            className="border-none bg-transparent p-2 italic"
            placeholder="Subtitle"
          />
          <Input
            value={entry.date || ""}
            onChange={(e) =>
              updateEntry(sectionId, entry.id, "date", e.target.value)
            }
            className="italic text-right border-none bg-transparent p-2"
            placeholder="Additional Details (Dates, time periods, etc.)"
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
        {entry.details.map((detail, detailIndex) => (
          <li key={detailIndex} className="flex items-center">
            <Circle className="h-2 w-2 mx-2 ml-4 flex-shrink-0 fill-current justify-center" />
            <RichTextArea
              ref={(el) => {
                if (el) {
                  const index = sectionIndex * entry.details.length * entryIndex + detailIndex;
                  richTextAreaRefs.current[index] = el;
                }
              }}
              value={detail}
              onChange={(value) =>
                updateDetail(sectionId, entry.id, detailIndex, value)
              }
              className="flex-grow border-none bg-transparent p-2 rich-text-area"
              placeholder="Detail"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeDetail(sectionId, entry.id, detailIndex)}
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
          className="ml-10"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Detail
        </Button>
      </div>
    </div>
  );
}
