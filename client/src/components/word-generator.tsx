import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopType, TabStopPosition, BorderStyle } from 'docx';
import type { ResumeData } from '@shared/schema';

export class WordGenerator {
  async generateWord(resumeData: ResumeData, template: string): Promise<void> {
    try {
      const doc = this.createWordDocument(resumeData, template);
      const blob = await Packer.toBlob(doc);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const fileName = `${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}_Resume.docx`.replace(/\s+/g, '_');
      link.download = fileName;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating Word document:', error);
      throw new Error('Failed to generate Word document');
    }
  }

  private createWordDocument(resumeData: ResumeData, template: string): Document {
    const { personalInfo, workExperience, education, skillCategories } = resumeData;
    const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();

    const children: Paragraph[] = [];

    // Header Section
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: fullName || 'Your Name',
            bold: true,
            size: 32,
            color: '1976D2',
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
              color: '666666',
              italics: true,
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
    ].filter(Boolean).join(' • ');

    if (contactInfo) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: contactInfo,
              size: 20,
              color: '666666',
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
              text: 'PROFESSIONAL SUMMARY',
              bold: true,
              size: 24,
              color: '1976D2',
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
          border: {
            bottom: {
              color: 'CCCCCC',
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
              color: '333333',
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
              text: 'WORK EXPERIENCE',
              bold: true,
              size: 24,
              color: '1976D2',
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
          border: {
            bottom: {
              color: 'CCCCCC',
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        })
      );

      workExperience.forEach((exp) => {
        const dateRange = this.formatDateRange(exp.startDate, exp.endDate || '', exp.current);
        
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.title,
                bold: true,
                size: 22,
                color: '333333',
              }),
              new TextRun({
                text: `\t${dateRange}`,
                size: 20,
                color: '666666',
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
                color: '666666',
              }),
              ...(exp.location ? [
                new TextRun({
                  text: ` • ${exp.location}`,
                  size: 20,
                  color: '666666',
                }),
              ] : []),
            ],
            spacing: { after: 100 },
          })
        );

        if (exp.description) {
          const descriptions = exp.description.split('\n').filter(line => line.trim());
          descriptions.forEach((desc) => {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${desc}`,
                    size: 20,
                    color: '333333',
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
              text: 'EDUCATION',
              bold: true,
              size: 24,
              color: '1976D2',
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
          border: {
            bottom: {
              color: 'CCCCCC',
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        })
      );

      education.forEach((edu) => {
        const years = (edu.startYear || edu.endYear) ? 
          `${edu.startYear || ''} ${edu.startYear && edu.endYear ? '- ' : ''} ${edu.endYear || ''}` : '';
        
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${edu.degree} ${edu.field ? `in ${edu.field}` : ''}`,
                bold: true,
                size: 22,
                color: '333333',
              }),
              ...(years ? [
                new TextRun({
                  text: `\t${years}`,
                  size: 20,
                  color: '666666',
                }),
              ] : []),
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
                color: '666666',
              }),
              ...(edu.gpa ? [
                new TextRun({
                  text: ` • GPA: ${edu.gpa}`,
                  size: 20,
                  color: '666666',
                }),
              ] : []),
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
              text: 'TECHNICAL SKILLS',
              bold: true,
              size: 24,
              color: '1976D2',
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
          border: {
            bottom: {
              color: 'CCCCCC',
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
                  color: '333333',
                }),
                new TextRun({
                  text: category.skills.join(', '),
                  size: 20,
                  color: '333333',
                }),
              ],
              spacing: { after: 150 },
            })
          );
        }
      });
    }

    return new Document({
      creator: 'Resume Builder Pro',
      title: `${fullName} Resume`,
      description: 'Professional Resume',
      sections: [
        {
          properties: {},
          children: children,
        },
      ],
    });
  }

  private formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }

  private formatDateRange(startDate: string, endDate: string, current: boolean): string {
    const start = this.formatDate(startDate);
    const end = current ? 'Present' : this.formatDate(endDate);
    return `${start} - ${end}`;
  }
}