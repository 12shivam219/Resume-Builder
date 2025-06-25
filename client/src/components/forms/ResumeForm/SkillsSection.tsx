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
      <Card key="skillCategories">
        <CardContent className="p-6">
          <div className="section-header flex items-center justify-between">
            <h3 className="section-title flex items-center">
              <Settings className="section-icon" /> Skills & Technologies
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
            <div className="space-y-6">
              {skillCategories.map((category, idx) => (
                <div key={category.id}>
                  <div className="flex items-center justify-between mb-3">
                    <Input
                      className="text-sm font-medium bg-transparent border-none focus:ring-0 focus:outline-none text-gray-700 p-0"
                      placeholder="Programming Languages"
                      value={category.name}
                      onChange={(e) =>
                        onUpdateCategory(category.id, { name: e.target.value })
                      }
                      aria-required="true"
                      aria-invalid={!!errors[idx]?.name}
                      aria-describedby={
                        errors[idx]?.name
                          ? `catname-error-${category.id}`
                          : undefined
                      }
                    />
                    {errors[idx]?.name && (
                      <span
                        id={`catname-error-${category.id}`}
                        className="text-red-600 text-xs"
                      >
                        {errors[idx].name}
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveCategory(category.id)}
                      className="text-destructive hover:text-red-700"
                      aria-label="Remove skill category"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {category.skills.map((skill, skillIndex) => (
                      <span key={skillIndex} className="skill-tag">
                        {analyzeResult &&
                        analyzeResult.missingKeywords.includes(
                          skill.toLowerCase()
                        ) ? (
                          <mark
                            style={{ background: "#ffe066", color: "#222" }}
                          >
                            {skill}
                          </mark>
                        ) : (
                          skill
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 p-0 h-auto text-primary hover:text-blue-700"
                          onClick={() => onRemoveSkill(category.id, skillIndex)}
                          aria-label="Remove skill"
                        >
                          ×
                        </Button>
                      </span>
                    ))}
                  </div>
                  {errors[idx]?.skills && (
                    <span className="text-red-600 text-xs">
                      {errors[idx].skills}
                    </span>
                  )}
                  <div className="flex items-center space-x-2">
                    <Input
                      className="flex-1 text-sm"
                      placeholder="Add a skill..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          onAddSkill(category.id, input.value);
                          input.value = "";
                        }
                      }}
                      aria-label="Add skill"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        const input =
                          e.currentTarget.parentElement?.querySelector(
                            "input"
                          ) as HTMLInputElement;
                        if (input && input.value.trim()) {
                          onAddSkill(category.id, input.value);
                          input.value = "";
                        }
                      }}
                      aria-label="Add skill button"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              ))}
              {skillCategories.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>No skills added yet</p>
                  <Button
                    onClick={onAddCategory}
                    variant="outline"
                    className="mt-4"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Your First Skill
                    Category
                  </Button>
                </div>
              )}
              {skillCategories.length > 0 && (
                <div className="text-center py-4 border-t border-gray-200">
                  <Button onClick={onAddCategory} variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add Skill Category
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
