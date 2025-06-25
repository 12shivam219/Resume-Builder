import type { ResumeData } from "@shared/schema";

export function generateLinkedInText(resumeData: ResumeData): string {
  const { personalInfo, workExperience, education, skillCategories } = resumeData;
  let text = `${personalInfo.firstName} ${personalInfo.lastName}\n`;
  if (personalInfo.summary) text += `\n${personalInfo.summary}\n`;
  text += `\nWork Experience\n`;
  workExperience.forEach(w => {
    text += `- ${w.title}, ${w.company} (${w.startDate} - ${w.endDate || 'Present'})\n  ${w.description}\n`;
  });
  text += `\nEducation\n`;
  education.forEach(e => {
    text += `- ${e.degree} in ${e.field}, ${e.institution} (${e.startYear || ''} - ${e.endYear || 'Present'})\n`;
  });
  text += `\nSkills\n`;
  skillCategories.forEach(c => {
    text += `- ${c.name}: ${c.skills.join(", ")}\n`;
  });
  return text;
}
