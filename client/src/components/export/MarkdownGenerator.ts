import type { ResumeData } from "@shared/schema";

export function generateMarkdown(resumeData: ResumeData): string {
  const { personalInfo, workExperience, education, skillCategories } = resumeData;
  let md = `# ${personalInfo.firstName} ${personalInfo.lastName}\n`;
  if (personalInfo.summary) md += `\n${personalInfo.summary}\n`;
  md += `\n## Work Experience\n`;
  workExperience.forEach(w => {
    md += `- **${w.title}**, ${w.company} (${w.startDate} - ${w.endDate || 'Present'})\n  - ${w.description}\n`;
  });
  md += `\n## Education\n`;
  education.forEach(e => {
    md += `- **${e.degree} in ${e.field}**, ${e.institution} (${e.startYear || ''} - ${e.endYear || 'Present'})\n`;
  });
  md += `\n## Skills\n`;
  skillCategories.forEach(c => {
    md += `- **${c.name}**: ${c.skills.join(", ")}\n`;
  });
  return md;
}
