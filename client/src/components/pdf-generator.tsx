import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { ResumeData } from "@shared/schema";

export class PDFGenerator {
  async generatePDF(resumeData: ResumeData, template: string): Promise<void> {
    try {
      // Create a temporary div to render the resume
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.width = "8.5in";
      tempDiv.style.minHeight = "11in";
      tempDiv.style.backgroundColor = "white";
      tempDiv.style.fontFamily = "Inter, sans-serif";

      // Generate the resume HTML content
      tempDiv.innerHTML = this.generateResumeHTML(resumeData, template);
      document.body.appendChild(tempDiv);

      // Convert to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      // Remove temporary div
      document.body.removeChild(tempDiv);

      // Create PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("portrait", "mm", "a4");

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      const fileName =
        `${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}_Resume.pdf`.replace(
          /\s+/g,
          "_"
        );
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw new Error("Failed to generate PDF");
    }
  }

  private generateResumeHTML(resumeData: ResumeData, template: string): string {
    const { personalInfo, workExperience, education, skillCategories } =
      resumeData;
    const fullName =
      `${personalInfo.firstName} ${personalInfo.lastName}`.trim();

    const formatDate = (dateStr: string) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
    };

    const formatDateRange = (
      startDate: string,
      endDate: string,
      current: boolean
    ) => {
      const start = formatDate(startDate);
      const end = current ? "Present" : formatDate(endDate);
      return `${start} - ${end}`;
    };

    // Modern template HTML
    if (template === "modern" || !template) {
      return `
        <div style="padding: 32px; font-family: Inter, sans-serif; line-height: 1.5;">
          <!-- Header Section -->
          <div style="text-align: center; border-bottom: 2px solid #1976D2; padding-bottom: 24px; margin-bottom: 24px;">
            <h1 style="font-size: 32px; font-weight: bold; color: #424242; margin-bottom: 8px;">
              ${fullName || "Your Name"}
            </h1>
            ${
              personalInfo.title
                ? `<p style="font-size: 20px; color: #666; margin-bottom: 16px;">${personalInfo.title}</p>`
                : ""
            }
            
            <div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 16px; font-size: 14px; color: #666;">
              ${personalInfo.email ? `<span>${personalInfo.email}</span>` : ""}
              ${
                personalInfo.email && personalInfo.phone ? "<span>•</span>" : ""
              }
              ${personalInfo.phone ? `<span>${personalInfo.phone}</span>` : ""}
              ${
                (personalInfo.email || personalInfo.phone) &&
                personalInfo.address
                  ? "<span>•</span>"
                  : ""
              }
              ${
                personalInfo.address
                  ? `<span>${personalInfo.address}</span>`
                  : ""
              }
              ${
                (personalInfo.email ||
                  personalInfo.phone ||
                  personalInfo.address) &&
                personalInfo.linkedin
                  ? "<span>•</span>"
                  : ""
              }
              ${
                personalInfo.linkedin
                  ? `<span>${personalInfo.linkedin}</span>`
                  : ""
              }
            </div>
          </div>

          <!-- Professional Summary -->
          ${
            personalInfo.summary
              ? `
            <div style="margin-bottom: 24px;">
              <h2 style="font-size: 18px; font-weight: 600; color: #1976D2; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 12px;">
                PROFESSIONAL SUMMARY
              </h2>
              <p style="color: #555; line-height: 1.6;">${personalInfo.summary}</p>
            </div>
          `
              : ""
          }

          <!-- Work Experience -->
          ${
            workExperience.length > 0
              ? `
            <div style="margin-bottom: 24px;">
              <h2 style="font-size: 18px; font-weight: 600; color: #1976D2; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 12px;">
                WORK EXPERIENCE
              </h2>
              ${workExperience
                .map(
                  (exp) => `
                <div style="margin-bottom: 16px;">
                  <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                    <div>
                      <h3 style="font-weight: 600; color: #424242; margin: 0;">${
                        exp.title
                      }</h3>
                      <p style="color: #666; margin: 0;">${exp.company}</p>
                    </div>
                    <div style="text-align: right; font-size: 14px; color: #666;">
                      <p style="margin: 0;">${formatDateRange(
                        exp.startDate,
                        exp.endDate || "",
                        exp.current
                      )}</p>
                      ${
                        exp.location
                          ? `<p style="margin: 0;">${exp.location}</p>`
                          : ""
                      }
                    </div>
                  </div>
                  ${
                    exp.description
                      ? `
                    <div style="font-size: 14px; color: #555; margin-left: 16px;">
                      ${exp.description
                        .split("\n")
                        .map(
                          (line) => `<p style="margin-bottom: 4px;">${line}</p>`
                        )
                        .join("")}
                    </div>
                  `
                      : ""
                  }
                </div>
              `
                )
                .join("")}
            </div>
          `
              : ""
          }

          <!-- Education -->
          ${
            education.length > 0
              ? `
            <div style="margin-bottom: 24px;">
              <h2 style="font-size: 18px; font-weight: 600; color: #1976D2; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 12px;">
                EDUCATION
              </h2>
              ${education
                .map(
                  (edu) => `
                <div style="margin-bottom: 12px;">
                  <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                      <h3 style="font-weight: 600; color: #424242; margin: 0;">
                        ${edu.degree} ${edu.field ? `in ${edu.field}` : ""}
                      </h3>
                      <p style="color: #666; margin: 0;">${edu.institution}</p>
                    </div>
                    <div style="text-align: right; font-size: 14px; color: #666;">
                      ${
                        edu.startYear || edu.endYear
                          ? `
                        <p style="margin: 0;">
                          ${edu.startYear || ""} ${
                              edu.startYear && edu.endYear ? "- " : ""
                            } ${edu.endYear || ""}
                        </p>
                      `
                          : ""
                      }
                      ${
                        edu.gpa
                          ? `<p style="margin: 0;">GPA: ${edu.gpa}</p>`
                          : ""
                      }
                    </div>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          `
              : ""
          }

          <!-- Skills -->
          ${
            skillCategories.length > 0
              ? `
            <div style="margin-bottom: 24px;">
              <h2 style="font-size: 18px; font-weight: 600; color: #1976D2; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 12px;">
                TECHNICAL SKILLS
              </h2>
              ${skillCategories
                .map(
                  (category) => `
                <div style="margin-bottom: 12px;">
                  <div style="display: flex; align-items: start;">
                    <h4 style="font-weight: 500; color: #424242; width: 128px; flex-shrink: 0; margin: 0;">
                      ${category.name}:
                    </h4>
                    <p style="color: #555; font-size: 14px; margin: 0;">
                      ${category.skills.join(", ")}
                    </p>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          `
              : ""
          }
        </div>
      `;
    }

    // Classic template HTML
    if (template === "classic") {
      return `
        <div style="padding: 32px; font-family: 'Times New Roman', Times, serif; line-height: 1.5; background: #fff;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 36px; font-weight: bold; color: #222; margin-bottom: 8px;">${
              fullName || "Your Name"
            }</h1>
            ${
              personalInfo.title
                ? `<p style="font-size: 20px; color: #444; font-style: italic; margin-bottom: 12px;">${personalInfo.title}</p>`
                : ""
            }
            <div style="font-size: 15px; color: #555;">
              ${personalInfo.email ? `<div>${personalInfo.email}</div>` : ""}
              ${personalInfo.phone ? `<div>${personalInfo.phone}</div>` : ""}
              ${
                personalInfo.address ? `<div>${personalInfo.address}</div>` : ""
              }
              ${
                personalInfo.linkedin
                  ? `<div>${personalInfo.linkedin}</div>`
                  : ""
              }
            </div>
          </div>
          ${
            personalInfo.summary
              ? `<div style="margin-bottom: 24px;"><h2 style="font-size: 18px; font-weight: 700; color: #222; border-bottom: 1px solid #bbb; padding-bottom: 4px; margin-bottom: 10px;">PROFESSIONAL SUMMARY</h2><p style="color: #444;">${personalInfo.summary}</p></div>`
              : ""
          }
          ${
            workExperience.length > 0
              ? `<div style="margin-bottom: 24px;"><h2 style="font-size: 18px; font-weight: 700; color: #222; border-bottom: 1px solid #bbb; padding-bottom: 4px; margin-bottom: 10px;">WORK EXPERIENCE</h2>${workExperience
                  .map(
                    (exp) =>
                      `<div style="margin-bottom: 14px;"><div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 4px;"><div><h3 style="font-weight: 700; color: #222; margin: 0;">${
                        exp.title
                      }</h3><p style="color: #444; margin: 0;">${
                        exp.company
                      }</p></div><div style="text-align: right; font-size: 14px; color: #555;"><p style="margin: 0;">${formatDateRange(
                        exp.startDate,
                        exp.endDate || "",
                        exp.current
                      )}</p>${
                        exp.location
                          ? `<p style="margin: 0;">${exp.location}</p>`
                          : ""
                      }</div></div>${
                        exp.description
                          ? `<div style="font-size: 14px; color: #444; margin-left: 16px;">${exp.description
                              .split("\n")
                              .map(
                                (line) =>
                                  `<p style=\"margin-bottom: 4px;\">${line}</p>`
                              )
                              .join("")}</div>`
                          : ""
                      }</div>`
                  )
                  .join("")}</div>`
              : ""
          }
          ${
            education.length > 0
              ? `<div style="margin-bottom: 24px;"><h2 style="font-size: 18px; font-weight: 700; color: #222; border-bottom: 1px solid #bbb; padding-bottom: 4px; margin-bottom: 10px;">EDUCATION</h2>${education
                  .map(
                    (edu) =>
                      `<div style="margin-bottom: 10px;"><div style="display: flex; justify-content: space-between; align-items: start;"><div><h3 style="font-weight: 700; color: #222; margin: 0;">${
                        edu.degree
                      } ${
                        edu.field ? `in ${edu.field}` : ""
                      }</h3><p style="color: #444; margin: 0;">${
                        edu.institution
                      }</p></div><div style="text-align: right; font-size: 14px; color: #555;">${
                        edu.startYear || edu.endYear
                          ? `<p style=\"margin: 0;\">${edu.startYear || ""} ${
                              edu.startYear && edu.endYear ? "- " : ""
                            } ${edu.endYear || ""}</p>`
                          : ""
                      }${
                        edu.gpa
                          ? `<p style=\"margin: 0;\">GPA: ${edu.gpa}</p>`
                          : ""
                      }</div></div></div>`
                  )
                  .join("")}</div>`
              : ""
          }
          ${
            skillCategories.length > 0
              ? `<div style="margin-bottom: 24px;"><h2 style="font-size: 18px; font-weight: 700; color: #222; border-bottom: 1px solid #bbb; padding-bottom: 4px; margin-bottom: 10px;">TECHNICAL SKILLS</h2>${skillCategories
                  .map(
                    (category) =>
                      `<div style="margin-bottom: 8px;"><div style="display: flex; align-items: start;"><h4 style="font-weight: 600; color: #222; width: 128px; flex-shrink: 0; margin: 0;">${
                        category.name
                      }:</h4><p style="color: #444; font-size: 14px; margin: 0;">${category.skills.join(
                        ", "
                      )}</p></div></div>`
                  )
                  .join("")}</div>`
              : ""
          }
        </div>
      `;
    }

    // Minimal template HTML
    if (template === "minimal") {
      return `<div style="padding: 32px; font-family: Arial, sans-serif; background: #fff; color: #222; line-height: 1.5;">
        <div style="text-align: left; border-bottom: 2px solid #222; padding-bottom: 16px; margin-bottom: 24px;">
          <h1 style="font-size: 32px; font-weight: bold; margin-bottom: 4px;">${
            fullName || "Your Name"
          }</h1>
          ${
            personalInfo.title
              ? `<p style=\"font-size: 18px; color: #444; margin-bottom: 8px;\">${personalInfo.title}</p>`
              : ""
          }
          <div style="font-size: 14px; color: #555;">
            ${personalInfo.email ? `<span>${personalInfo.email}</span>` : ""}
            ${personalInfo.phone ? `<span> | ${personalInfo.phone}</span>` : ""}
            ${
              personalInfo.address
                ? `<span> | ${personalInfo.address}</span>`
                : ""
            }
            ${
              personalInfo.linkedin
                ? `<span> | ${personalInfo.linkedin}</span>`
                : ""
            }
          </div>
        </div>
        ${
          personalInfo.summary
            ? `<div style=\"margin-bottom: 18px;\"><h2 style=\"font-size: 16px; font-weight: 700; color: #222; border-bottom: 1px solid #bbb; padding-bottom: 2px; margin-bottom: 6px;\">PROFESSIONAL SUMMARY</h2><p style=\"color: #444;\">${personalInfo.summary}</p></div>`
            : ""
        }
        ${
          workExperience.length > 0
            ? `<div style=\"margin-bottom: 18px;\"><h2 style=\"font-size: 16px; font-weight: 700; color: #222; border-bottom: 1px solid #bbb; padding-bottom: 2px; margin-bottom: 6px;\">WORK EXPERIENCE</h2>${workExperience
                .map(
                  (exp) =>
                    `<div style=\"margin-bottom: 10px;\"><div style=\"display: flex; justify-content: space-between; align-items: start; margin-bottom: 2px;\"><div><h3 style=\"font-weight: 700; color: #222; margin: 0;\">${
                      exp.title
                    }</h3><p style=\"color: #444; margin: 0;\">${
                      exp.company
                    }</p></div><div style=\"text-align: right; font-size: 13px; color: #555;\"><p style=\"margin: 0;\">${formatDateRange(
                      exp.startDate,
                      exp.endDate || "",
                      exp.current
                    )}</p>${
                      exp.location
                        ? `<p style=\"margin: 0;\">${exp.location}</p>`
                        : ""
                    }</div></div>${
                      exp.description
                        ? `<div style=\"font-size: 13px; color: #444; margin-left: 12px;\">${exp.description
                            .split("\\n")
                            .map(
                              (line) =>
                                `<p style=\\"margin-bottom: 2px;\\">${line}</p>`
                            )
                            .join("")}</div>`
                        : ""
                    }</div>`
                )
                .join("")}</div>`
            : ""
        }
        ${
          education.length > 0
            ? `<div style=\"margin-bottom: 18px;\"><h2 style=\"font-size: 16px; font-weight: 700; color: #222; border-bottom: 1px solid #bbb; padding-bottom: 2px; margin-bottom: 6px;\">EDUCATION</h2>${education
                .map(
                  (edu) =>
                    `<div style=\"margin-bottom: 6px;\"><div style=\"display: flex; justify-content: space-between; align-items: start;\"><div><h3 style=\"font-weight: 700; color: #222; margin: 0;\">${
                      edu.degree
                    } ${
                      edu.field ? `in ${edu.field}` : ""
                    }</h3><p style=\"color: #444; margin: 0;\">${
                      edu.institution
                    }</p></div><div style=\"text-align: right; font-size: 13px; color: #555;\">${
                      edu.startYear || edu.endYear
                        ? `<p style=\\"margin: 0;\\">${edu.startYear || ""} ${
                            edu.startYear && edu.endYear ? "- " : ""
                          } ${edu.endYear || ""}</p>`
                        : ""
                    }${
                      edu.gpa
                        ? `<p style=\\"margin: 0;\\">GPA: ${edu.gpa}</p>`
                        : ""
                    }</div></div></div>`
                )
                .join("")}</div>`
            : ""
        }
        ${
          skillCategories.length > 0
            ? `<div style=\"margin-bottom: 18px;\"><h2 style=\"font-size: 16px; font-weight: 700; color: #222; border-bottom: 1px solid #bbb; padding-bottom: 2px; margin-bottom: 6px;\">TECHNICAL SKILLS</h2>${skillCategories
                .map(
                  (category) =>
                    `<div style=\"margin-bottom: 4px;\"><div style=\"display: flex; align-items: start;\"><h4 style=\"font-weight: 600; color: #222; width: 110px; flex-shrink: 0; margin: 0;\">${
                      category.name
                    }:</h4><p style=\"color: #444; font-size: 13px; margin: 0;\">${category.skills.join(
                      ", "
                    )}</p></div></div>`
                )
                .join("")}</div>`
            : ""
        }
      </div>`;
    }

    // Elegant template HTML
    if (template === "elegant") {
      return `<div style="padding: 40px; font-family: 'Georgia', serif; background: #f9f9f9; color: #222; line-height: 1.7;">
        <div style="text-align: center; border-bottom: 2px solid #b48eae; padding-bottom: 20px; margin-bottom: 24px;">
          <h1 style="font-size: 34px; font-weight: bold; color: #b48eae; margin-bottom: 6px;">${
            fullName || "Your Name"
          }</h1>
          ${
            personalInfo.title
              ? `<p style=\"font-size: 19px; color: #555; margin-bottom: 10px;\">${personalInfo.title}</p>`
              : ""
          }
          <div style="font-size: 15px; color: #555;">
            ${personalInfo.email ? `<span>${personalInfo.email}</span>` : ""}
            ${personalInfo.phone ? `<span> | ${personalInfo.phone}</span>` : ""}
            ${
              personalInfo.address
                ? `<span> | ${personalInfo.address}</span>`
                : ""
            }
            ${
              personalInfo.linkedin
                ? `<span> | ${personalInfo.linkedin}</span>`
                : ""
            }
          </div>
        </div>
        ${
          personalInfo.summary
            ? `<div style=\"margin-bottom: 20px;\"><h2 style=\"font-size: 17px; font-weight: 700; color: #b48eae; border-bottom: 1px solid #bbb; padding-bottom: 2px; margin-bottom: 6px;\">PROFESSIONAL SUMMARY</h2><p style=\"color: #444;\">${personalInfo.summary}</p></div>`
            : ""
        }
        ${
          workExperience.length > 0
            ? `<div style=\"margin-bottom: 20px;\"><h2 style=\"font-size: 17px; font-weight: 700; color: #b48eae; border-bottom: 1px solid #bbb; padding-bottom: 2px; margin-bottom: 6px;\">WORK EXPERIENCE</h2>${workExperience
                .map(
                  (exp) =>
                    `<div style=\"margin-bottom: 10px;\"><div style=\"display: flex; justify-content: space-between; align-items: start; margin-bottom: 2px;\"><div><h3 style=\"font-weight: 700; color: #b48eae; margin: 0;\">${
                      exp.title
                    }</h3><p style=\"color: #444; margin: 0;">${
                      exp.company
                    }</p></div><div style=\"text-align: right; font-size: 13px; color: #555;\"><p style=\"margin: 0;\">${formatDateRange(
                      exp.startDate,
                      exp.endDate || "",
                      exp.current
                    )}</p>${
                      exp.location
                        ? `<p style=\"margin: 0;\">${exp.location}</p>`
                        : ""
                    }</div></div>${
                      exp.description
                        ? `<div style=\"font-size: 13px; color: #444; margin-left: 12px;\">${exp.description
                            .split("\\n")
                            .map(
                              (line) =>
                                `<p style=\\"margin-bottom: 2px;\\">${line}</p>`
                            )
                            .join("")}</div>`
                        : ""
                    }</div>`
                )
                .join("")}</div>`
            : ""
        }
        ${
          education.length > 0
            ? `<div style=\"margin-bottom: 20px;\"><h2 style=\"font-size: 17px; font-weight: 700; color: #b48eae; border-bottom: 1px solid #bbb; padding-bottom: 2px; margin-bottom: 6px;\">EDUCATION</h2>${education
                .map(
                  (edu) =>
                    `<div style=\"margin-bottom: 6px;\"><div style=\"display: flex; justify-content: space-between; align-items: start;\"><div><h3 style=\"font-weight: 700; color: #b48eae; margin: 0;\">${
                      edu.degree
                    } ${
                      edu.field ? `in ${edu.field}` : ""
                    }</h3><p style=\"color: #444; margin: 0;">${
                      edu.institution
                    }</p></div><div style=\"text-align: right; font-size: 13px; color: #555;\">${
                      edu.startYear || edu.endYear
                        ? `<p style=\\"margin: 0;\\">${edu.startYear || ""} ${
                            edu.startYear && edu.endYear ? "- " : ""
                          } ${edu.endYear || ""}</p>`
                        : ""
                    }${
                      edu.gpa
                        ? `<p style=\\"margin: 0;\\">GPA: ${edu.gpa}</p>`
                        : ""
                    }</div></div></div>`
                )
                .join("")}</div>`
            : ""
        }
        ${
          skillCategories.length > 0
            ? `<div style=\"margin-bottom: 20px;\"><h2 style=\"font-size: 17px; font-weight: 700; color: #b48eae; border-bottom: 1px solid #bbb; padding-bottom: 2px; margin-bottom: 6px;\">TECHNICAL SKILLS</h2>${skillCategories
                .map(
                  (category) =>
                    `<div style=\"margin-bottom: 4px;\"><div style=\"display: flex; align-items: start;\"><h4 style=\"font-weight: 600; color: #b48eae; width: 110px; flex-shrink: 0; margin: 0;\">${
                      category.name
                    }:</h4><p style=\"color: #444; font-size: 13px; margin: 0;">${category.skills.join(
                      ", "
                    )}</p></div></div>`
                )
                .join("")}</div>`
            : ""
        }
      </div>`;
    }

    // ATS-Friendly template HTML
    if (template === "ats") {
      return `<div style="padding: 32px; font-family: Arial, sans-serif; background: #fff; color: #111; line-height: 1.5;">
        <div style="text-align: left; border-bottom: 2px solid #111; padding-bottom: 12px; margin-bottom: 18px;">
          <h1 style="font-size: 30px; font-weight: bold; margin-bottom: 2px;">${
            fullName || "Your Name"
          }</h1>
          ${
            personalInfo.title
              ? `<p style=\"font-size: 16px; color: #333; margin-bottom: 6px;\">${personalInfo.title}</p>`
              : ""
          }
          <div style="font-size: 13px; color: #333;">
            ${personalInfo.email ? `<span>${personalInfo.email}</span>` : ""}
            ${personalInfo.phone ? `<span> | ${personalInfo.phone}</span>` : ""}
            ${
              personalInfo.address
                ? `<span> | ${personalInfo.address}</span>`
                : ""
            }
            ${
              personalInfo.linkedin
                ? `<span> | ${personalInfo.linkedin}</span>`
                : ""
            }
          </div>
        </div>
        ${
          personalInfo.summary
            ? `<div style=\"margin-bottom: 12px;\"><h2 style=\"font-size: 15px; font-weight: 700; color: #111; border-bottom: 1px solid #bbb; padding-bottom: 2px; margin-bottom: 4px;\">PROFESSIONAL SUMMARY</h2><p style=\"color: #222;\">${personalInfo.summary}</p></div>`
            : ""
        }
        ${
          workExperience.length > 0
            ? `<div style=\"margin-bottom: 12px;\"><h2 style=\"font-size: 15px; font-weight: 700; color: #111; border-bottom: 1px solid #bbb; padding-bottom: 2px; margin-bottom: 4px;\">WORK EXPERIENCE</h2>${workExperience
                .map(
                  (exp) =>
                    `<div style=\"margin-bottom: 6px;\"><div style=\"display: flex; justify-content: space-between; align-items: start; margin-bottom: 2px;\"><div><h3 style=\"font-weight: 700; color: #111; margin: 0;\">${
                      exp.title
                    }</h3><p style=\"color: #222; margin: 0;\">${
                      exp.company
                    }</p></div><div style=\"text-align: right; font-size: 12px; color: #333;\"><p style=\"margin: 0;\">${formatDateRange(
                      exp.startDate,
                      exp.endDate || "",
                      exp.current
                    )}</p>${
                      exp.location
                        ? `<p style=\"margin: 0;\">${exp.location}</p>`
                        : ""
                    }</div></div>${
                      exp.description
                        ? `<div style=\"font-size: 12px; color: #222; margin-left: 10px;\">${exp.description
                            .split("\\n")
                            .map(
                              (line) =>
                                `<p style=\\"margin-bottom: 2px;\\">${line}</p>`
                            )
                            .join("")}</div>`
                        : ""
                    }</div>`
                )
                .join("")}</div>`
            : ""
        }
        ${
          education.length > 0
            ? `<div style=\"margin-bottom: 12px;\"><h2 style=\"font-size: 15px; font-weight: 700; color: #111; border-bottom: 1px solid #bbb; padding-bottom: 2px; margin-bottom: 4px;\">EDUCATION</h2>${education
                .map(
                  (edu) =>
                    `<div style=\"margin-bottom: 4px;\"><div style=\"display: flex; justify-content: space-between; align-items: start;\"><div><h3 style=\"font-weight: 700; color: #111; margin: 0;\">${
                      edu.degree
                    } ${
                      edu.field ? `in ${edu.field}` : ""
                    }</h3><p style=\"color: #222; margin: 0;\">${
                      edu.institution
                    }</p></div><div style=\"text-align: right; font-size: 12px; color: #333;\">${
                      edu.startYear || edu.endYear
                        ? `<p style=\\"margin: 0;\\">${edu.startYear || ""} ${
                            edu.startYear && edu.endYear ? "- " : ""
                          } ${edu.endYear || ""}</p>`
                        : ""
                    }${
                      edu.gpa
                        ? `<p style=\\"margin: 0;\\">GPA: ${edu.gpa}</p>`
                        : ""
                    }</div></div></div>`
                )
                .join("")}</div>`
            : ""
        }
        ${
          skillCategories.length > 0
            ? `<div style=\"margin-bottom: 12px;\"><h2 style=\"font-size: 15px; font-weight: 700; color: #111; border-bottom: 1px solid #bbb; padding-bottom: 2px; margin-bottom: 4px;\">TECHNICAL SKILLS</h2>${skillCategories
                .map(
                  (category) =>
                    `<div style=\"margin-bottom: 2px;\"><div style=\"display: flex; align-items: start;\"><h4 style=\"font-weight: 600; color: #111; width: 100px; flex-shrink: 0; margin: 0;\">${
                      category.name
                    }:</h4><p style=\"color: #222; font-size: 12px; margin: 0;">${category.skills.join(
                      ", "
                    )}</p></div></div>`
                )
                .join("")}</div>`
            : ""
        }
      </div>`;
    }

    // Infographic template HTML
    if (template === "infographic") {
      return `<div style="padding: 32px; font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6fa; color: #222; line-height: 1.5;">
        <div style="text-align: center; border-bottom: 2px solid #1976D2; padding-bottom: 18px; margin-bottom: 18px;">
          <h1 style="font-size: 32px; font-weight: bold; color: #1976D2; margin-bottom: 4px;">${
            fullName || "Your Name"
          }</h1>
          ${
            personalInfo.title
              ? `<p style=\"font-size: 18px; color: #666; margin-bottom: 8px;\">${personalInfo.title}</p>`
              : ""
          }
          <div style="font-size: 14px; color: #555;">
            ${personalInfo.email ? `<span>${personalInfo.email}</span>` : ""}
            ${personalInfo.phone ? `<span> | ${personalInfo.phone}</span>` : ""}
            ${
              personalInfo.address
                ? `<span> | ${personalInfo.address}</span>`
                : ""
            }
            ${
              personalInfo.linkedin
                ? `<span> | ${personalInfo.linkedin}</span>`
                : ""
            }
          </div>
        </div>
        ${
          personalInfo.summary
            ? `<div style=\"margin-bottom: 14px;\"><h2 style=\"font-size: 15px; font-weight: 700; color: #1976D2; border-bottom: 1px solid #bbb; padding-bottom: 2px; margin-bottom: 4px;\">PROFESSIONAL SUMMARY</h2><p style=\"color: #222;\">${personalInfo.summary}</p></div>`
            : ""
        }
        ${
          workExperience.length > 0
            ? `<div style=\"margin-bottom: 14px;\"><h2 style=\"font-size: 15px; font-weight: 700; color: #1976D2; border-bottom: 1px solid #bbb; padding-bottom: 2px; margin-bottom: 4px;\">WORK EXPERIENCE</h2>${workExperience
                .map(
                  (exp) =>
                    `<div style=\"margin-bottom: 6px;\"><div style=\"display: flex; justify-content: space-between; align-items: start; margin-bottom: 2px;\"><div><h3 style=\"font-weight: 700; color: #1976D2; margin: 0;\">${
                      exp.title
                    }</h3><p style=\"color: #222; margin: 0;\">${
                      exp.company
                    }</p></div><div style=\"text-align: right; font-size: 13px; color: #555;\"><p style=\"margin: 0;\">${formatDateRange(
                      exp.startDate,
                      exp.endDate || "",
                      exp.current
                    )}</p>${
                      exp.location
                        ? `<p style=\"margin: 0;\">${exp.location}</p>`
                        : ""
                    }</div></div>${
                      exp.description
                        ? `<div style=\"font-size: 13px; color: #222; margin-left: 12px;\">${exp.description
                            .split("\\n")
                            .map(
                              (line) =>
                                `<p style=\\"margin-bottom: 2px;\\">${line}</p>`
                            )
                            .join("")}</div>`
                        : ""
                    }</div>`
                )
                .join("")}</div>`
            : ""
        }
        ${
          education.length > 0
            ? `<div style=\"margin-bottom: 14px;\"><h2 style=\"font-size: 15px; font-weight: 700; color: #1976D2; border-bottom: 1px solid #bbb; padding-bottom: 2px; margin-bottom: 4px;\">EDUCATION</h2>${education
                .map(
                  (edu) =>
                    `<div style=\"margin-bottom: 4px;\"><div style=\"display: flex; justify-content: space-between; align-items: start;\"><div><h3 style=\"font-weight: 700; color: #1976D2; margin: 0;\">${
                      edu.degree
                    } ${
                      edu.field ? `in ${edu.field}` : ""
                    }</h3><p style=\"color: #222; margin: 0;\">${
                      edu.institution
                    }</p></div><div style=\"text-align: right; font-size: 13px; color: #555;\">${
                      edu.startYear || edu.endYear
                        ? `<p style=\\"margin: 0;\\">${edu.startYear || ""} ${
                            edu.startYear && edu.endYear ? "- " : ""
                          } ${edu.endYear || ""}</p>`
                        : ""
                    }${
                      edu.gpa
                        ? `<p style=\\"margin: 0;\\">GPA: ${edu.gpa}</p>`
                        : ""
                    }</div></div></div>`
                )
                .join("")}</div>`
            : ""
        }
        ${
          skillCategories.length > 0
            ? `<div style=\"margin-bottom: 14px;\"><h2 style=\"font-size: 15px; font-weight: 700; color: #1976D2; border-bottom: 1px solid #bbb; padding-bottom: 2px; margin-bottom: 4px;\">TECHNICAL SKILLS</h2>${skillCategories
                .map(
                  (category) =>
                    `<div style=\"margin-bottom: 2px;\"><div style=\"display: flex; align-items: start;\"><h4 style=\"font-weight: 600; color: #1976D2; width: 100px; flex-shrink: 0; margin: 0;\">${
                      category.name
                    }:</h4><p style=\"color: #222; font-size: 13px; margin: 0;">${category.skills.join(
                      ", "
                    )}</p></div></div>`
                )
                .join("")}</div>`
            : ""
        }
      </div>`;
    }

    // Black & White Minimal template HTML
    if (template === "bwminimal") {
      return `<div style="padding: 32px; font-family: 'Courier New', Courier, monospace; background: #fff; color: #000; line-height: 1.5;">
        <div style="text-align: left; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 18px;">
          <h1 style="font-size: 28px; font-weight: bold; margin-bottom: 2px;">${
            fullName || "Your Name"
          }</h1>
          ${
            personalInfo.title
              ? `<p style=\"font-size: 15px; color: #222; margin-bottom: 4px;\">${personalInfo.title}</p>`
              : ""
          }
          <div style="font-size: 12px; color: #222;">
            ${personalInfo.email ? `<span>${personalInfo.email}</span>` : ""}
            ${personalInfo.phone ? `<span> | ${personalInfo.phone}</span>` : ""}
            ${
              personalInfo.address
                ? `<span> | ${personalInfo.address}</span>`
                : ""
            }
            ${
              personalInfo.linkedin
                ? `<span> | ${personalInfo.linkedin}</span>`
                : ""
            }
          </div>
        </div>
        ${
          personalInfo.summary
            ? `<div style=\"margin-bottom: 10px;\"><h2 style=\"font-size: 13px; font-weight: 700; color: #000; border-bottom: 1px solid #bbb; padding-bottom: 2px; margin-bottom: 2px;\">PROFESSIONAL SUMMARY</h2><p style=\"color: #111;\">${personalInfo.summary}</p></div>`
            : ""
        }
        ${
          workExperience.length > 0
            ? `<div style=\"margin-bottom: 10px;\"><h2 style=\"font-size: 13px; font-weight: 700; color: #000; border-bottom: 1px solid #bbb; padding-bottom: 2px; margin-bottom: 2px;\">WORK EXPERIENCE</h2>${workExperience
                .map(
                  (exp) =>
                    `<div style=\"margin-bottom: 4px;\"><div style=\"display: flex; justify-content: space-between; align-items: start; margin-bottom: 2px;\"><div><h3 style=\"font-weight: 700; color: #000; margin: 0;\">${
                      exp.title
                    }</h3><p style=\"color: #111; margin: 0;\">${
                      exp.company
                    }</p></div><div style=\"text-align: right; font-size: 11px; color: #222;\"><p style=\"margin: 0;\">${formatDateRange(
                      exp.startDate,
                      exp.endDate || "",
                      exp.current
                    )}</p>${
                      exp.location
                        ? `<p style=\"margin: 0;\">${exp.location}</p>`
                        : ""
                    }</div></div>${
                      exp.description
                        ? `<div style=\"font-size: 11px; color: #111; margin-left: 8px;\">${exp.description
                            .split("\\n")
                            .map(
                              (line) =>
                                `<p style=\\"margin-bottom: 2px;\\">${line}</p>`
                            )
                            .join("")}</div>`
                        : ""
                    }</div>`
                )
                .join("")}</div>`
            : ""
        }
        ${
          education.length > 0
            ? `<div style=\"margin-bottom: 10px;\"><h2 style=\"font-size: 13px; font-weight: 700; color: #000; border-bottom: 1px solid #bbb; padding-bottom: 2px; margin-bottom: 2px;\">EDUCATION</h2>${education
                .map(
                  (edu) =>
                    `<div style=\"margin-bottom: 2px;\"><div style=\"display: flex; justify-content: space-between; align-items: start;\"><div><h3 style=\"font-weight: 700; color: #000; margin: 0;\">${
                      edu.degree
                    } ${
                      edu.field ? `in ${edu.field}` : ""
                    }</h3><p style=\"color: #111; margin: 0;\">${
                      edu.institution
                    }</p></div><div style=\"text-align: right; font-size: 11px; color: #222;\">${
                      edu.startYear || edu.endYear
                        ? `<p style=\\"margin: 0;\\">${edu.startYear || ""} ${
                            edu.startYear && edu.endYear ? "- " : ""
                          } ${edu.endYear || ""}</p>`
                        : ""
                    }${
                      edu.gpa
                        ? `<p style=\\"margin: 0;\\">GPA: ${edu.gpa}</p>`
                        : ""
                    }</div></div></div>`
                )
                .join("")}</div>`
            : ""
        }
        ${
          skillCategories.length > 0
            ? `<div style=\"margin-bottom: 10px;\"><h2 style=\"font-size: 13px; font-weight: 700; color: #000; border-bottom: 1px solid #bbb; padding-bottom: 2px; margin-bottom: 2px;\">TECHNICAL SKILLS</h2>${skillCategories
                .map(
                  (category) =>
                    `<div style=\"margin-bottom: 2px;\"><div style=\"display: flex; align-items: start;\"><h4 style=\"font-weight: 600; color: #000; width: 90px; flex-shrink: 0; margin: 0;\">${
                      category.name
                    }:</h4><p style=\"color: #111; font-size: 11px; margin: 0;\">${category.skills.join(
                      ", "
                    )}</p></div></div>`
                )
                .join("")}</div>`
            : ""
        }
      </div>`;
    }

    // Return modern template as fallback
    return this.generateResumeHTML(resumeData, "modern");
  }
}
