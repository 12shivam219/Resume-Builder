import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ChevronUp, ChevronDown, Plus, Trash2 } from "lucide-react";
import { CustomSection } from "@shared/schema";

interface CustomSectionsProps {
  customSections: CustomSection[];
  sectionOrder: string[];
  onAdd: () => void;
  onUpdate: (id: string, data: Partial<CustomSection>) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
}

export const CustomSections = React.memo<CustomSectionsProps>(
  function CustomSections({
    customSections,
    sectionOrder,
    onAdd,
    onUpdate,
    onRemove,
    onMove,
  }) {
    // Advanced validation: require title for each custom section
    const errors = useMemo(() => {
      return customSections.map((sec) => ({
        title: !sec.title?.trim() ? "Section title is required." : "",
      }));
    }, [customSections]);

    return (
      <>
        {customSections.map((section, idx) => (
          <Card key={section.id} className="mb-4 shadow rounded-lg">
            <CardContent className="p-6">
              <div className="section-header flex items-center justify-between mb-2">
                <Input
                  className="section-title text-lg font-semibold border-none bg-transparent p-0 focus:ring-0 focus:outline-none"
                  value={section.title}
                  onChange={(e) =>
                    onUpdate(section.id, { title: e.target.value })
                  }
                  aria-required="true"
                  aria-invalid={!!errors[idx]?.title}
                  aria-describedby={
                    errors[idx]?.title
                      ? `custom-title-error-${section.id}`
                      : undefined
                  }
                  placeholder="Section Title"
                />
                {errors[idx]?.title && (
                  <span
                    id={`custom-title-error-${section.id}`}
                    className="text-red-600 text-xs ml-2"
                  >
                    {errors[idx].title}
                  </span>
                )}
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMove(section.id, "up")}
                    disabled={idx === 0}
                    aria-label="Move custom section up"
                  >
                    <ChevronUp />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMove(section.id, "down")}
                    disabled={idx === customSections.length - 1}
                    aria-label="Move custom section down"
                  >
                    <ChevronDown />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(section.id)}
                    aria-label="Remove custom section"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
              <Textarea
                className="w-full border rounded p-2 text-sm mb-2"
                value={section.content}
                onChange={(e) =>
                  onUpdate(section.id, { content: e.target.value })
                }
                placeholder="Describe this section..."
                rows={4}
              />
            </CardContent>
          </Card>
        ))}
        <div className="text-center py-4">
          <Button
            onClick={onAdd}
            variant="outline"
            size="sm"
            aria-label="Add custom section"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Custom Section
          </Button>
        </div>
      </>
    );
  }
);
