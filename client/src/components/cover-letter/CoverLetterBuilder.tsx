import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CoverLetterBuilderProps {
  resumeSummary: string;
  jobDescription: string;
  onGenerate: (coverLetter: string) => void;
}

const templates = [
  { label: "Standard", desc: "A classic, professional tone." },
  { label: "Creative", desc: "Show personality and creativity." },
  { label: "Technical", desc: "Highlight technical skills and experience." },
];

export const CoverLetterBuilder: React.FC<CoverLetterBuilderProps> = ({
  resumeSummary,
  jobDescription,
  onGenerate,
}) => {
  const [template, setTemplate] = useState(templates[0].label);
  const [coverLetter, setCoverLetter] = useState("");
  const [editing, setEditing] = useState(false);

  const generateCoverLetter = () => {
    let letter = "";
    if (template === "Creative") {
      letter = `Hello!\n\nI'm thrilled to apply for this opportunity. My journey: ${resumeSummary}.\n`;
      if (jobDescription)
        letter += `What excites me about this role: ${jobDescription.slice(
          0,
          200
        )}...\n`;
      letter += `\nLooking forward to connecting!\n`;
    } else if (template === "Technical") {
      letter = `Dear Hiring Manager,\n\nWith a strong technical background (${resumeSummary}), I am confident in my ability to excel in this role.\n`;
      if (jobDescription)
        letter += `Key requirements that match my skills: ${jobDescription.slice(
          0,
          200
        )}...\n`;
      letter += `\nThank you for your time.\n`;
    } else {
      letter = `Dear Hiring Manager,\n\nI am excited to apply for this position. My background: ${resumeSummary}.\n`;
      if (jobDescription)
        letter += `I am particularly drawn to this role because: ${jobDescription.slice(
          0,
          200
        )}...\n`;
      letter += `\nThank you for your consideration.\n`;
    }
    setCoverLetter(letter);
    setEditing(true);
    onGenerate(letter);
  };

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm max-w-xl mx-auto mt-2">
      <div className="mb-2 flex items-center gap-2">
        <label className="font-medium">Template:</label>
        <select
          className="border rounded px-2 py-1"
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
        >
          {templates.map((t) => (
            <option key={t.label}>{t.label}</option>
          ))}
        </select>
        <span className="text-xs text-gray-500">
          {templates.find((t) => t.label === template)?.desc}
        </span>
      </div>
      <Button onClick={generateCoverLetter} className="mb-2 w-full">
        Generate Cover Letter
      </Button>
      <Textarea
        rows={8}
        value={coverLetter}
        onChange={(e) => setCoverLetter(e.target.value)}
        className="w-full border rounded p-2 text-sm"
        placeholder="Your cover letter will appear here. You can edit it before using."
        onFocus={() => setEditing(true)}
      />
      {editing && (
        <div className="text-xs text-gray-500 mt-1">
          You can edit the generated letter before copying or using it.
        </div>
      )}
    </div>
  );
};
