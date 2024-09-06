"use client";

import React from "react";
import {
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  CollisionDetection,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

export function useDragAndDrop<T extends { id: string }>(
  items: T[],
  onReorder: (newItems: T[]) => void
) {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [activeType, setActiveType] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id.toString());
    setActiveType(active.data.current?.type || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(items, oldIndex, newIndex);
        onReorder(newItems);
      }
    }
    setActiveId(null);
    setActiveType(null);
  };

  const customCollisionDetection: CollisionDetection = (args) => {
    const { droppableContainers, droppableRects, active } = args;

    if (!active) return [];

    const activeRect = active.rect.current.translated;
    if (!activeRect) return [];

    const dragHandleY = activeRect.top;

    const collisions = [];

    for (const droppableContainer of droppableContainers) {
      const { id } = droppableContainer;
      const rect = droppableRects.get(id);

      if (rect && dragHandleY >= rect.top && dragHandleY <= rect.bottom) {
        collisions.push({
          id,
          data: {
            droppableContainer,
            value: dragHandleY - rect.top,
          },
        });
      }
    }

    collisions.sort((a, b) => a.data.value - b.data.value);

    return collisions.length > 0 ? [collisions[0]] : [];
  };

  return {
    activeId,
    activeType,
    sensors,
    handleDragStart,
    handleDragEnd,
    customCollisionDetection,
  };
}
