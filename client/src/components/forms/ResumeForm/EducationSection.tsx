import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ChevronUp,
  ChevronDown,
  GraduationCap,
  Plus,
  Trash2,
} from "lucide-react";
import { Education } from "@shared/schema";

interface EducationSectionProps {
  education: Education[];
  expanded: boolean;
  onToggle: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAdd: () => void;
  onUpdate: (id: string, data: Partial<Education>) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
}

export const EducationSection = React.memo<EducationSectionProps>(
  function EducationSection({
    education,
    expanded,
    onToggle,
    onMoveUp,
    onMoveDown,
    onAdd,
    onUpdate,
    onRemove,
    onMove,
  }) {
    // Advanced validation: required fields
    const errors = useMemo(() => {
      return education.map((edu) => ({
        degree: !edu.degree?.trim() ? "Degree is required." : "",
        field: !edu.field?.trim() ? "Field is required." : "",
        institution: !edu.institution?.trim() ? "Institution is required." : "",
      }));
    }, [education]);

    return (
      <Card key="education">
        <CardContent className="p-6">
          <div className="section-header flex items-center justify-between">
            <h3 className="section-title flex items-center">
              <GraduationCap className="section-icon" /> Education
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
              {education.map((edu, index) => (
                <div
                  key={edu.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm font-medium text-gray-600">
                        Education #{index + 1}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMove(edu.id, "up")}
                        disabled={index === 0}
                        aria-label="Move education up"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMove(edu.id, "down")}
                        disabled={index === education.length - 1}
                        aria-label="Move education down"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemove(edu.id)}
                        className="text-destructive hover:text-red-700"
                        aria-label="Remove education"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="form-grid">
                    <div className="form-field">
                      <Label
                        className="form-label"
                        htmlFor={`degree-${edu.id}`}
                      >
                        Degree *
                      </Label>
                      <Input
                        id={`degree-${edu.id}`}
                        className="form-input"
                        placeholder="B.Sc. Computer Science"
                        value={edu.degree}
                        onChange={(e) =>
                          onUpdate(edu.id, { degree: e.target.value })
                        }
                        aria-required="true"
                        aria-invalid={!!errors[index]?.degree}
                        aria-describedby={
                          errors[index]?.degree
                            ? `degree-error-${edu.id}`
                            : undefined
                        }
                      />
                      {errors[index]?.degree && (
                        <span
                          id={`degree-error-${edu.id}`}
                          className="text-red-600 text-xs"
                        >
                          {errors[index].degree}
                        </span>
                      )}
                    </div>
                    <div className="form-field">
                      <Label className="form-label" htmlFor={`field-${edu.id}`}>
                        Field *
                      </Label>
                      <Input
                        id={`field-${edu.id}`}
                        className="form-input"
                        placeholder="Software Engineering"
                        value={edu.field}
                        onChange={(e) =>
                          onUpdate(edu.id, { field: e.target.value })
                        }
                        aria-required="true"
                        aria-invalid={!!errors[index]?.field}
                        aria-describedby={
                          errors[index]?.field
                            ? `field-error-${edu.id}`
                            : undefined
                        }
                      />
                      {errors[index]?.field && (
                        <span
                          id={`field-error-${edu.id}`}
                          className="text-red-600 text-xs"
                        >
                          {errors[index].field}
                        </span>
                      )}
                    </div>
                    <div className="form-field">
                      <Label
                        className="form-label"
                        htmlFor={`institution-${edu.id}`}
                      >
                        Institution *
                      </Label>
                      <Input
                        id={`institution-${edu.id}`}
                        className="form-input"
                        placeholder="University of California"
                        value={edu.institution}
                        onChange={(e) =>
                          onUpdate(edu.id, { institution: e.target.value })
                        }
                        aria-required="true"
                        aria-invalid={!!errors[index]?.institution}
                        aria-describedby={
                          errors[index]?.institution
                            ? `institution-error-${edu.id}`
                            : undefined
                        }
                      />
                      {errors[index]?.institution && (
                        <span
                          id={`institution-error-${edu.id}`}
                          className="text-red-600 text-xs"
                        >
                          {errors[index].institution}
                        </span>
                      )}
                    </div>
                    <div className="form-field">
                      <Label className="form-label">Start Year</Label>
                      <Input
                        type="number"
                        className="form-input"
                        placeholder="2018"
                        value={edu.startYear || ""}
                        onChange={(e) =>
                          onUpdate(edu.id, {
                            startYear: e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          })
                        }
                      />
                    </div>
                    <div className="form-field">
                      <Label className="form-label">End Year</Label>
                      <Input
                        type="number"
                        className="form-input"
                        placeholder="2022"
                        value={edu.endYear || ""}
                        onChange={(e) =>
                          onUpdate(edu.id, {
                            endYear: e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          })
                        }
                      />
                    </div>
                    <div className="form-field">
                      <Label className="form-label">GPA</Label>
                      <Input
                        type="number"
                        className="form-input"
                        placeholder="3.8"
                        value={edu.gpa || ""}
                        onChange={(e) =>
                          onUpdate(edu.id, {
                            gpa: e.target.value
                              ? parseFloat(e.target.value)
                              : undefined,
                          })
                        }
                      />
                    </div>
                    <div className="form-field md:col-span-2">
                      <Label className="form-label">Location</Label>
                      <Input
                        className="form-input"
                        placeholder="Berkeley, CA"
                        value={edu.location}
                        onChange={(e) =>
                          onUpdate(edu.id, { location: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
              {education.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <GraduationCap className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>No education added yet</p>
                  <Button onClick={onAdd} variant="outline" className="mt-4">
                    <Plus className="mr-2 h-4 w-4" /> Add Your First Education
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
