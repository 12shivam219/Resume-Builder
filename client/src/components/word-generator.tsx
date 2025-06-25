import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  TabStopType,
  TabStopPosition,
  BorderStyle,
} from "docx";
import type { ResumeData } from "@shared/schema";

export class WordGenerator {
  async generateWord(resumeData: ResumeData, template: string): Promise<void> {
    try {
      const doc = this.createWordDocument(resumeData, template);
      const blob = await Packer.toBlob(doc);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const fileName =
        `${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}_Resume.docx`.replace(
          /\s+/g,
          "_"
        );
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating Word document:", error);
      throw new Error("Failed to generate Word document");
    }
  }

  private createWordDocument(
    resumeData: ResumeData,
    template: string
  ): Document {
    const { personalInfo, workExperience, education, skillCategories } =
      resumeData;
    const fullName =
      `${personalInfo.firstName} ${personalInfo.lastName}`.trim();

    // Template-specific style variables
    let headingColor = "1976D2";
    let headingFont = undefined;
    let bodyFont = undefined;
    let titleColor = "666666";
    let sectionSpacing = 400;
    let summaryHeadingSize = 24;
    let sectionHeadingSize = 24;
    let nameSize = 32;
    let nameColor = "1976D2";
    let borderColor = "CCCCCC";
    let bodyColor = "333333";
    let contactSeparator = " • ";

    // Switch for template styles
    switch (template) {
      case "classic":
        headingColor = "222222";
        nameColor = "222222";
        titleColor = "444444";
        bodyColor = "222222";
        borderColor = "BBBBBB";
        headingFont = "Times New Roman";
        bodyFont = "Times New Roman";
        contactSeparator = "\n";
        break;
      case "minimal":
        headingColor = "222222";
        nameColor = "222222";
        titleColor = "444444";
        bodyColor = "222222";
        borderColor = "BBBBBB";
        headingFont = "Arial";
        bodyFont = "Arial";
        contactSeparator = " | ";
        break;
      case "elegant":
        headingColor = "b48eae";
        nameColor = "b48eae";
        titleColor = "555555";
        bodyColor = "222222";
        borderColor = "BBBBBB";
        headingFont = "Georgia";
        bodyFont = "Georgia";
        contactSeparator = " | ";
        break;
      case "ats":
        headingColor = "111111";
        nameColor = "111111";
        titleColor = "333333";
        bodyColor = "111111";
        borderColor = "BBBBBB";
        headingFont = "Arial";
        bodyFont = "Arial";
        contactSeparator = " | ";
        break;
      case "infographic":
        headingColor = "1976D2";
        nameColor = "1976D2";
        titleColor = "666666";
        bodyColor = "222222";
        borderColor = "BBBBBB";
        headingFont = "Segoe UI";
        bodyFont = "Segoe UI";
        contactSeparator = " | ";
        break;
      case "bwminimal":
        headingColor = "000000";
        nameColor = "000000";
        titleColor = "222222";
        bodyColor = "000000";
        borderColor = "BBBBBB";
        headingFont = "Courier New";
        bodyFont = "Courier New";
        contactSeparator = " | ";
        break;
      default:
        // modern
        break;
    }

    const children: Paragraph[] = [];

    // Header Section
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: fullName || "Your Name",
            bold: true,
            size: nameSize,
            color: nameColor,
            font: headingFont,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );

    if (personalInfo.title) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: personalInfo.title,
              size: 24,
              color: titleColor,
              italics: true,
              font: bodyFont,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
        })
      );
    }

    // Contact Information
    const contactInfo = [
      personalInfo.email,
      personalInfo.phone,
      personalInfo.address,
      personalInfo.linkedin,
    ]
      .filter(Boolean)
      .join(contactSeparator);

    if (contactInfo) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: contactInfo,
              size: 20,
              color: titleColor,
              font: bodyFont,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        })
      );
    }

    // Professional Summary
    if (personalInfo.summary) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "PROFESSIONAL SUMMARY",
              bold: true,
              size: summaryHeadingSize,
              color: headingColor,
              font: headingFont,
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: sectionSpacing, after: 200 },
          border: {
            bottom: {
              color: borderColor,
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: personalInfo.summary,
              size: 22,
              color: bodyColor,
              font: bodyFont,
            }),
          ],
          spacing: { after: 400 },
        })
      );
    }

    // Work Experience
    if (workExperience.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "WORK EXPERIENCE",
              bold: true,
              size: sectionHeadingSize,
              color: headingColor,
              font: headingFont,
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: sectionSpacing, after: 200 },
          border: {
            bottom: {
              color: borderColor,
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        })
      );

      workExperience.forEach((exp) => {
        const dateRange = this.formatDateRange(
          exp.startDate,
          exp.endDate || "",
          exp.current
        );
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.title,
                bold: true,
                size: 22,
                color: bodyColor,
                font: headingFont,
              }),
              new TextRun({
                text: `\t${dateRange}`,
                size: 20,
                color: titleColor,
                font: bodyFont,
              }),
            ],
            spacing: { before: 200, after: 100 },
            tabStops: [
              {
                type: TabStopType.RIGHT,
                position: TabStopPosition.MAX,
              },
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: exp.company,
                size: 20,
                color: titleColor,
                font: bodyFont,
              }),
              ...(exp.location
                ? [
                    new TextRun({
                      text: ` • ${exp.location}`,
                      size: 20,
                      color: titleColor,
                      font: bodyFont,
                    }),
                  ]
                : []),
            ],
            spacing: { after: 100 },
          })
        );
        if (exp.description) {
          const descriptions = exp.description
            .split("\n")
            .filter((line) => line.trim());
          descriptions.forEach((desc) => {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${desc}`,
                    size: 20,
                    color: bodyColor,
                    font: bodyFont,
                  }),
                ],
                spacing: { after: 100 },
                indent: { left: 400 },
              })
            );
          });
        }
        children.push(new Paragraph({ spacing: { after: 200 } }));
      });
    }

    // Education
    if (education.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "EDUCATION",
              bold: true,
              size: sectionHeadingSize,
              color: headingColor,
              font: headingFont,
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: sectionSpacing, after: 200 },
          border: {
            bottom: {
              color: borderColor,
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        })
      );
      education.forEach((edu) => {
        const years =
          edu.startYear || edu.endYear
            ? `${edu.startYear || ""} ${
                edu.startYear && edu.endYear ? "- " : ""
              } ${edu.endYear || ""}`
            : "";
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${edu.degree} ${edu.field ? `in ${edu.field}` : ""}`,
                bold: true,
                size: 22,
                color: bodyColor,
                font: headingFont,
              }),
              ...(years
                ? [
                    new TextRun({
                      text: `\t${years}`,
                      size: 20,
                      color: titleColor,
                      font: bodyFont,
                    }),
                  ]
                : []),
            ],
            spacing: { before: 200, after: 100 },
            tabStops: [
              {
                type: TabStopType.RIGHT,
                position: TabStopPosition.MAX,
              },
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: edu.institution,
                size: 20,
                color: titleColor,
                font: bodyFont,
              }),
              ...(edu.gpa
                ? [
                    new TextRun({
                      text: ` • GPA: ${edu.gpa}`,
                      size: 20,
                      color: titleColor,
                      font: bodyFont,
                    }),
                  ]
                : []),
            ],
            spacing: { after: 200 },
          })
        );
      });
    }

    // Skills
    if (skillCategories.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "TECHNICAL SKILLS",
              bold: true,
              size: sectionHeadingSize,
              color: headingColor,
              font: headingFont,
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: sectionSpacing, after: 200 },
          border: {
            bottom: {
              color: borderColor,
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        })
      );
      skillCategories.forEach((category) => {
        if (category.skills.length > 0) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${category.name}: `,
                  bold: true,
                  size: 20,
                  color: bodyColor,
                  font: headingFont,
                }),
                new TextRun({
                  text: category.skills.join(", "),
                  size: 20,
                  color: bodyColor,
                  font: bodyFont,
                }),
              ],
              spacing: { after: 150 },
            })
          );
        }
      });
    }

    return new Document({
      creator: "Resume Builder Pro",
      title: `${fullName} Resume`,
      description: "Professional Resume",
      sections: [
        {
          properties: {},
          children: children,
        },
      ],
    });
  }

  private formatDate(dateStr: string): string {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  }

  private formatDateRange(
    startDate: string,
    endDate: string,
    current: boolean
  ): string {
    const start = this.formatDate(startDate);
    const end = current ? "Present" : this.formatDate(endDate);
    return `${start} - ${end}`;
  }
}
