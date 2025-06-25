// Utility to highlight missing keywords in a string
import React from "react";

export function highlightKeywords(text: string, keywords: string[]): React.ReactNode {
  if (!keywords.length) return text;
  // Sort keywords by length to avoid partial overlaps
  const sorted = [...keywords].sort((a, b) => b.length - a.length);
  let result: (string | React.ReactNode)[] = [text];
  for (const kw of sorted) {
    result = result.flatMap((part) => {
      if (typeof part !== 'string') return [part];
      const regex = new RegExp(`(${kw})`, 'gi');
      const split = part.split(regex);
      return split.map((s, i) =>
        regex.test(s) && s.length > 0 ? (
          <mark key={kw + i} style={{ background: '#ffe066', color: '#222' }}>{s}</mark>
        ) : (
          s
        )
      );
    });
  }
  return <>{result}</>;
}
