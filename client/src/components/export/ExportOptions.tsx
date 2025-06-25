import React from "react";

interface ExportOptionsProps {
  onExport: (format: "pdf" | "docx" | "md" | "linkedin") => void;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({ onExport }) => (
  <div className="flex gap-2">
    <button onClick={() => onExport("pdf")}>Export PDF</button>
    <button onClick={() => onExport("docx")}>Export DOCX</button>
    <button onClick={() => onExport("md")}>Export Markdown</button>
    <button onClick={() => onExport("linkedin")}>Export LinkedIn</button>
  </div>
);
