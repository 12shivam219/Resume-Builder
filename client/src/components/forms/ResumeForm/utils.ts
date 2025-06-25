// Utility to highlight missing keywords in a string
import React from "react";

export function highlightKeywords(text: string, keywords: string[]): React.ReactNode {
  if (!keywords.length) return text;
  // Sort keywords by length to avoid partial overlaps
  const sorted = [...keywords].sort((a, b) => b.length - a.length);
  let result: (string | React.ReactNode)[] = [text];
  for (const kw of sorted) {
    // Escape special regex characters in keyword
    const safeKw = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${safeKw})`, 'gi');
    result = result.flatMap((part) => {
      if (typeof part !== 'string') return [part];
      const split = part.split(regex);
      return split.map((s, i) => {
        // Only highlight if this is a match and not an empty string
        if (i % 2 === 1 && s.length > 0) {
          return React.createElement(
            'mark',
            { key: `${safeKw}-${i}`, style: { background: '#ffe066', color: '#222' } },
            s
          );
        }
        return s;
      });
    });
  }
  return React.createElement(React.Fragment, null, ...result);
}
