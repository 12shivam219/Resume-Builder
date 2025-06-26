// Local AI suggestion and analysis utilities for resume builder
// All logic is privacy-friendly and runs locally (no external API calls)

// Suggest a professional summary based on resume fields
export function localSuggestSummary(resumeData: { customSections: { id: string; title: string; content?: string | undefined; }[]; sectionOrder: string[]; personalInfo: { firstName: string; lastName: string; email: string; phone: string; title?: string | undefined; address?: string | undefined; linkedin?: string | undefined; summary?: string | undefined; }; workExperience: { id: string; title: string; company: string; startDate: string; current: boolean; location?: string | undefined; endDate?: string | undefined; description?: string | undefined; }[]; education: { id: string; degree: string; field: string; institution: string; location?: string | undefined; startYear?: number | undefined; endYear?: number | undefined; gpa?: number | undefined; }[]; skillCategories: { id: string; name: string; skills: string[]; }[]; template: string; templateSettings?: Record<string, any> | undefined; }, jobDesc: string, tone: string, { name, title, yearsExperience, skills, industry }: {
  name?: string;
  title?: string;
  yearsExperience?: number;
  skills?: string[];
  industry?: string;
}): string {
  let summary = '';
  if (name) summary += `${name} is `;
  if (yearsExperience && yearsExperience > 0) {
    summary += `an experienced ${title || 'professional'} with over ${yearsExperience} years in`;
  } else {
    summary += `a ${title || 'professional'} in`;
  }
  if (industry) summary += ` the ${industry} industry`;
  if (skills && skills.length) summary += `, skilled in ${skills.slice(0, 5).join(', ')}`;
  summary += '.';
  return summary.replace(/\s+/g, ' ').trim();
}

// Suggest improvements for work experience bullet points
export function localSuggestWorkBullets(exp: { id: string; title: string; company: string; startDate: string; current: boolean; location?: string | undefined; endDate?: string | undefined; description?: string | undefined; }, jobDesc: string, tone: string, { role, industry, skills }: {
  role?: string;
  industry?: string;
  skills?: string[];
}): string[] {
  const bullets = [];
  if (role && industry) {
    bullets.push(`Demonstrated expertise as a ${role} in the ${industry} sector.`);
  }
  if (skills && skills.length) {
    bullets.push(`Utilized skills such as ${skills.slice(0, 3).join(', ')} to achieve key objectives.`);
  }
  bullets.push('Consistently delivered results in fast-paced, collaborative environments.');
  return bullets;
}

// Local fallback: Analyze job description and resume for missing keywords (free, no AI)
export function localAnalyzeJobDescription(jobDescription: string, resumeText: string): { missingKeywords: string[], suggestions: string } {
  // Extract keywords from job description (simple split, remove stopwords, dedupe)
  const stopwords = new Set(["the","and","a","to","of","in","for","with","on","at","by","an","be","is","are","as","from","or","that","this","it","will","can","your","you","we","our","their","they","has","have","but","if","not","all","any","so","do","does","was","were","which","who","what","when","where","how"]);
  const words = jobDescription.toLowerCase().match(/\b\w+\b/g) || [];
  const keywords = Array.from(new Set(words.filter(w => !stopwords.has(w) && w.length > 2)));
  // Find which keywords are missing from the resume
  const resumeLower = resumeText.toLowerCase();
  const missingKeywords = keywords.filter(k => !resumeLower.includes(k));
  // Suggest adding the top 5 missing keywords
  const suggestions = missingKeywords.length
    ? `Consider adding these keywords to your resume: ${missingKeywords.slice(0, 5).join(", ")}`
    : "Your resume covers most keywords from the job description!";
  return { missingKeywords, suggestions };
}

// --- AI (OpenAI API) functions ---
// These require an API key and internet connection
export async function getAISummary(resumeData: { customSections: { id: string; title: string; content?: string | undefined; }[]; sectionOrder: string[]; personalInfo: { firstName: string; lastName: string; email: string; phone: string; title?: string | undefined; address?: string | undefined; linkedin?: string | undefined; summary?: string | undefined; }; workExperience: { id: string; title: string; company: string; startDate: string; current: boolean; location?: string | undefined; endDate?: string | undefined; description?: string | undefined; }[]; education: { id: string; degree: string; field: string; institution: string; location?: string | undefined; startYear?: number | undefined; endYear?: number | undefined; gpa?: number | undefined; }[]; skillCategories: { id: string; name: string; skills: string[]; }[]; template: string; templateSettings?: Record<string, any> | undefined; }, prompt: string, apiKey: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant for writing professional resumes.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 300,
      temperature: 0.7,
    }),
  });
  if (!response.ok) throw new Error('Failed to get AI suggestion');
  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

export async function getAIWorkBullets(exp: { id: string; title: string; company: string; startDate: string; current: boolean; location?: string | undefined; endDate?: string | undefined; description?: string | undefined; }, prompt: string, apiKey: string, apiKey: string): Promise<string[]> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant for resume work experience.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 300,
      temperature: 0.7,
    }),
  });
  if (!response.ok) throw new Error('Failed to get AI suggestion');
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content?.trim() || '';
  // Try to split into bullet points
  return text.split(/\n|\r/).map((s: string) => s.replace(/^[-*•]\s*/, '').trim()).filter(Boolean);
}

export async function analyzeJobDescriptionAI(jobDescription: string, resumeText: string, apiKey: string): Promise<{ missingKeywords: string[], suggestions: string }> {
  const prompt = `You are an expert resume coach. Here is a job description:\n${jobDescription}\n\nHere is the candidate's resume:\n${resumeText}\n\nList the top 10 most important keywords or skills from the job description that are missing from the resume. Then, suggest specific improvements to the resume to better match the job description. Return your answer as a JSON object with keys 'missingKeywords' (array of strings) and 'suggestions' (string).`;
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant for resume optimization.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 500,
      temperature: 0.4,
    }),
  });
  if (!response.ok) throw new Error('Failed to analyze job description');
  const data = await response.json();
  try {
    const text = data.choices?.[0]?.message?.content?.trim() || '';
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      return JSON.parse(text.substring(jsonStart, jsonEnd + 1));
    }
    throw new Error('No JSON found in AI response');
  } catch (e) {
    throw new Error('Failed to parse AI response: ' + e);
  }
}
