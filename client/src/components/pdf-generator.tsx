import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { ResumeData } from '@shared/schema';

export class PDFGenerator {
  async generatePDF(resumeData: ResumeData, template: string): Promise<void> {
    try {
      // Create a temporary div to render the resume
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '8.5in';
      tempDiv.style.minHeight = '11in';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.fontFamily = 'Inter, sans-serif';
      
      // Generate the resume HTML content
      tempDiv.innerHTML = this.generateResumeHTML(resumeData, template);
      document.body.appendChild(tempDiv);

      // Convert to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Remove temporary div
      document.body.removeChild(tempDiv);

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('portrait', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      const fileName = `${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}_Resume.pdf`.replace(/\s+/g, '_');
      pdf.save(fileName);

    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  private generateResumeHTML(resumeData: ResumeData, template: string): string {
    const { personalInfo, workExperience, education, skillCategories } = resumeData;
    const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();

    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    };

    const formatDateRange = (startDate: string, endDate: string, current: boolean) => {
      const start = formatDate(startDate);
      const end = current ? 'Present' : formatDate(endDate);
      return `${start} - ${end}`;
    };

    // Modern template HTML
    if (template === 'modern' || !template) {
      return `
        <div style="padding: 32px; font-family: Inter, sans-serif; line-height: 1.5;">
          <!-- Header Section -->
          <div style="text-align: center; border-bottom: 2px solid #1976D2; padding-bottom: 24px; margin-bottom: 24px;">
            <h1 style="font-size: 32px; font-weight: bold; color: #424242; margin-bottom: 8px;">
              ${fullName || 'Your Name'}
            </h1>
            ${personalInfo.title ? `<p style="font-size: 20px; color: #666; margin-bottom: 16px;">${personalInfo.title}</p>` : ''}
            
            <div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 16px; font-size: 14px; color: #666;">
              ${personalInfo.email ? `<span>${personalInfo.email}</span>` : ''}
              ${personalInfo.email && personalInfo.phone ? '<span>•</span>' : ''}
              ${personalInfo.phone ? `<span>${personalInfo.phone}</span>` : ''}
              ${(personalInfo.email || personalInfo.phone) && personalInfo.address ? '<span>•</span>' : ''}
              ${personalInfo.address ? `<span>${personalInfo.address}</span>` : ''}
              ${(personalInfo.email || personalInfo.phone || personalInfo.address) && personalInfo.linkedin ? '<span>•</span>' : ''}
              ${personalInfo.linkedin ? `<span>${personalInfo.linkedin}</span>` : ''}
            </div>
          </div>

          <!-- Professional Summary -->
          ${personalInfo.summary ? `
            <div style="margin-bottom: 24px;">
              <h2 style="font-size: 18px; font-weight: 600; color: #1976D2; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 12px;">
                PROFESSIONAL SUMMARY
              </h2>
              <p style="color: #555; line-height: 1.6;">${personalInfo.summary}</p>
            </div>
          ` : ''}

          <!-- Work Experience -->
          ${workExperience.length > 0 ? `
            <div style="margin-bottom: 24px;">
              <h2 style="font-size: 18px; font-weight: 600; color: #1976D2; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 12px;">
                WORK EXPERIENCE
              </h2>
              ${workExperience.map(exp => `
                <div style="margin-bottom: 16px;">
                  <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                    <div>
                      <h3 style="font-weight: 600; color: #424242; margin: 0;">${exp.title}</h3>
                      <p style="color: #666; margin: 0;">${exp.company}</p>
                    </div>
                    <div style="text-align: right; font-size: 14px; color: #666;">
                      <p style="margin: 0;">${formatDateRange(exp.startDate, exp.endDate || '', exp.current)}</p>
                      ${exp.location ? `<p style="margin: 0;">${exp.location}</p>` : ''}
                    </div>
                  </div>
                  ${exp.description ? `
                    <div style="font-size: 14px; color: #555; margin-left: 16px;">
                      ${exp.description.split('\n').map(line => `<p style="margin-bottom: 4px;">${line}</p>`).join('')}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}

          <!-- Education -->
          ${education.length > 0 ? `
            <div style="margin-bottom: 24px;">
              <h2 style="font-size: 18px; font-weight: 600; color: #1976D2; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 12px;">
                EDUCATION
              </h2>
              ${education.map(edu => `
                <div style="margin-bottom: 12px;">
                  <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                      <h3 style="font-weight: 600; color: #424242; margin: 0;">
                        ${edu.degree} ${edu.field ? `in ${edu.field}` : ''}
                      </h3>
                      <p style="color: #666; margin: 0;">${edu.institution}</p>
                    </div>
                    <div style="text-align: right; font-size: 14px; color: #666;">
                      ${(edu.startYear || edu.endYear) ? `
                        <p style="margin: 0;">
                          ${edu.startYear || ''} ${edu.startYear && edu.endYear ? '- ' : ''} ${edu.endYear || ''}
                        </p>
                      ` : ''}
                      ${edu.gpa ? `<p style="margin: 0;">GPA: ${edu.gpa}</p>` : ''}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <!-- Skills -->
          ${skillCategories.length > 0 ? `
            <div style="margin-bottom: 24px;">
              <h2 style="font-size: 18px; font-weight: 600; color: #1976D2; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 12px;">
                TECHNICAL SKILLS
              </h2>
              ${skillCategories.map(category => `
                <div style="margin-bottom: 12px;">
                  <div style="display: flex; align-items: start;">
                    <h4 style="font-weight: 500; color: #424242; width: 128px; flex-shrink: 0; margin: 0;">
                      ${category.name}:
                    </h4>
                    <p style="color: #555; font-size: 14px; margin: 0;">
                      ${category.skills.join(', ')}
                    </p>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `;
    }

    // Return modern template as fallback
    return this.generateResumeHTML(resumeData, 'modern');
  }
}
