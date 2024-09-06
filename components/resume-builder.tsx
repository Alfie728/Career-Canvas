"use client";

import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvided,
  DroppableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import { PlusCircle, GripVertical, X, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

type Entry = {
  id: string;
  title: string;
  subtitle?: string;
  location?: string;
  date?: string;
  details: string[];
};

type Section = {
  id: string;
  title: string;
  entries: Entry[];
};

export function ResumeBuilder() {
  const [personalInfo, setPersonalInfo] = useState({
    name: "FirstName M. LastName",
    contact:
      "US Citizen | zegro728@gmail.com | (61)-0431145927 | LinkedIn: linkedinAlias | GitHub: Alfie728",
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
        {
          id: "edu2",
          title: "South China University of Technology",
          subtitle: "B.S. in Electrical Engineering",
          location: "China",
          date: "September 2018 - June 2022",
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

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (type === "section") {
      const newSections = Array.from(sections);
      const [reorderedSection] = newSections.splice(source.index, 1);
      newSections.splice(destination.index, 0, reorderedSection);
      setSections(newSections);
    } else if (type === "entry") {
      const sectionIndex = sections.findIndex(
        (section) => section.id === source.droppableId
      );
      const newSections = [...sections];
      const [reorderedEntry] = newSections[sectionIndex].entries.splice(
        source.index,
        1
      );
      newSections[sectionIndex].entries.splice(
        destination.index,
        0,
        reorderedEntry
      );
      setSections(newSections);
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

  const exportToPDF = async () => {
    const element = document.getElementById("resume-content");
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("resume.pdf");
  };

  const exportToMarkdown = () => {
    let markdown = `# ${personalInfo.name}\n\n${personalInfo.contact}\n\n`;

    sections.forEach((section) => {
      markdown += `## ${section.title}\n\n`;
      section.entries.forEach((entry) => {
        markdown += `### ${entry.title}\n`;
        markdown += `${entry.subtitle} | ${entry.location} | ${entry.date}\n\n`;
        entry.details.forEach((detail) => {
          markdown += `- ${detail}\n`;
        });
        markdown += "\n";
      });
    });

    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    saveAs(blob, "resume.md");
  };

  const exportToWord = () => {
    const children: Paragraph[] = [
      new Paragraph({
        children: [
          new TextRun({ text: personalInfo.name, bold: true, size: 28 }),
          new TextRun({ text: "\n" + personalInfo.contact, size: 12 }),
        ],
      }),
    ];

    sections.forEach((section) => {
      children.push(
        new Paragraph({
          text: section.title,
          heading: "Heading1",
          thematicBreak: true,
        })
      );

      section.entries.forEach((entry) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: entry.title, bold: true }),
              new TextRun({ text: " | " + entry.location, italics: true }),
              new TextRun({ text: "\n" + entry.subtitle }),
              new TextRun({ text: " | " + entry.date, italics: true }),
            ],
          })
        );

        entry.details.forEach((detail) => {
          children.push(
            new Paragraph({ text: "• " + detail, bullet: { level: 0 } })
          );
        });

        children.push(new Paragraph(""));
      });
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: children,
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "resume.docx");
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 bg-white">
      <div id="resume-content">
        <div className="text-center">
          <Input
            value={personalInfo.name}
            onChange={(e) =>
              setPersonalInfo({ ...personalInfo, name: e.target.value })
            }
            className="text-3xl font-bold mb-2 text-center border-none"
          />
          <Input
            value={personalInfo.contact}
            onChange={(e) =>
              setPersonalInfo({ ...personalInfo, contact: e.target.value })
            }
            className="text-sm text-center border-none"
          />
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="sections" type="section">
            {(provided: DroppableProvided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {sections.map((section, sectionIndex) => (
                  <Draggable
                    key={section.id}
                    draggableId={section.id}
                    index={sectionIndex}
                  >
                    {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`mb-6 border border-gray-200 p-4 rounded-lg ${
                          snapshot.isDragging ? 'bg-gray-100' : ''
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          <div
                            {...provided.dragHandleProps}
                            className="mr-2 cursor-move"
                          >
                            <GripVertical className="text-gray-400" />
                          </div>
                          <h2 className="text-xl font-bold">{section.title}</h2>
                        </div>
                        <Droppable droppableId={section.id} type="entry">
                          {(provided: DroppableProvided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              {section.entries.map((entry, entryIndex) => (
                                <Draggable
                                  key={entry.id}
                                  draggableId={entry.id}
                                  index={entryIndex}
                                >
                                  {(provided: DraggableProvided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className="mb-4 pl-6 border-b border-gray-100 pb-4"
                                    >
                                      <div className="flex items-center mb-2">
                                        <div
                                          {...provided.dragHandleProps}
                                          className="mr-2 cursor-move"
                                        >
                                          <GripVertical className="text-gray-400 h-4 w-4" />
                                        </div>
                                        <div className="flex-grow">
                                          <div className="flex justify-between mb-1">
                                            <Input
                                              value={entry.title}
                                              onChange={(e) =>
                                                updateEntry(
                                                  section.id,
                                                  entry.id,
                                                  "title",
                                                  e.target.value
                                                )
                                              }
                                              className="font-bold w-1/2 border-none"
                                              placeholder="Title"
                                            />
                                            <Input
                                              value={entry.location}
                                              onChange={(e) =>
                                                updateEntry(
                                                  section.id,
                                                  entry.id,
                                                  "location",
                                                  e.target.value
                                                )
                                              }
                                              className="text-right w-1/2 border-none"
                                              placeholder="Location"
                                            />
                                          </div>
                                          <div className="flex justify-between mb-1">
                                            <Input
                                              value={entry.subtitle}
                                              onChange={(e) =>
                                                updateEntry(
                                                  section.id,
                                                  entry.id,
                                                  "subtitle",
                                                  e.target.value
                                                )
                                              }
                                              className="italic w-1/2 border-none"
                                              placeholder="Subtitle"
                                            />
                                            <Input
                                              value={entry.date}
                                              onChange={(e) =>
                                                updateEntry(
                                                  section.id,
                                                  entry.id,
                                                  "date",
                                                  e.target.value
                                                )
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
                                                updateDetail(
                                                  section.id,
                                                  entry.id,
                                                  index,
                                                  e.target.value
                                                )
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
                                          onClick={() =>
                                            addDetail(section.id, entry.id)
                                          }
                                        >
                                          Add Detail
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            removeEntry(section.id, entry.id)
                                          }
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
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
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
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
