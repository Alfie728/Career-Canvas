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
          location: "New York",
          date: "May 2020 – Aug 2020",
          details: [
            "Created Python scripts to construct a pipeline that retrieved performance data from the AWS cross-regional team",
            "Developed various stacks on Node.js for data sources such as CloudWatch, Bindles DataLake, and DynamoDB",
            "Utilized various AWS resources such as Glue Crawlers, S3, Lambda, RedShift, and Quicksight to develop a dashboard displaying real time metrics",
          ],
        },
      ],
    },
    {
      id: "projects",
      title: "PROJECTS",
      entries: [
        {
          id: "proj1",
          title: "Personal Portfolio Website",
          subtitle: "Full-Stack Web Development",
          date: "Jan 2023 - Present",
          details: [
            "Designed and developed a responsive personal portfolio website using React and Next.js",
            "Implemented a custom CMS for easy content management using Sanity.io",
            "Utilized Tailwind CSS for efficient and responsive styling",
          ],
        },
        {
          id: "proj2",
          title: "Machine Learning Image Classifier",
          subtitle: "Python, TensorFlow",
          date: "Sep 2022 - Dec 2022",
          details: [
            "Built an image classification model using TensorFlow and Keras",
            "Trained the model on a dataset of 10,000 images across 10 categories",
            "Achieved 92% accuracy on the test set",
          ],
        },
      ],
    },
    {
      id: "activities",
      title: "ACTIVITIES AND LEADERSHIP",
      entries: [
        {
          id: "act1",
          title: "Computer Science Student Association",
          subtitle: "Vice President",
          location: "University of New South Wales",
          date: "Sep 2022 - Present",
          details: [
            "Organize weekly coding workshops and tech talks for over 200 members",
            "Manage a team of 5 committee members to plan and execute events",
            "Increased member engagement by 30% through new initiatives and social media outreach",
          ],
        },
        {
          id: "act2",
          title: "Hackathon Participant",
          subtitle: "Team Leader",
          location: "Various Events",
          date: "2021 - Present",
          details: [
            "Participated in 5 hackathons, leading teams of 3-4 members",
            "Won 'Best Use of AI' award at University Tech Challenge 2022",
            "Developed prototype solutions for real-world problems in 24-48 hour timeframes",
          ],
        },
      ],
    },
    {
      id: "skills",
      title: "SKILLS",
      entries: [
        {
          id: "skill1",
          title: "Programming Languages",
          details: ["Python, JavaScript, TypeScript, Java, C++, SQL"],
        },
        {
          id: "skill2",
          title: "Web Technologies",
          details: [
            "React, Next.js, Node.js, Express, HTML5, CSS3, Tailwind CSS",
          ],
        },
        {
          id: "skill3",
          title: "Tools & Platforms",
          details: ["Git, Docker, AWS, Firebase, MongoDB, PostgreSQL"],
        },
        {
          id: "skill4",
          title: "Soft Skills",
          details: [
            "Team Leadership, Project Management, Public Speaking, Problem Solving",
          ],
        },
      ],
    },
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

  const addSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: "New Section",
      entries: [],
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (sectionId: string) => {
    setSections(sections.filter((section) => section.id !== sectionId));
  };

  const updateSectionTitle = (sectionId: string, title: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId ? { ...section, title } : section
      )
    );
  };
  const removeDetail = (sectionId: string, entryId: string, index: number) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              entries: section.entries.map((entry) =>
                entry.id === entryId
                  ? {
                      ...entry,
                      details: entry.details.filter((_, i) => i !== index),
                    }
                  : entry
              ),
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
    addSection,
    removeSection,
    updateSectionTitle,
    removeDetail,
  };
}
