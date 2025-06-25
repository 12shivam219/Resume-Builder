import type { ResumeData } from "@shared/schema";
import { STOPWORDS } from "./stopwords";
import { DICTIONARY } from "./dictionary";

interface AnalyzeResult {
  missingKeywords: string[];
  suggestions: string;
}

// Utility: count unique words and vocabulary richness
function getUniqueWordStats(text: string) {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const filtered = words.filter((w) => !STOPWORDS.includes(w));
  const unique = new Set(filtered);
  return {
    uniqueWordCount: unique.size,
    vocabularyRichness: words.length ? +(unique.size / words.length).toFixed(2) : 0,
  };
}

// Utility: most common words (excluding stopwords)
function getMostCommonWords(text: string, topN = 5) {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const filtered = words.filter((w) => !STOPWORDS.includes(w));
  const freq: Record<string, number> = {};
  filtered.forEach((w) => (freq[w] = (freq[w] || 0) + 1));
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word, count]) => ({ word, count }));
}

// Utility: spelling error count (simple, local dictionary)
function getSpellingErrors(text: string) {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  return words.filter((w) => !STOPWORDS.includes(w) && !DICTIONARY.includes(w));
}

// Utility: passive/active voice detection (simple heuristic)
function getPassiveVoiceSentences(text: string) {
  const sentences = text.match(/[^.!?]+[.!?]/g) || [];
  // Looks for 'was|were|is|are|been|being' + past participle (ed)
  return sentences.filter((s) => /\b(was|were|is|are|been|being)\b\s+\w+ed\b/i.test(s));
}

// Utility: sentence length distribution
function getSentenceLengthStats(text: string) {
  const sentences = text.match(/[^.!?]+[.!?]/g) || [];
  const lengths = sentences.map((s) => s.split(/\s+/).filter(Boolean).length);
  return {
    min: Math.min(...lengths),
    max: Math.max(...lengths),
    avg: lengths.length ? +(lengths.reduce((a, b) => a + b, 0) / lengths.length).toFixed(1) : 0,
    distribution: lengths,
  };
}

// Utility: estimated reading time (words/200)
function getEstimatedReadingTime(wordCount: number) {
  return +(wordCount / 200).toFixed(2);
}

// Utility: bullet point usage
function getBulletPointStats(text: string) {
  const lines = text.split(/\n|\r/);
  const bulletLines = lines.filter((l) => /^\s*[-*•]/.test(l));
  return {
    bulletCount: bulletLines.length,
    totalLines: lines.length,
    percentBullets: lines.length ? Math.round((bulletLines.length / lines.length) * 100) : 0,
  };
}

// Utility: cliché/phrase detection (expand as needed)
const CLICHES = [
  "team player", "hard worker", "go-getter", "think outside the box", "detail-oriented", "results-driven", "fast learner", "self-starter", "dynamic", "synergy", "proactive", "track record", "problem solver"
];
function getCliches(text: string) {
  const found = CLICHES.filter((c) => new RegExp(c, "i").test(text));
  return found;
}

// Utility: Flesch Reading Ease (standard formula)
function getFleschReadingEase(text: string) {
  const sentences = text.match(/[^.!?]+[.!?]/g) || [];
  const words = text.match(/\b\w+\b/g) || [];
  const syllables = words.reduce((acc, word) => acc + countSyllables(word), 0);
  const ASL = words.length / (sentences.length || 1);
  const ASW = syllables / (words.length || 1);
  // Flesch Reading Ease formula
  return +(206.835 - 1.015 * ASL - 84.6 * ASW).toFixed(1);
}
function countSyllables(word: string) {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

// Section-by-section readability
function getSectionReadability(resumeData: ResumeData) {
  return {
    summary: getFleschReadingEase(resumeData.personalInfo.summary || ""),
    work: getFleschReadingEase(resumeData.workExperience.map((w) => w.description).join(" ")),
    education: getFleschReadingEase(resumeData.education.map((e) => `${e.degree} ${e.field} ${e.institution}`).join(" ")),
    skills: getFleschReadingEase(resumeData.skillCategories.flatMap((c) => c.skills).join(" ")),
  };
}

export function getResumeAnalytics(
  resumeData: ResumeData,
  analyzeResult: AnalyzeResult | null,
  jobDesc: string
) {
  // Word count
  const allText = [
    resumeData.personalInfo.summary,
    ...resumeData.workExperience.map((w) => w.description),
    ...resumeData.education.map((e) => `${e.degree} ${e.field} ${e.institution}`),
    ...resumeData.skillCategories.flatMap((c) => c.skills),
  ]
    .filter(Boolean)
    .join(" ");
  const wordCount = allText.split(/\s+/).filter(Boolean).length;

  // Keyword density
  const totalKeywords = (jobDesc.match(/\b\w+\b/g) || []).length;
  const presentKeywords = totalKeywords - (analyzeResult?.missingKeywords.length || 0);
  const keywordDensity = totalKeywords ? Math.round((presentKeywords / totalKeywords) * 100) : 0;

  // Section completeness
  const sections = [
    { name: "Summary", filled: !!resumeData.personalInfo.summary?.trim() },
    { name: "Work Experience", filled: resumeData.workExperience.length > 0 },
    { name: "Education", filled: resumeData.education.length > 0 },
    { name: "Skills", filled: resumeData.skillCategories.some((c) => c.skills.length > 0) },
  ];
  const completed = sections.filter((s) => s.filled).length;
  const completeness = Math.round((completed / sections.length) * 100);

  // Advanced analytics
  const uniqueStats = getUniqueWordStats(allText);
  const mostCommonWords = getMostCommonWords(allText);
  const spellingErrors = getSpellingErrors(allText);
  const passiveSentences = getPassiveVoiceSentences(allText);
  const sentenceStats = getSentenceLengthStats(allText);
  const readingTime = getEstimatedReadingTime(wordCount);
  const bulletStats = getBulletPointStats(allText);
  const cliches = getCliches(allText);
  const flesch = getFleschReadingEase(allText);
  const sectionReadability = getSectionReadability(resumeData);

  return {
    wordCount,
    keywordDensity,
    completeness,
    sections,
    uniqueWordCount: uniqueStats.uniqueWordCount,
    vocabularyRichness: uniqueStats.vocabularyRichness,
    mostCommonWords,
    spellingErrorCount: spellingErrors.length,
    spellingErrors,
    passiveSentenceCount: passiveSentences.length,
    passiveSentences,
    sentenceStats,
    readingTime,
    bulletStats,
    cliches,
    flesch,
    sectionReadability,
  };
}
