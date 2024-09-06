import { useState } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Section } from "../constants/types";

export function useResumeState() {
  const [personalInfo, setPersonalInfo] = useState({
    name: "FirstName M. LastName",
    contact:
      "Citizenship | email@email.com | (01)-234-567-8900 | LinkedIn: LinkedinAlias | GitHub: GitHubAlias",
  });

  const [sections, setSections] = useState<Section[]>([
    {
      id: "education",
      title: "EDUCATION",
      entries: [
        {
          id: "edu1",
          title: "University of New South Wales",
          subtitle: "M.S. in Information Technology",
          location: "Sydney, Australia",
          date: "Expected Graduation, August 2026",
          details: [],
        },
      ],
    },
    {
      id: "experience",
      title: "EXPERIENCE",
      entries: [
        {
          id: "exp1",
          title: "Amazon.com",
          subtitle: "Software Development Engineering Intern",
          location: "New York, New York",
          date: "May 2020 – Aug 2020",
          details: [
            "Created Python scripts to construct a pipeline that retrieved performance data from the AWS cross-regional team",
            "Developed various stacks on Node.js for data sources such as CloudWatch, Bindles DataLake, and DynamoDB",
            "Utilized various AWS resources such as Glue Crawlers, S3, Lambda, RedShift, and Quicksight to develop a dashboard displaying real time metrics",
          ],
        },
      ],
    },
    { id: "projects", title: "PROJECTS", entries: [] },
    { id: "activities", title: "ACTIVITIES AND LEADERSHIP", entries: [] },
    { id: "skills", title: "SKILLS", entries: [] },
  ]);

  const updatePersonalInfo = (field: string, value: string) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSections((sections) => {
        const oldIndex = sections.findIndex((s) => s.id === active.id);
        const newIndex = sections.findIndex((s) => s.id === over?.id);

        return arrayMove(sections, oldIndex, newIndex);
      });
    }
  };

  const addEntry = (sectionId: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              entries: [
                ...section.entries,
                {
                  id: Date.now().toString(),
                  title: "",
                  subtitle: "",
                  location: "",
                  date: "",
                  details: [],
                },
              ],
            }
          : section
      )
    );
  };

  const updateEntry = (
    sectionId: string,
    entryId: string,
    field: string,
    value: string
  ) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              entries: section.entries.map((entry) =>
                entry.id === entryId ? { ...entry, [field]: value } : entry
              ),
            }
          : section
      )
    );
  };

  const addDetail = (sectionId: string, entryId: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              entries: section.entries.map((entry) =>
                entry.id === entryId
                  ? { ...entry, details: [...entry.details, ""] }
                  : entry
              ),
            }
          : section
      )
    );
  };

  const updateDetail = (
    sectionId: string,
    entryId: string,
    index: number,
    value: string
  ) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              entries: section.entries.map((entry) =>
                entry.id === entryId
                  ? {
                      ...entry,
                      details: entry.details.map((detail, i) =>
                        i === index ? value : detail
                      ),
                    }
                  : entry
              ),
            }
          : section
      )
    );
  };

  const removeEntry = (sectionId: string, entryId: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              entries: section.entries.filter((entry) => entry.id !== entryId),
            }
          : section
      )
    );
  };

  return {
    personalInfo,
    sections,
    setSections, // Add this line
    updatePersonalInfo,
    onDragEnd,
    addEntry,
    updateEntry,
    addDetail,
    updateDetail,
    removeEntry,
  };
}
