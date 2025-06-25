import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronUp, ChevronDown, Settings, Plus, Trash2 } from "lucide-react";
import { SkillCategory } from "@shared/schema";

interface SkillsSectionProps {
  skillCategories: SkillCategory[];
  expanded: boolean;
  onToggle: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddCategory: () => void;
  onUpdateCategory: (id: string, data: Partial<SkillCategory>) => void;
  onRemoveCategory: (id: string) => void;
  onAddSkill: (categoryId: string, skill: string) => void;
  onRemoveSkill: (categoryId: string, skillIndex: number) => void;
  highlightKeywords: (text: string, keywords: string[]) => React.ReactNode;
  analyzeResult: { missingKeywords: string[]; suggestions: string } | null;
}

export const SkillsSection = React.memo<SkillsSectionProps>(
  function SkillsSection({
    skillCategories,
    expanded,
    onToggle,
    onMoveUp,
    onMoveDown,
    onAddCategory,
    onUpdateCategory,
    onRemoveCategory,
    onAddSkill,
    onRemoveSkill,
    highlightKeywords,
    analyzeResult,
  }) {
    // Advanced validation: require at least one skill per category
    const errors = useMemo(() => {
      return skillCategories.map((cat) => ({
        name: !cat.name?.trim() ? "Category name is required." : "",
        skills:
          cat.skills.length === 0 ? "At least one skill is required." : "",
      }));
    }, [skillCategories]);

    return (
      <Card key="skillCategories" className="mb-4 shadow rounded-lg">
        <CardContent className="p-6">
          <div className="section-header flex items-center justify-between mb-2">
            <h3 className="section-title flex items-center text-lg font-semibold">
              <Settings className="section-icon mr-2" /> Skills & Technologies
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
              {skillCategories.map((cat, idx) => (
                <div
                  key={cat.id}
                  className="bg-gray-50 rounded p-4 mb-2 shadow-sm"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div>
                      <Label htmlFor={`cat-name-${cat.id}`}>
                        Category Name
                      </Label>
                      <Input
                        id={`cat-name-${cat.id}`}
                        value={cat.name}
                        onChange={(e) =>
                          onUpdateCategory(cat.id, { name: e.target.value })
                        }
                        aria-required="true"
                        aria-invalid={!!errors[idx]?.name}
                        aria-describedby={
                          errors[idx]?.name
                            ? `cat-name-error-${cat.id}`
                            : undefined
                        }
                        placeholder="e.g. Programming Languages"
                        className="mb-2"
                      />
                      {errors[idx]?.name && (
                        <span
                          id={`cat-name-error-${cat.id}`}
                          className="text-red-600 text-xs"
                        >
                          {errors[idx].name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>Skills</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {cat.skills.map((skill, skillIdx) => (
                        <span
                          key={skillIdx}
                          className="inline-flex items-center bg-blue-100 text-blue-800 rounded px-2 py-1 text-xs"
                        >
                          {skill}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveSkill(cat.id, skillIdx)}
                            aria-label="Remove skill"
                          >
                            <Trash2 className="ml-1 w-3 h-3" />
                          </Button>
                        </span>
                      ))}
                    </div>
                    <Input
                      placeholder="Add a skill and press Enter"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value.trim()) {
                          onAddSkill(cat.id, e.currentTarget.value.trim());
                          e.currentTarget.value = "";
                        }
                      }}
                      className="mb-2"
                    />
                    {errors[idx]?.skills && (
                      <span className="text-red-600 text-xs">
                        {errors[idx].skills}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveCategory(cat.id)}
                    className="mt-2"
                  >
                    <Trash2 /> Remove Category
                  </Button>
                </div>
              ))}
              <Button
                variant="secondary"
                onClick={onAddCategory}
                className="w-full mt-2"
              >
                <Plus className="mr-1" /> Add Skill Category
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);
