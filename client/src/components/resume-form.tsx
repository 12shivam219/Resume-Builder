import React, { useState, Suspense, useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Briefcase,
  GraduationCap,
  Settings,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import type {
  ResumeData,
  WorkExperience,
  Education,
  SkillCategory,
  CustomSection,
} from "@shared/schema";
import {
  personalInfoSchema,
  workExperienceSchema,
  educationSchema,
  skillCategorySchema,
  customSectionSchema,
} from "@shared/schema";
import { parseResumeFile } from "@/lib/resume-parser";
import { AiToggle } from "./ai-toggle";
import {
  localSuggestSummary,
  localSuggestWorkBullets,
  localAnalyzeJobDescription,
  getAISummary,
  getAIWorkBullets,
  analyzeJobDescriptionAI,
} from "@/lib/ai-suggest";
import { AnalyticsPanel } from "./forms/ResumeForm/AnalyticsPanel";
import { getResumeAnalytics } from "./forms/ResumeForm/analyticsUtils";
import { ResumeStorage } from "@/lib/resume-storage";
import { flesch } from "flesch";
import { highlightKeywords } from "./forms/ResumeForm/utils";

interface ResumeFormProps {
  resumeData: ResumeData;
  onUpdateData: (data: Partial<ResumeData>) => void;
}

// Lazy load all major sections for code splitting
const LazyPersonalInfoSection = React.lazy(
  () =>
    import("./forms/ResumeForm/PersonalInfoSection").then((mod) => ({
      default: mod.PersonalInfoSection,
    }))
);
const LazyWorkExperienceSection = React.lazy(
  () =>
    import("./forms/ResumeForm/WorkExperienceSection").then((mod) => ({
      default: mod.WorkExperienceSection,
    }))
);
const LazyEducationSection = React.lazy(
  () =>
    import("./forms/ResumeForm/EducationSection").then((mod) => ({
      default: mod.EducationSection,
    }))
);
const LazySkillsSection = React.lazy(
  () =>
    import("./forms/ResumeForm/SkillsSection").then((mod) => ({
      default: mod.SkillsSection,
    }))
);
const LazyCustomSections = React.lazy(
  () =>
    import("./forms/ResumeForm/CustomSections").then((mod) => ({
      default: mod.CustomSections,
    }))
);

export default function ResumeForm({
  resumeData,
  onUpdateData,
}: ResumeFormProps) {
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    experience: true,
    education: true,
    skills: true,
  });
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [jobDesc, setJobDesc] = useState("");
  const [analyzeResult, setAnalyzeResult] = useState<{
    missingKeywords: string[];
    suggestions: string;
  } | null>(null);
  const [useAi, setUseAi] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [tone, setTone] = useState("formal");
  const [showVersions, setShowVersions] = useState(false);
  const [versions, setVersions] = useState(() => ResumeStorage.getVersions());

  // Tone/style options for AI suggestions
  const TONE_OPTIONS = [
    { value: "formal", label: "Formal" },
    { value: "friendly", label: "Friendly" },
    { value: "concise", label: "Concise" },
    { value: "enthusiastic", label: "Enthusiastic" },
    { value: "neutral", label: "Neutral" },
  ];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Personal Information Form
  const personalForm = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: resumeData.personalInfo,
  });

  const handlePersonalInfoUpdate = (data: any) => {
    onUpdateData({ personalInfo: data });
  };

  // Work Experience Functions
  const addWorkExperience = () => {
    const newExperience: WorkExperience = {
      id: generateId(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };

    onUpdateData({
      workExperience: [...resumeData.workExperience, newExperience],
    });
  };

  const updateWorkExperience = (id: string, data: Partial<WorkExperience>) => {
    const updated = resumeData.workExperience.map((exp) =>
      exp.id === id ? { ...exp, ...data } : exp
    );
    onUpdateData({ workExperience: updated });
  };

  const removeWorkExperience = (id: string) => {
    const filtered = resumeData.workExperience.filter((exp) => exp.id !== id);
    onUpdateData({ workExperience: filtered });
  };

  const moveWorkExperience = (id: string, direction: "up" | "down") => {
    const index = resumeData.workExperience.findIndex((exp) => exp.id === id);
    if (index === -1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= resumeData.workExperience.length) return;

    const updated = [...resumeData.workExperience];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onUpdateData({ workExperience: updated });
  };

  // Education Functions
  const addEducation = () => {
    const newEducation: Education = {
      id: generateId(),
      degree: "",
      field: "",
      institution: "",
      location: "",
      startYear: undefined,
      endYear: undefined,
      gpa: undefined,
    };

    onUpdateData({
      education: [...resumeData.education, newEducation],
    });
  };

  const updateEducation = (id: string, data: Partial<Education>) => {
    const updated = resumeData.education.map((edu) =>
      edu.id === id ? { ...edu, ...data } : edu
    );
    onUpdateData({ education: updated });
  };

  const removeEducation = (id: string) => {
    const filtered = resumeData.education.filter((edu) => edu.id !== id);
    onUpdateData({ education: filtered });
  };

  // Skills Functions
  const addSkillCategory = () => {
    const newCategory: SkillCategory = {
      id: generateId(),
      name: "",
      skills: [],
    };

    onUpdateData({
      skillCategories: [...resumeData.skillCategories, newCategory],
    });
  };

  const updateSkillCategory = (id: string, data: Partial<SkillCategory>) => {
    const updated = resumeData.skillCategories.map((cat) =>
      cat.id === id ? { ...cat, ...data } : cat
    );
    onUpdateData({ skillCategories: updated });
  };

  const removeSkillCategory = (id: string) => {
    const filtered = resumeData.skillCategories.filter((cat) => cat.id !== id);
    onUpdateData({ skillCategories: filtered });
  };

  const addSkill = (categoryId: string, skill: string) => {
    if (!skill.trim()) return;

    const updated = resumeData.skillCategories.map((cat) =>
      cat.id === categoryId
        ? { ...cat, skills: [...cat.skills, skill.trim()] }
        : cat
    );
    onUpdateData({ skillCategories: updated });
  };

  const removeSkill = (categoryId: string, skillIndex: number) => {
    const updated = resumeData.skillCategories.map((cat) =>
      cat.id === categoryId
        ? {
            ...cat,
            skills: cat.skills.filter((_, index) => index !== skillIndex),
          }
        : cat
    );
    onUpdateData({ skillCategories: updated });
  };

  // Custom Sections Functions
  const addCustomSection = () => {
    const newSection: CustomSection = {
      id: generateId(),
      title: "Custom Section",
      content: "",
    };
    onUpdateData({
      customSections: [...(resumeData.customSections || []), newSection],
      sectionOrder: [
        ...(resumeData.sectionOrder || [
          "personalInfo",
          "workExperience",
          "education",
          "skillCategories",
        ]),
        newSection.id,
      ],
    });
  };

  const updateCustomSection = (id: string, data: Partial<CustomSection>) => {
    const updated = (resumeData.customSections || []).map((sec) =>
      sec.id === id ? { ...sec, ...data } : sec
    );
    onUpdateData({ customSections: updated });
  };

  const removeCustomSection = (id: string) => {
    const filtered = (resumeData.customSections || []).filter(
      (sec) => sec.id !== id
    );
    const newOrder = (resumeData.sectionOrder || []).filter(
      (secId) => secId !== id
    );
    onUpdateData({ customSections: filtered, sectionOrder: newOrder });
  };

  // Section Reordering
  const moveSection = (sectionId: string, direction: "up" | "down") => {
    const order = [...(resumeData.sectionOrder || [])];
    const index = order.findIndex((id) => id === sectionId);
    if (index === -1) return;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= order.length) return;
    [order[index], order[newIndex]] = [order[newIndex], order[index]];
    onUpdateData({ sectionOrder: order });
  };

  // Default section order if not provided
  const sectionOrder = resumeData.sectionOrder || [
    "personalInfo",
    "workExperience",
    "education",
    "skillCategories",
    ...(resumeData.customSections?.map((s) => s.id) || []),
  ];

  // AI Functions
  const handleAISummary = async () => {
    try {
      const summary = useAi
        ? await getAISummary(resumeData, jobDesc, tone, apiKey)
        : localSuggestSummary(resumeData, jobDesc, tone, {});
      onUpdateData({
        personalInfo: { ...resumeData.personalInfo, summary },
      });
    } catch (error) {
      console.error("Error generating summary:", error);
    }
  };

  const handleAIWorkExp = async (id: string) => {
    try {
      const exp = resumeData.workExperience.find((e) => e.id === id);
      if (!exp) return;

      const bullets = useAi
        ? await getAIWorkBullets(exp, jobDesc, tone, apiKey)
        : localSuggestWorkBullets(exp, jobDesc, tone, {});
      
      updateWorkExperience(id, { description: Array.isArray(bullets) ? bullets.join("\n") : bullets });
    } catch (error) {
      console.error("Error generating work bullets:", error);
    }
  };

  const handleAnalyzeJobDesc = async () => {
    try {
      const resumeText = JSON.stringify(resumeData);
      const result = useAi
        ? await analyzeJobDescriptionAI(jobDesc, resumeText, apiKey)
        : localAnalyzeJobDescription(jobDesc, JSON.stringify(resumeData));
      setAnalyzeResult(result);
    } catch (error) {
      console.error("Error analyzing job description:", error);
    }
  };

  const debouncedAnalyzeJobDesc = useCallback(
    debounce(handleAnalyzeJobDesc, 500),
    [jobDesc, useAi, apiKey, resumeData]
  );

  // Analytics
  const analytics = useMemo(
    () => getResumeAnalytics(resumeData, analyzeResult, jobDesc),
    [resumeData, analyzeResult, jobDesc]
  );

  const sectionAnalytics = useMemo(() => {
    const summary = resumeData.personalInfo.summary || "";
    const work = resumeData.workExperience
      .map((w) => w.description || "")
      .join(" ");
    const education = resumeData.education
      .map((e) => `${e.degree} ${e.field} ${e.institution}`)
      .join(" ");
    const skills = resumeData.skillCategories
      .flatMap((c) => c.skills)
      .join(" ");
    
    const sections = [
      { name: "Summary", text: summary },
      { name: "Work Experience", text: work },
      { name: "Education", text: education },
      { name: "Skills", text: skills },
    ];

    const keywordList = (jobDesc.match(/\b\w+\b/g) || []).map((k) =>
      k.toLowerCase()
    );

    // Create keyword frequency map
    const keywordFreq: Record<string, number> = {};
    const allText = [summary, work, education, skills].join(" ").toLowerCase();
    
    keywordList.forEach((k) => {
      const re = new RegExp(`\\b${k}\\b`, "gi");
      keywordFreq[k] = (allText.match(re) || []).length;
    });

    function getReadability(text: string) {
      if (!text.trim()) return "-";
      try {
        const countsResult = counts(text);
        return Math.round(flesch(countsResult));
      } catch {
        return "-";
      }
    }

    function getATSCompatibility(text: string) {
      if (/table|column|image|font/i.test(text)) return "Low";
      if (text.length < 100) return "Low";
      return "High";
    }

    return sections.map((sec) => {
      const words = sec.text.split(/\s+/).filter(Boolean);
      const chars = sec.text.length;
      const presentKeywords = keywordList.filter((k) =>
        sec.text.toLowerCase().includes(k)
      );
      const keywordCoverage = keywordList.length
        ? Math.round((presentKeywords.length / keywordList.length) * 100)
        : 0;
      
      return {
        ...sec,
        wordCount: words.length,
        charCount: chars,
        keywordCoverage,
        readability: getReadability(sec.text),
        ats: getATSCompatibility(sec.text),
        keywordFreq, // Include frequency map in each section
      };
    });
  }, [resumeData, jobDesc]);

  // Save version on every update
  useEffect(() => {
    ResumeStorage.saveVersion(resumeData);
    setVersions(ResumeStorage.getVersions());
  }, [resumeData]);

  // Job description analysis effect
  useEffect(() => {
    if (jobDesc) {
      debouncedAnalyzeJobDesc();
    }
  }, [jobDesc, debouncedAnalyzeJobDesc]);

  // Restore version handler
  const handleRestoreVersion = (index: number) => {
    const version = ResumeStorage.restoreVersion(index);
    if (version) {
      onUpdateData(version.data);
    }
  };

  // Clear all history
  const handleClearVersions = () => {
    ResumeStorage.clearVersions();
    setVersions([]);
  };

  // Export resume data as JSON
  const handleExport = () => {
    const dataStr = JSON.stringify(resumeData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resume-export-${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, "-")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import resume data from JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        onUpdateData(imported);
      } catch {
        alert("Invalid resume file.");
      }
    };
    reader.readAsText(file);
  };

  // Section expansion state helpers
  const sectionExpanded = {
    personalInfo: expandedSections.personal,
    workExperience: expandedSections.experience,
    education: expandedSections.education,
    skillCategories: expandedSections.skills,
  };

  // Section move helpers
  const moveSectionUp = (section: string) => moveSection(section, "up");
  const moveSectionDown = (section: string) => moveSection(section, "down");

  return (
    <div className="space-y-8 max-w-3xl mx-auto p-4 bg-gray-50 rounded-lg shadow-md">
      {/* Analytics Panel */}
      <AnalyticsPanel {...analytics} />
      
      {/* AI Toggle and API Key */}
      <div className="flex items-center gap-4 mb-4">
        <AiToggle useAi={useAi} onChange={setUseAi} />
        {useAi && (
          <Input
            type="password"
            placeholder="OpenAI API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-64"
          />
        )}
      </div>

      {/* Job Description Input for Analysis */}
      <div className="mb-4">
        <Label className="block mb-1 font-medium">
          Paste Job Description for Analysis:
        </Label>
        <Textarea
          rows={3}
          placeholder="Paste the job description here..."
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          className="w-full border rounded p-2 text-sm"
        />
        <Button onClick={handleAnalyzeJobDesc} className="mt-2">
          Analyze Job Description
        </Button>
      </div>

      {/* Personal Info Section */}
      <Suspense fallback={<div>Loading personal info...</div>}>
        <LazyPersonalInfoSection
          personalInfo={resumeData.personalInfo}
          expanded={sectionExpanded.personalInfo}
          onToggle={() => toggleSection("personal")}
          onMoveUp={() => moveSectionUp("personalInfo")}
          onMoveDown={() => moveSectionDown("personalInfo")}
          onUpdate={handlePersonalInfoUpdate}
          onGenerateSummary={handleAISummary}
          analyzeResult={analyzeResult}
          highlightKeywords={highlightKeywords}
        />
      </Suspense>

      {/* Work Experience Section */}
      <Suspense fallback={<div>Loading work experience...</div>}>
        <LazyWorkExperienceSection
          workExperience={resumeData.workExperience}
          expanded={sectionExpanded.workExperience}
          onToggle={() => toggleSection("experience")}
          onMoveUp={() => moveSectionUp("workExperience")}
          onMoveDown={() => moveSectionDown("workExperience")}
          onAdd={addWorkExperience}
          onUpdate={updateWorkExperience}
          onRemove={removeWorkExperience}
          onMove={moveWorkExperience}
          onGenerateBullets={(index: number) => {
            const exp = resumeData.workExperience[index];
            if (exp) handleAIWorkExp(exp.id);
          }}
          analyzeResult={analyzeResult}
          highlightKeywords={highlightKeywords}
        />
      </Suspense>

      {/* Education Section */}
      <Suspense fallback={<div>Loading education...</div>}>
        <LazyEducationSection
          education={resumeData.education}
          expanded={sectionExpanded.education}
          onToggle={() => toggleSection("education")}
          onMoveUp={() => moveSectionUp("education")}
          onMoveDown={() => moveSectionDown("education")}
          onAdd={addEducation}
          onUpdate={updateEducation}
          onRemove={removeEducation}
          onMove={moveSection}
        />
      </Suspense>

      {/* Skills Section */}
      <Suspense fallback={<div>Loading skills...</div>}>
        <LazySkillsSection
          skillCategories={resumeData.skillCategories}
          expanded={sectionExpanded.skillCategories}
          onToggle={() => toggleSection("skills")}
          onMoveUp={() => moveSectionUp("skillCategories")}
          onMoveDown={() => moveSectionDown("skillCategories")}
          onAddCategory={addSkillCategory}
          onUpdateCategory={updateSkillCategory}
          onRemoveCategory={removeSkillCategory}
          onAddSkill={addSkill}
          onRemoveSkill={removeSkill}
          highlightKeywords={highlightKeywords}
          analyzeResult={analyzeResult}
        />
      </Suspense>

      {/* Custom Sections */}
      <Suspense fallback={<div>Loading custom sections...</div>}>
        <LazyCustomSections
          customSections={resumeData.customSections || []}
          sectionOrder={resumeData.sectionOrder || []}
          onAdd={addCustomSection}
          onUpdate={updateCustomSection}
          onRemove={removeCustomSection}
          onMove={moveSection}
        />
      </Suspense>

      {/* Version History UI */}
      <div className="mb-4">
        <Button
          onClick={() => setShowVersions((v) => !v)}
          variant="outline"
          size="sm"
        >
          {showVersions ? "Hide Version History" : "Show Version History"}
        </Button>
        {showVersions && (
          <div className="mt-2 border rounded p-2 bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-sm">Version History</span>
              <Button
                onClick={handleClearVersions}
                size="sm"
                variant="destructive"
              >
                Clear All
              </Button>
            </div>
            {versions.length === 0 && (
              <div className="text-xs text-gray-500">
                No versions saved yet.
              </div>
            )}
            <ul className="space-y-1 max-h-40 overflow-y-auto">
              {versions.map((v, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between text-xs"
                >
                  <span>{new Date(v.timestamp).toLocaleString()}</span>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleRestoreVersion(i)}
                  >
                    Restore
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Export/Import UI */}
      <div className="mb-4 flex gap-2 items-center">
        <Button onClick={handleExport} variant="outline" size="sm">
          Export Resume (JSON)
        </Button>
        <label className="inline-block cursor-pointer text-sm font-medium">
          <span className="sr-only">Import Resume</span>
          <input
            type="file"
            accept="application/json"
            onChange={handleImport}
            className="hidden"
          />
          <span className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200">
            Import Resume
          </span>
        </label>
      </div>

      {/* Advanced Analytics UI */}
      <div className="mb-4">
        <div className="font-semibold text-sm mb-1">Section Analytics</div>
        <table className="w-full text-xs border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-1 border">Section</th>
              <th className="p-1 border">Words</th>
              <th className="p-1 border">Characters</th>
              <th className="p-1 border">Keyword Coverage</th>
              <th className="p-1 border">Readability</th>
              <th className="p-1 border">ATS</th>
            </tr>
          </thead>
          <tbody>
            {sectionAnalytics.map((sec) => (
              <tr key={sec.name}>
                <td className="p-1 border">{sec.name}</td>
                <td className="p-1 border text-center">{sec.wordCount}</td>
                <td className="p-1 border text-center">{sec.charCount}</td>
                <td className="p-1 border text-center">
                  {sec.keywordCoverage}%
                </td>
                <td className="p-1 border text-center">{sec.readability}</td>
                <td className="p-1 border text-center">{sec.ats}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Keyword Frequency Table */}
        {analyzeResult?.missingKeywords && (
          <div className="mt-2">
            <div className="font-semibold text-xs mb-1">Keyword Frequency</div>
            <table className="w-full text-xs border">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-1 border">Keyword</th>
                  <th className="p-1 border">Count</th>
                </tr>
              </thead>
              <tbody>
                {analyzeResult.missingKeywords.map((k) => (
                  <tr key={k}>
                    <td className="p-1 border">{k}</td>
                    <td className="p-1 border text-center">
                      {sectionAnalytics[0]?.keywordFreq?.[k.toLowerCase()] || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Debounce utility
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
}

// Returns an object with sentence, word, and syllable counts for flesch()
function counts(text: string) {
  // Count sentences (ends with . ! ?)
  const sentenceCount = (text.match(/[\.\!\?]+/g) || []).length || 1;
  // Count words (split by whitespace)
  const words = text.match(/\b\w+\b/g) || [];
  const wordCount = words.length;
  // Count syllables (very rough estimate: count vowel groups in each word)
  const syllableCount = words.reduce((sum, word) => {
    const syl = word
      .toLowerCase()
      .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "")
      .replace(/^y/, "")
      .match(/[aeiouy]{1,2}/g);
    return sum + (syl ? syl.length : 1);
  }, 0);

  return {
    sentences: sentenceCount,
    words: wordCount,
    syllables: syllableCount,
  };
}

