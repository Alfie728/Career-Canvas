import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { Section } from "../constants/types";

export function useExport(
  personalInfo: { name: string; contact: string },
  sections: Section[]
) {
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

  return { exportToPDF, exportToMarkdown, exportToWord };
}
