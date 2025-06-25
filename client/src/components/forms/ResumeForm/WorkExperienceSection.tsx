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
      <Card key="workExperience">
        <CardContent className="p-6">
          <div className="section-header flex items-center justify-between">
            <h3 className="section-title flex items-center">
              <Briefcase className="section-icon" /> Work Experience
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
              {workExperience.map((exp, index) => (
                <div
                  key={exp.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm font-medium text-gray-600">
                        Experience #{index + 1}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMove(exp.id, "up")}
                        disabled={index === 0}
                        aria-label="Move experience up"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMove(exp.id, "down")}
                        disabled={index === workExperience.length - 1}
                        aria-label="Move experience down"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemove(exp.id)}
                        className="text-destructive hover:text-red-700"
                        aria-label="Remove experience"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="form-grid">
                    <div className="form-field">
                      <Label className="form-label" htmlFor={`title-${exp.id}`}>
                        Job Title *
                      </Label>
                      <Input
                        id={`title-${exp.id}`}
                        className="form-input"
                        placeholder="Senior Software Engineer"
                        value={exp.title}
                        onChange={(e) =>
                          onUpdate(exp.id, { title: e.target.value })
                        }
                        aria-required="true"
                        aria-invalid={!!errors[index]?.title}
                        aria-describedby={
                          errors[index]?.title
                            ? `title-error-${exp.id}`
                            : undefined
                        }
                      />
                      {errors[index]?.title && (
                        <span
                          id={`title-error-${exp.id}`}
                          className="text-red-600 text-xs"
                        >
                          {errors[index].title}
                        </span>
                      )}
                    </div>
                    <div className="form-field">
                      <Label
                        className="form-label"
                        htmlFor={`company-${exp.id}`}
                      >
                        Company *
                      </Label>
                      <Input
                        id={`company-${exp.id}`}
                        className="form-input"
                        placeholder="Tech Solutions Inc."
                        value={exp.company}
                        onChange={(e) =>
                          onUpdate(exp.id, { company: e.target.value })
                        }
                        aria-required="true"
                        aria-invalid={!!errors[index]?.company}
                        aria-describedby={
                          errors[index]?.company
                            ? `company-error-${exp.id}`
                            : undefined
                        }
                      />
                      {errors[index]?.company && (
                        <span
                          id={`company-error-${exp.id}`}
                          className="text-red-600 text-xs"
                        >
                          {errors[index].company}
                        </span>
                      )}
                    </div>
                    <div className="form-field">
                      <Label className="form-label">Start Date *</Label>
                      <Input
                        type="month"
                        className="form-input"
                        value={exp.startDate}
                        onChange={(e) =>
                          onUpdate(exp.id, { startDate: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-field">
                      <Label className="form-label">End Date</Label>
                      <div className="flex items-center space-x-3">
                        <Input
                          type="month"
                          className="form-input flex-1"
                          value={exp.endDate}
                          onChange={(e) =>
                            onUpdate(exp.id, { endDate: e.target.value })
                          }
                          disabled={exp.current}
                        />
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={exp.current}
                            onCheckedChange={(checked) =>
                              onUpdate(exp.id, {
                                current: checked as boolean,
                                endDate: checked ? "" : exp.endDate,
                              })
                            }
                          />
                          <Label className="text-sm text-gray-600">
                            Current
                          </Label>
                        </div>
                      </div>
                    </div>
                    <div className="form-field md:col-span-2">
                      <Label className="form-label">Location</Label>
                      <Input
                        className="form-input"
                        placeholder="San Francisco, CA"
                        value={exp.location}
                        onChange={(e) =>
                          onUpdate(exp.id, { location: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-field md:col-span-2">
                      <Label
                        className="form-label"
                        htmlFor={`description-${exp.id}`}
                      >
                        Description
                      </Label>
                      <Textarea
                        id={`description-${exp.id}`}
                        rows={4}
                        className="form-textarea"
                        placeholder="• Led development of microservices architecture..."
                        value={exp.description}
                        onChange={(e) =>
                          onUpdate(exp.id, { description: e.target.value })
                        }
                        aria-multiline="true"
                      />
                      <Button
                        type="button"
                        size="sm"
                        className="mt-2"
                        onClick={() => onGenerateBullets(index)}
                      >
                        Generate Bullets
                      </Button>
                      <p className="mt-1 text-xs text-gray-500">
                        Use bullet points (•) to highlight key achievements
                      </p>
                      {analyzeResult &&
                        analyzeResult.missingKeywords.length > 0 && (
                          <div className="mt-2 text-xs text-yellow-700 bg-yellow-50 p-2 rounded">
                            <b>Missing keywords in description:</b>
                            <div>
                              {highlightKeywords(
                                exp.description,
                                analyzeResult.missingKeywords
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}
              {workExperience.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Briefcase className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>No work experience added yet</p>
                  <Button onClick={onAdd} variant="outline" className="mt-4">
                    <Plus className="mr-2 h-4 w-4" /> Add Your First Experience
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);
