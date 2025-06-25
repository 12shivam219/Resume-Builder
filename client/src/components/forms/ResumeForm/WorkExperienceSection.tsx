import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronUp, ChevronDown, Briefcase, Plus, Trash2 } from "lucide-react";
import { WorkExperience } from "@shared/schema";

interface WorkExperienceSectionProps {
  workExperience: WorkExperience[];
  expanded: boolean;
  onToggle: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAdd: () => void;
  onUpdate: (id: string, data: Partial<WorkExperience>) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  onGenerateBullets: (index: number) => void;
  analyzeResult: { missingKeywords: string[]; suggestions: string } | null;
  highlightKeywords: (text: string, keywords: string[]) => React.ReactNode;
}

export const WorkExperienceSection = React.memo<WorkExperienceSectionProps>(
  function WorkExperienceSection({
    workExperience,
    expanded,
    onToggle,
    onMoveUp,
    onMoveDown,
    onAdd,
    onUpdate,
    onRemove,
    onMove,
    onGenerateBullets,
    analyzeResult,
    highlightKeywords,
  }) {
    // Accessibility: focus management and ARIA
    // Advanced validation: at least one job title and company required if any experience exists
    const errors = useMemo(() => {
      return workExperience.map((exp) => ({
        title: !exp.title?.trim() ? "Job title is required." : "",
        company: !exp.company?.trim() ? "Company is required." : "",
      }));
    }, [workExperience]);

    return (
      <Card key="workExperience" className="mb-4 shadow rounded-lg">
        <CardContent className="p-6">
          <div className="section-header flex items-center justify-between mb-2">
            <h3 className="section-title flex items-center text-lg font-semibold">
              <Briefcase className="section-icon mr-2" /> Work Experience
            </h3>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onMoveUp}
                aria-label="Move section up"
              >
                <ChevronUp />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onMoveDown}
                aria-label="Move section down"
              >
                <ChevronDown />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                aria-label="Toggle section"
              >
                {expanded ? <ChevronUp /> : <ChevronDown />}
              </Button>
            </div>
          </div>
          {expanded && (
            <div className="space-y-4">
              {workExperience.map((exp, idx) => (
                <div
                  key={exp.id}
                  className="bg-gray-50 rounded p-4 mb-2 shadow-sm"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div>
                      <Label htmlFor={`title-${exp.id}`}>Job Title</Label>
                      <Input
                        id={`title-${exp.id}`}
                        value={exp.title}
                        onChange={(e) =>
                          onUpdate(exp.id, { title: e.target.value })
                        }
                        aria-required="true"
                        aria-invalid={!!errors[idx]?.title}
                        aria-describedby={
                          errors[idx]?.title
                            ? `title-error-${exp.id}`
                            : undefined
                        }
                        placeholder="Job Title"
                        className="mb-2"
                      />
                      {errors[idx]?.title && (
                        <span
                          id={`title-error-${exp.id}`}
                          className="text-red-600 text-xs"
                        >
                          {errors[idx].title}
                        </span>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`company-${exp.id}`}>Company</Label>
                      <Input
                        id={`company-${exp.id}`}
                        value={exp.company}
                        onChange={(e) =>
                          onUpdate(exp.id, { company: e.target.value })
                        }
                        aria-required="true"
                        aria-invalid={!!errors[idx]?.company}
                        aria-describedby={
                          errors[idx]?.company
                            ? `company-error-${exp.id}`
                            : undefined
                        }
                        placeholder="Company"
                        className="mb-2"
                      />
                      {errors[idx]?.company && (
                        <span
                          id={`company-error-${exp.id}`}
                          className="text-red-600 text-xs"
                        >
                          {errors[idx].company}
                        </span>
                      )}
                    </div>
                  </div>
                  <Textarea
                    className="w-full border rounded p-2 text-sm mb-2"
                    value={exp.description}
                    onChange={(e) =>
                      onUpdate(exp.id, { description: e.target.value })
                    }
                    placeholder="Describe your responsibilities and achievements..."
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onGenerateBullets(idx)}
                    >
                      Suggest Bullets
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemove(exp.id)}
                    >
                      <Trash2 /> Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="secondary"
                onClick={onAdd}
                className="w-full mt-2"
              >
                <Plus className="mr-1" /> Add Work Experience
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);
