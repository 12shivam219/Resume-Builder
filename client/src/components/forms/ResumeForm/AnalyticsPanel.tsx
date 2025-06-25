import React from "react";

interface AnalyticsPanelProps {
  wordCount: number;
  keywordDensity: number;
  completeness: number;
  sections: { name: string; filled: boolean }[];
  uniqueWordCount: number;
  vocabularyRichness: number;
  mostCommonWords: { word: string; count: number }[];
  spellingErrorCount: number;
  spellingErrors: string[];
  passiveSentenceCount: number;
  passiveSentences: string[];
  sentenceStats: {
    min: number;
    max: number;
    avg: number;
    distribution: number[];
  };
  readingTime: number;
  bulletStats: {
    bulletCount: number;
    totalLines: number;
    percentBullets: number;
  };
  cliches: string[];
  flesch: number;
  sectionReadability: {
    summary: number;
    work: number;
    education: number;
    skills: number;
  };
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  wordCount,
  keywordDensity,
  completeness,
  sections,
  uniqueWordCount,
  vocabularyRichness,
  mostCommonWords,
  spellingErrorCount,
  spellingErrors,
  passiveSentenceCount,
  passiveSentences,
  sentenceStats,
  readingTime,
  bulletStats,
  cliches,
  flesch,
  sectionReadability,
}) => (
  <div className="mb-4">
    <div className="font-semibold text-sm">Resume Analytics</div>
    <div className="flex flex-wrap gap-4 text-xs">
      <div>
        Word Count: <b>{wordCount}</b>
      </div>
      <div>
        Unique Words: <b>{uniqueWordCount}</b>
      </div>
      <div>
        Vocabulary Richness: <b>{vocabularyRichness}</b>
      </div>
      <div>
        Keyword Coverage: <b>{keywordDensity}%</b>
      </div>
      <div>
        Section Completeness: <b>{completeness}%</b>
      </div>
      <div>
        Reading Time: <b>{readingTime} min</b>
      </div>
      <div>
        Flesch Readability: <b>{flesch}</b>
      </div>
    </div>
    <div className="flex flex-wrap gap-2 text-xs">
      {sections.map((s) => (
        <span key={s.name} style={{ color: s.filled ? "#228B22" : "#B22222" }}>
          {s.filled ? "✔" : "✖"} {s.name}
        </span>
      ))}
    </div>
    <div className="mt-2 text-xs">
      <div>
        <b>Most Common Words:</b>{" "}
        {mostCommonWords.map((w) => `${w.word} (${w.count})`).join(", ")}
      </div>
      <div>
        <b>Spelling Errors:</b> {spellingErrorCount}{" "}
        {spellingErrorCount > 0 && (
          <span>
            ({spellingErrors.slice(0, 5).join(", ")}
            {spellingErrors.length > 5 ? ", ..." : ""})
          </span>
        )}
      </div>
      <div>
        <b>Passive Sentences:</b> {passiveSentenceCount}{" "}
        {passiveSentenceCount > 0 && (
          <span>
            ({passiveSentences.slice(0, 2).join(" | ")}
            {passiveSentences.length > 2 ? ", ..." : ""})
          </span>
        )}
      </div>
      <div>
        <b>Sentence Length:</b> min {sentenceStats.min}, max {sentenceStats.max}
        , avg {sentenceStats.avg}
      </div>
      <div>
        <b>Bullet Points:</b> {bulletStats.bulletCount} (
        {bulletStats.percentBullets}% of lines)
      </div>
      <div>
        <b>Clichés Detected:</b>{" "}
        {cliches.length > 0 ? cliches.join(", ") : "None"}
      </div>
      <div>
        <b>Section Readability:</b> Summary: {sectionReadability.summary}, Work:{" "}
        {sectionReadability.work}, Education: {sectionReadability.education},
        Skills: {sectionReadability.skills}
      </div>
    </div>
  </div>
);
