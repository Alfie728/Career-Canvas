import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  TabStopType,
} from "docx";
import { Section } from "../constants/types";

export function useExport(
  personalInfo: { name: string; contact: string },
  sections: Section[]
) {
  const createDocumentContent = () => {
    const children: Paragraph[] = [
      new Paragraph({
        children: [
          new TextRun({ text: personalInfo.name, bold: true, size: 28 }),
        ],
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        children: [new TextRun({ text: personalInfo.contact, size: 20 })],
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({ spacing: { after: 200 } }), // Add space after personal info
    ];

    sections.forEach((section) => {
      children.push(
        new Paragraph({
          text: section.title.toUpperCase(),
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 40 }, // Minimal space after the heading
          border: {
            bottom: {
              color: "auto",
              space: 1,
              style: "single",
              size: 6,
            },
          },
        })
      );

      section.entries.forEach((entry) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: entry.title, bold: true }),
              new TextRun({ text: "\t" }), // Tab
              new TextRun({ text: entry.location || "", italics: true }),
            ],
            tabStops: [
              {
                type: TabStopType.RIGHT,
                position: 9000,
              },
            ],
            spacing: { before: 100 }, // Add some space before each entry
          }),
          new Paragraph({
            children: [
              new TextRun({ text: entry.subtitle || "" }),
              new TextRun({ text: "\t" }), // Tab
              new TextRun({ text: entry.date || "", italics: true }),
            ],
            tabStops: [
              {
                type: TabStopType.RIGHT,
                position: 9000,
              },
            ],
          })
        );

        entry.details.forEach((detail) => {
          children.push(
            new Paragraph({
              text: detail,
              bullet: { level: 0 },
              indent: { left: 720 }, // Indent bullets
            })
          );
        });

        children.push(new Paragraph({ spacing: { after: 100 } })); // Reduced space after each entry
      });
    });

    return children;
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
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: createDocumentContent(),
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "resume.docx");
    });
  };

  return { exportToMarkdown, exportToWord };
}
