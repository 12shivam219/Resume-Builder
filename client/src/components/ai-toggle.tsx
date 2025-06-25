import React from "react";

interface AiToggleProps {
  useAi: boolean;
  onChange: (value: boolean) => void;
}

export const AiToggle: React.FC<AiToggleProps> = ({ useAi, onChange }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label htmlFor="ai-toggle">Use AI Suggestions</label>
      <input
        id="ai-toggle"
        type="checkbox"
        checked={useAi}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: 40, height: 20 }}
      />
      <span>{useAi ? "AI" : "Local"}</span>
    </div>
  );
};
